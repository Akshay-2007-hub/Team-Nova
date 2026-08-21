from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json

from live_engine import start_camera, get_live_data, generate_frames, update_config, config

app = FastAPI(
    title="VayuMitra X API",
    description="Multi-Modal Optical Atmospheric Intelligence System",
    version="2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    print("Starting VayuMitra X backend...")
    start_camera()

@app.get("/")
def home():
    return {
        "project": "VayuMitra X",
        "system": "Optical Scattering Atmospheric Intelligence",
        "status": "Backend Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "camera_engine": "running"
    }

@app.get("/api/live-data")
def live_data():
    return get_live_data()

@app.get("/api/video-feed")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

class ConfigModel(BaseModel):
    sensitivity: int = None
    brightness_threshold: int = None
    learning_rate: float = None

@app.get("/api/config")
def get_config():
    return config

@app.post("/api/config")
def set_config(new_config: ConfigModel):
    updated = update_config(new_config.dict(exclude_none=True))
    return {"status": "success", "config": updated}

from database import SessionLocal, TelemetryLog

@app.get("/api/history")
def get_history(limit: int = 100):
    db = SessionLocal()
    logs = db.query(TelemetryLog).order_by(TelemetryLog.timestamp.desc()).limit(limit).all()
    db.close()
    return logs

from live_engine import load_baseline

@app.get("/api/baseline")
def get_baseline():
    return load_baseline()

@app.get("/api/predict")
def predict_pm25():
    db = SessionLocal()
    logs = db.query(TelemetryLog).order_by(TelemetryLog.timestamp.asc()).limit(500).all()
    db.close()
    
    if len(logs) < 10:
        return {"prediction": None, "message": "Not enough data for prediction"}
        
    # Basic Linear Regression: y = mx + c
    x = [i for i in range(len(logs))]
    y = [log.pm25 for log in logs]
    
    n = len(x)
    sum_x = sum(x)
    sum_y = sum(y)
    sum_xy = sum([x[i] * y[i] for i in range(n)])
    sum_xx = sum([x[i] ** 2 for i in range(n)])
    
    denominator = (n * sum_xx - sum_x ** 2)
    if denominator == 0:
        return {"prediction": y[-1], "trend": "stable"}
        
    m = (n * sum_xy - sum_x * sum_y) / denominator
    c = (sum_y - m * sum_x) / n
    
    # Predict PM2.5 level 60 time units into the future
    future_x = n + 60
    prediction = m * future_x + c
    
    trend = "increasing" if m > 0.5 else "decreasing" if m < -0.5 else "stable"
    
    return {
        "prediction": max(0, round(prediction, 1)),
        "trend": trend,
        "slope": round(m, 3),
        "current": y[-1]
    }

@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = get_live_data()
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(0.5) # send data 2 times a second
    except WebSocketDisconnect:
        print("Client disconnected")