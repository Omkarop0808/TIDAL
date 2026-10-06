from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import asyncio
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google import genai
from google.genai import types

# New ML and Services
from realtime import manager, live_data_broadcaster
from services.environment import env_service
from services.drift import drift_engine
from services.vision import vision_service
from services.dispatch import dispatch_service
from ml.model import risk_model
from ml.features import extract_features

load_dotenv()

app = FastAPI(title="Tidal Backend API", version="2.0.0")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(live_data_broadcaster())

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class ScenarioModifier(BaseModel):
    wind_speed: int
    rainfall_increase: int
    barrier_efficiency: int
    cleanup_teams: int

class DispatchRequest(BaseModel):
    hotspots: list

class ChatMessage(BaseModel):
    message: str

# --- ROUTES ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Tidal Backend v2 is running"}

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/v1/telemetry/summary")
def get_telemetry_summary():
    now = datetime.now()
    live_env = env_service.get_current_data()
    
    # Feature extraction for overall Mumbai risk
    features = extract_features(live_env, 19.10, 72.82)
    predicted_debris = int(risk_model.predict(features) * 100) # Base multiplier for the hackathon
    
    return {
        "predicted_debris": predicted_debris,
        "high_risk_zones": 3 if predicted_debris < 2800 else (6 if predicted_debris < 3000 else 8),
        "cleanup_teams_active": 12,
        "recovery_potential": max(40, 95 - int(features["wind_speed"] * 0.5)),
        "recent_activity": [
            {"time": (now - timedelta(minutes=6)).strftime("%H:%M"), "event": "Sector 4 (Versova Creek) reported floating polymer clusters.", "type": "info"},
            {"time": (now - timedelta(minutes=25)).strftime("%H:%M"), "event": f"XGBoost detected elevated beaching probability.", "type": "alert"},
            {"time": (now - timedelta(minutes=95)).strftime("%H:%M"), "event": "Vessel TIDAL-SKIM-02 mobilized to Bandra shoreline.", "type": "dispatch"},
        ]
    }

@app.post("/api/v1/simulate/scenario")
def run_simulation(scenario: ScenarioModifier):
    # This now utilizes the Monte-Carlo drift engine implicitly by overriding env_data
    live_env = env_service.get_current_data() or {"weather": {}, "marine": {}}
    if "weather" not in live_env: live_env["weather"] = {}
    live_env["weather"]["wind_speed_10m"] = scenario.wind_speed
    
    res = drift_engine.simulate_drift_monte_carlo(19.10, 72.70, live_env, hours=24, num_particles=500)
    beached_perc = res["beached_percent_final"]
    
    predicted = int(62 + beached_perc * 2.5 + scenario.rainfall_increase * 1.5 - scenario.barrier_efficiency * 0.5)
    
    curve_data = [int(p["beached_percent"]) for p in res["trajectory"]]
    
    return {
        "predicted_accumulation_kg": max(5, predicted),
        "peak_risk_time_hours": 36,
        "curve_data": curve_data,
        "ai_confidence": 85
    }

@app.get("/api/v1/hotspots/spatial")
def get_hotspots():
    live_env = env_service.get_current_data()
    
    zones = [
        {"name": "Juhu", "lat": 19.103, "lon": 72.825},
        {"name": "Versova", "lat": 19.135, "lon": 72.814},
        {"name": "Bandra", "lat": 19.049, "lon": 72.818}
    ]
    
    hotspots = []
    for z in zones:
        feat = extract_features(live_env, z["lat"], z["lon"])
        pred_kg = int(risk_model.predict(feat) * 50) # zone multiplier
        
        # Explainability via SHAP-like contributions
        contribs = risk_model.get_feature_contributions(feat)
        top_driver = list(contribs.keys())[0] if contribs else "wind_speed"
        
        risk_pct = min(100, int((pred_kg / 500) * 100))
        severity = "Critical" if risk_pct > 80 else ("High" if risk_pct > 50 else "Medium")
        
        hotspots.append({
            "zone_name": z["name"],
            "lat": z["lat"],
            "lon": z["lon"],
            "risk_percentage": risk_pct,
            "estimated_debris_kg": pred_kg,
            "peak_arrival_hours": 18,
            "severity": severity,
            "top_driver": f"{top_driver} ({contribs.get(top_driver, 0):.1f})"
        })
        
    return hotspots

from services.store import store_service
import uuid

@app.post("/api/v1/recovery/observation")
async def report_observation(file: UploadFile = File(...)):
    unique_id = uuid.uuid4().hex
    temp_file_path = f"temp_{unique_id}_{file.filename}"
    with open(temp_file_path, "wb") as f:
        f.write(await file.read())

    # 1. YOLOv8 / YOLO11 vision detection + CLAHE
    vision_result = vision_service.detect_debris(temp_file_path)
    
    # 2. Gemini material analysis
    try:
        gemini_json_str = vision_service.analyze_material_gemini(temp_file_path)
        gemini_result = json.loads(gemini_json_str)
    except Exception as e:
        gemini_result = {
            "composition": "Fallback: Fishing Nets and PET",
            "category": "Upcyclable",
            "matched_upcycler": "Econet India Solutions",
            "estimated_weight_kg": 15
        }
        
    ai_analysis = {
        "composition": gemini_result.get("composition", "Unknown"),
        "estimated_weight_kg": gemini_result.get("estimated_weight_kg", 5),
        "category": gemini_result.get("category", "Unknown"),
        "item_count": vision_result.get("item_count", 0),
        "bounding_boxes": vision_result.get("bounding_boxes", [])
    }
    
    matched_upcycler = gemini_result.get("matched_upcycler", "Local Recycling")
    
    # 3. Save to Store
    store_service.save_field_report(ai_analysis, matched_upcycler, temp_file_path)
        
    if os.path.exists(temp_file_path):
        os.remove(temp_file_path)
    
    return {
        "status": "success",
        "ai_analysis": ai_analysis,
        "matched_upcycler": matched_upcycler
    }

@app.get("/api/v1/simulate/predictive")
async def get_drift_trajectory(lat: float, lon: float):
    live_env = env_service.get_current_data()
    # Now calls the Monte-Carlo engine but just extracts the center trajectory
    res = drift_engine.simulate_drift_monte_carlo(lat, lon, live_env, hours=72, num_particles=100)
    return {
        "start_point": {"lat": lat, "lon": lon},
        "forecast_hours": 72,
        "trajectory": res["trajectory"]
    }

@app.post("/api/v1/dispatch/optimize")
async def optimize_dispatch(request: DispatchRequest):
    fleet = [
        {"vessel": "TIDAL-SKIM-01", "capacity_kg": 500, "current_location": "Base A"},
        {"vessel": "AQUA-SWEEP-ALPHA", "capacity_kg": 300, "current_location": "Base B"},
        {"vessel": "TIDAL-SKIM-02", "capacity_kg": 600, "current_location": "Base A"},
    ]
    
    # 1. Deterministic Hungarian Algorithm Optimization
    assignments = dispatch_service.optimize_dispatch(request.hotspots, fleet)
    
    # 2. Gemini natural language explanation
    try:
        explanations_str = dispatch_service.explain_assignment(assignments)
        explanations = json.loads(explanations_str)
        # Merge reasoning
        for a in assignments:
            for exp in explanations:
                if exp.get("vessel_name") == a["vessel_name"]:
                    a["reasoning"] = exp.get("reasoning", "Optimal route based on capacity and distance.")
    except:
        for a in assignments:
            a["reasoning"] = "Optimal route based on capacity and distance (Hungarian Match)."
            
    return assignments

@app.post("/api/v1/chat")
async def chat_with_data(chat: ChatMessage):
    # Live data Context
    live_env = env_service.get_current_data()
    try:
        client = genai.Client()
        system_instruction = f"""
        You are Ocean-GPT, an AI assistant for the Tidal Marine Intelligence Platform.
        Current Live Data context:
        - Env: {json.dumps(live_env)}
        """
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=chat.message,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3
            )
        )
        return {"response": response.text}
    except Exception as e:
        return {"response": "Ocean-GPT: I'm running in offline fallback mode."}
