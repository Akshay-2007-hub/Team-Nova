import cv2
import numpy as np
import json


BASELINE_FILE = "baseline.json"


def load_baseline():

    try:
        with open(BASELINE_FILE, "r") as file:
            baseline = json.load(file)

        print("Baseline loaded successfully")

        return baseline

    except FileNotFoundError:

        print("ERROR: baseline.json not found")
        print("Please run baseline_engine.py first")

        return None


def extract_features(mask, previous_brightness):

    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    particle_count = 0

    for contour in contours:

        area = cv2.contourArea(contour)

        if area > 2:
            particle_count += 1

    brightness = float(np.mean(mask))

    total_pixels = mask.shape[0] * mask.shape[1]

    scatter_percentage = (
        np.count_nonzero(mask) / total_pixels
    ) * 100

    temporal_variation = abs(
        brightness - previous_brightness
    )

    return {
        "particle_count": particle_count,
        "scatter_percentage": scatter_percentage,
        "brightness": brightness,
        "temporal_variation": temporal_variation
    }


def calculate_deviation(current, baseline):

    deviations = {}

    for key in current:

        baseline_value = baseline[key]

        # Prevent division by zero
        if baseline_value < 0.01:
            baseline_value = 0.01

        deviation = abs(
            current[key] - baseline[key]
        ) / baseline_value

        deviations[key] = deviation

    return deviations


def calculate_anomaly_score(deviations):

    # Each feature contributes to the final score

    particle_score = min(
        deviations["particle_count"] * 25,
        25
    )

    scatter_score = min(
        deviations["scatter_percentage"] * 25,
        25
    )

    brightness_score = min(
        deviations["brightness"] * 25,
        25
    )

    variation_score = min(
        deviations["temporal_variation"] * 25,
        25
    )

    score = (
        particle_score
        + scatter_score
        + brightness_score
        + variation_score
    )

    return round(min(score, 100), 1)


def get_status(score):

    if score < 30:
        return "NORMAL"

    elif score < 60:
        return "MODERATE"

    else:
        return "HIGH"


def run_anomaly_detection():

    baseline = load_baseline()

    if baseline is None:
        return

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("ERROR: Cannot open webcam")
        return

    print("VayuMitra X Live Anomaly Detection Started")
    print("Press Q to close")

    previous_brightness = baseline["brightness"]

    while True:

        success, frame = cap.read()

        if not success:
            break

        frame = cv2.flip(frame, 1)

        gray = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2GRAY
        )

        blurred = cv2.GaussianBlur(
            gray,
            (5, 5),
            0
        )

        brightness_threshold = 200

        _, mask = cv2.threshold(
            blurred,
            brightness_threshold,
            255,
            cv2.THRESH_BINARY
        )

        kernel = np.ones((3, 3), np.uint8)

        mask = cv2.morphologyEx(
            mask,
            cv2.MORPH_OPEN,
            kernel
        )

        current_features = extract_features(
            mask,
            previous_brightness
        )

        previous_brightness = current_features["brightness"]

        deviations = calculate_deviation(
            current_features,
            baseline
        )

        anomaly_score = calculate_anomaly_score(
            deviations
        )

        status = get_status(anomaly_score)

        # Convert mask to black background display
        display = cv2.cvtColor(
            mask,
            cv2.COLOR_GRAY2BGR
        )

        # Display live values
        cv2.putText(
            display,
            "VAYUMITRA X - LIVE ANALYSIS",
            (20, 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            display,
            f"PARTICLES: {current_features['particle_count']}",
            (20, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            1
        )

        cv2.putText(
            display,
            f"SCATTER: {current_features['scatter_percentage']:.2f}%",
            (20, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            1
        )

        cv2.putText(
            display,
            f"ANOMALY SCORE: {anomaly_score}/100",
            (20, 135),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )

        cv2.putText(
            display,
            f"STATUS: {status}",
            (20, 175),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2
        )

        cv2.imshow(
            "VayuMitra X - Optical Anomaly Detection",
            display
        )

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_anomaly_detection()