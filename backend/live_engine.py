import cv2
import numpy as np
import json
import threading
import time
from collections import deque

BASELINE_FILE = "baseline.json"

# Configuration that can be updated via API
config = {
    "sensitivity": 50,
    "brightness_threshold": 200,
    "learning_rate": 0.01
}

# History tracking for the frontend AreaChart
history = deque(maxlen=50)

latest_data = {
    "particle_count": 0,
    "scatter_percentage": 0.0,
    "brightness": 0.0,
    "temporal_variation": 0.0,
    "optical_anomaly_score": 0.0,
    "risk_score": 0,
    "pm25": 0,
    "sensor_agreement": 100,
    "status": "STARTING",
    "history": []
}

latest_frame = None

def load_baseline():
    try:
        with open(BASELINE_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        print("WARNING: baseline.json not found")
        return {
            "particle_count": 1,
            "scatter_percentage": 0.01,
            "brightness": 1,
            "temporal_variation": 1
        }

def get_status(score):
    if score < 30:
        return "NORMAL"
    elif score < 60:
        return "MODERATE"
    return "HIGH"

import requests
from database import SessionLocal, TelemetryLog

# Weather tracking
current_weather = {"temperature": 20.0, "windspeed": 5.0}
last_weather_update = 0

def fetch_weather():
    global current_weather, last_weather_update
    now = time.time()
    # Update weather every 10 minutes
    if now - last_weather_update > 600:
        try:
            # Using Berlin coordinates as a default placeholder
            res = requests.get("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true", timeout=5)
            if res.status_code == 200:
                data = res.json()
                current_weather["temperature"] = data["current_weather"]["temperature"]
                current_weather["windspeed"] = data["current_weather"]["windspeed"]
                last_weather_update = now
                print(f"Weather updated: {current_weather}")
        except Exception as e:
            print(f"Failed to fetch weather: {e}")
            
def log_to_db(data, weather):
    try:
        db = SessionLocal()
        log = TelemetryLog(
            particle_count=data["particle_count"],
            scatter_percentage=data["scatter_percentage"],
            brightness=data["brightness"],
            optical_anomaly_score=data["optical_anomaly_score"],
            risk_score=data["risk_score"],
            pm25=data["pm25"],
            weather_temperature=weather["temperature"],
            weather_windspeed=weather["windspeed"]
        )
        db.add(log)
        db.commit()
        db.close()
    except Exception as e:
        print(f"Failed to log to DB: {e}")

def camera_loop():
    global latest_data, latest_frame

    baseline = load_baseline()
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("ERROR: Cannot open webcam")
        latest_data["status"] = "CAMERA_ERROR"
        return

    print("VayuMitra X Live Camera Engine Started (Advanced MOG2 + DB + Weather)")

    previous_brightness = baseline["brightness"]
    backSub = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=16, detectShadows=False)

    frame_counter = 0

    while True:
        success, frame = cap.read()
        if not success:
            time.sleep(1)
            continue

        frame = cv2.flip(frame, 1)
        latest_frame = frame.copy()

        # Periodically fetch weather in the background
        if frame_counter % 300 == 0:
            threading.Thread(target=fetch_weather, daemon=True).start()

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        fg_mask = backSub.apply(blurred, learningRate=config["learning_rate"])
        _, bright_mask = cv2.threshold(blurred, config["brightness_threshold"], 255, cv2.THRESH_BINARY)
        combined_mask = cv2.bitwise_or(fg_mask, bright_mask)

        kernel = np.ones((3, 3), np.uint8)
        mask = cv2.morphologyEx(combined_mask, cv2.MORPH_OPEN, kernel)

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        particle_count = 0
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > (100 - config["sensitivity"]):
                particle_count += 1

        brightness = float(np.mean(mask))
        total_pixels = mask.shape[0] * mask.shape[1]
        scatter_percentage = (np.count_nonzero(mask) / total_pixels) * 100
        temporal_variation = abs(brightness - previous_brightness)
        previous_brightness = brightness

        particle_base = max(baseline["particle_count"], 0.01)
        scatter_base = max(baseline["scatter_percentage"], 0.01)
        brightness_base = max(baseline["brightness"], 0.01)
        variation_base = max(baseline["temporal_variation"], 0.01)

        particle_deviation = abs(particle_count - baseline["particle_count"]) / particle_base
        scatter_deviation = abs(scatter_percentage - baseline["scatter_percentage"]) / scatter_base
        brightness_deviation = abs(brightness - baseline["brightness"]) / brightness_base
        variation_deviation = abs(temporal_variation - baseline["temporal_variation"]) / variation_base

        optical_anomaly_score = min(
            (min(particle_deviation * 25, 25) +
             min(scatter_deviation * 25, 25) +
             min(brightness_deviation * 25, 25) +
             min(variation_deviation * 25, 25)),
            100
        )

        # High windspeed disperses particles, modulating the PM2.5 calculation!
        wind_factor = max(1.0, current_weather["windspeed"] / 5.0)

        calculated_risk = min(100, max(0, optical_anomaly_score * 0.85 + (particle_count * 0.5)))
        simulated_pm25 = min(500, max(5, int((calculated_risk * 1.5 + (scatter_percentage * 10)) / wind_factor)))
        
        volatility = temporal_variation
        sensor_agreement = max(50, 100 - min(50, int(volatility * 2)))

        history.append({
            "time": time.strftime("%H:%M:%S"),
            "baseline": 20, 
            "anomaly": round(optical_anomaly_score, 1)
        })

        latest_data = {
            "particle_count": particle_count,
            "scatter_percentage": round(scatter_percentage, 3),
            "brightness": round(brightness, 3),
            "temporal_variation": round(temporal_variation, 3),
            "optical_anomaly_score": round(optical_anomaly_score, 1),
            "risk_score": int(calculated_risk),
            "pm25": simulated_pm25,
            "sensor_agreement": sensor_agreement,
            "status": get_status(optical_anomaly_score),
            "history": list(history),
            "weather": current_weather
        }
        
        # Log to DB every ~5 seconds (assuming ~30 fps, every 150 frames)
        if frame_counter % 150 == 0:
            threading.Thread(target=log_to_db, args=(latest_data, current_weather), daemon=True).start()
            
        frame_counter += 1

def start_camera():
    camera_thread = threading.Thread(target=camera_loop, daemon=True)
    camera_thread.start()

def get_live_data():
    return latest_data

def update_config(new_config):
    global config
    for key, value in new_config.items():
        if key in config:
            config[key] = value
    return config

def generate_frames():
    global latest_frame
    while True:
        if latest_frame is not None:
            ret, buffer = cv2.imencode('.jpg', latest_frame)
            if ret:
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        time.sleep(0.05)