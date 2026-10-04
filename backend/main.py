from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time
import os
import json
from google import genai
from google.genai import types

app = FastAPI(title="Tidal Backend API", version="1.0.0")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend origin
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

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Tidal Backend is running"}

@app.get("/api/v1/telemetry/summary")
def get_telemetry_summary():
    """Returns aggregated data for the Overview dashboard."""
    return {
        "predicted_debris": 2800,
        "high_risk_zones": 7,
        "cleanup_teams_active": 12,
        "recovery_potential": 68,
        "recent_activity": [
            {"time": "08:20", "event": "Sector 4 (Versova Creek) reported floating polymer clusters.", "type": "info"},
            {"time": "09:05", "event": "Inflow velocity spiked by 15% across northern drainage points.", "type": "info"},
            {"time": "10:10", "event": "Juhu beach risk tier shifted to Critical. Automated alert dispatched.", "type": "alert"},
            {"time": "11:30", "event": "Vessel TIDAL-SKIM-02 mobilized to Bandra shoreline.", "type": "dispatch"},
        ]
    }

@app.post("/api/v1/simulate/scenario")
def run_simulation(scenario: ScenarioModifier):
    """
    Simulates debris accumulation based on environmental modifiers.
    Uses a mock algorithmic response for the hackathon.
    """
    base_debris = 62
    
    # Very simple mock logic for the simulation
    wind_impact = (scenario.wind_speed - 18) * 0.5
    rain_impact = (scenario.rainfall_increase - 12) * 0.4
    barrier_mitigation = (scenario.barrier_efficiency / 100) * 20
    cleanup_mitigation = scenario.cleanup_teams * 2
    
    net_impact = wind_impact + rain_impact - barrier_mitigation - cleanup_mitigation
    predicted = max(5, int(base_debris + net_impact))
    
    return {
        "predicted_accumulation_kg": predicted,
        "peak_risk_time_hours": 36 if net_impact > 10 else 72,
        "curve_data": [],
        "ai_confidence": 92 if scenario.wind_speed < 40 else 75
    }

@app.get("/api/v1/hotspots/spatial")
def get_hotspots():
    """Returns data for the Hotspot Ranking."""
    return [
        {
            "zone_name": "Juhu",
            "lat": 19.103,
            "lon": 72.825,
            "risk_percentage": 94,
            "estimated_debris_kg": 420,
            "peak_arrival_hours": 18,
            "severity": "Critical"
        },
        {
            "zone_name": "Versova",
            "lat": 19.135,
            "lon": 72.814,
            "risk_percentage": 82,
            "estimated_debris_kg": 310,
            "peak_arrival_hours": 26,
            "severity": "High"
        },
        {
            "zone_name": "Bandra",
            "lat": 19.049,
            "lon": 72.818,
            "risk_percentage": 61,
            "estimated_debris_kg": 190,
            "peak_arrival_hours": 34,
            "severity": "Medium"
        }
    ]

@app.get("/api/v1/recovery/materials")
def get_recovery_materials():
    """Returns material breakdown for the Circular Recovery dashboard."""
    return {
        "total_recovered_tons": 1.24,
        "recyclable_percentage": 68,
        "upcyclable_percentage": 21,
        "residual_percentage": 11,
        "categories": {
            "PET": { "weight_kg": 420, "percentage": 33.8 },
            "PP": { "weight_kg": 280, "percentage": 22.5 },
            "FishingNets": { "weight_kg": 190, "percentage": 15.3 },
            "MixedPlastics": { "weight_kg": 220, "percentage": 17.7 },
            "Other": { "weight_kg": 130, "percentage": 10.7 }
        }
    }

@app.post("/api/v1/recovery/observation")
async def report_observation(file: UploadFile = File(...)):
    """
    AI Feature 1: Vision-to-Value Segregation using Gemini Vision API.
    Identifies marine debris materials and suggests circular economy pathways.
    """
    try:
        # Save the uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())

        # Initialize the GenAI client (ensure GEMINI_API_KEY is in environment or passed)
        client = genai.Client()

        # Upload the file to Gemini
        genai_file = client.files.upload(file=temp_file_path)

        prompt = """
        Analyze this image of marine debris/waste.
        Provide a JSON response with the following keys:
        - composition: A short string describing the main materials you see (e.g., 'Mainly PET bottles and some fishing nets').
        - category: One of ['Highly Recyclable', 'Upcyclable', 'Residual/Mixed'].
        - matched_upcycler: A fictional or real name of an organization that could process this waste (e.g., 'Econet Solutions').
        - estimated_weight_kg: An integer estimating the weight of the items shown, just guess.
        
        Ensure your response is valid JSON and nothing else.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[genai_file, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
        # Clean up
        os.remove(temp_file_path)
        client.files.delete(name=genai_file.name)
        
        # Parse result
        result = json.loads(response.text)
        
        return {
            "status": "success",
            "ai_analysis": {
                "composition": result.get("composition", "Unknown"),
                "estimated_weight_kg": result.get("estimated_weight_kg", 5),
                "category": result.get("category", "Unknown")
            },
            "matched_upcycler": result.get("matched_upcycler", "Local Recycling Facility")
        }

    except Exception as e:
        print("Error during AI processing:", str(e))
        # Fallback response for hackathon demo if API fails
        return {
            "status": "fallback",
            "ai_analysis": {
                "composition": "Looks like Fishing Nets and PET bottles",
                "estimated_weight_kg": 15,
                "category": "Upcyclable"
            },
            "matched_upcycler": "Econet India Solutions"
        }

class ChatMessage(BaseModel):
    message: str

@app.post("/api/v1/chat")
async def chat_with_data(chat: ChatMessage):
    """
    AI Feature: Ocean-GPT Conversational Data Assistant.
    Allows users to query the platform data using natural language.
    """
    try:
        client = genai.Client()
        
        # System instructions to ground the model
        system_instruction = """
        You are Ocean-GPT, an AI assistant for the Tidal Marine Intelligence Platform.
        Your goal is to answer questions about marine debris, cleanup operations, and hotspots.
        You have access to the following current data (for Arambh'26 hackathon):
        - Total recovered plastic: 1.24 tons.
        - Hotspots: Juhu (Critical, 94% risk, 420kg debris), Versova (High, 82% risk), Bandra (Medium).
        - Material Breakdown: PET (33.8%), PP (22.5%), Fishing Nets (15.3%).
        - Active cleanup teams: 12.
        Keep answers short, professional, and directly address the user's question using this data.
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
        print("Error during chat generation:", str(e))
        # Fallback for hackathon demo if API key is not present
        lowercase_msg = chat.message.lower()
        if "juhu" in lowercase_msg:
            fallback = "Juhu is currently categorized as a Critical risk zone with a 94% risk factor and an estimated 420kg of incoming debris. Peak arrival is expected in 18 hours."
        elif "pet" in lowercase_msg or "material" in lowercase_msg:
            fallback = "We have recovered 1.24 tons of material total. PET makes up 33.8% (420kg) of the recovery, followed by PP at 22.5%."
        elif "team" in lowercase_msg or "active" in lowercase_msg:
            fallback = "There are currently 12 cleanup teams active across all monitored zones."
        else:
            fallback = "I'm Ocean-GPT. The Tidal platform has successfully diverted 1.24 tons of plastic. Juhu and Versova are currently our highest priority hotspots. How can I help you route our 12 active cleanup teams?"
            
        return {"response": fallback}


@app.get("/api/v1/simulate/predictive")
async def get_drift_trajectory(lat: float, lon: float):
    """
    AI Feature: Predictive Debris Drift Modeling.
    Provides a 72-hour forecast trajectory for a specific debris cluster.
    """
    # Mocking a realistic physical drift using a simple walk for demonstration
    trajectory = []
    current_lat = lat
    current_lon = lon
    
    for hour in range(0, 73, 6): # Every 6 hours up to 72 hours
        # Add random walk bias depending on typical current patterns (e.g. moving South-West)
        lat_shift = random.uniform(-0.005, -0.001)
        lon_shift = random.uniform(-0.004, 0.002)
        
        current_lat += lat_shift
        current_lon += lon_shift
        
        trajectory.append({
            "hour": hour,
            "lat": current_lat,
            "lon": current_lon,
            "confidence": max(10, 95 - int(hour * 0.8)) # Confidence degrades over time
        })
        
    return {
        "start_point": {"lat": lat, "lon": lon},
        "forecast_hours": 72,
        "trajectory": trajectory
    }

class DispatchRequest(BaseModel):
    hotspots: list

@app.post("/api/v1/dispatch/optimize")
async def optimize_dispatch(request: DispatchRequest):
    """
    AI Feature: Dynamic Fleet Dispatch & Routing AI.
    Uses Gemini to optimize vessel assignment to hotspots.
    """
    try:
        client = genai.Client()
        
        # Mock active fleet
        fleet = [
            {"vessel": "TIDAL-SKIM-01", "capacity_kg": 500, "current_location": "Base A"},
            {"vessel": "AQUA-SWEEP-ALPHA", "capacity_kg": 300, "current_location": "Base B"},
            {"vessel": "TIDAL-SKIM-02", "capacity_kg": 600, "current_location": "Base A"},
        ]

        system_instruction = """
        You are an AI Dispatch Commander. Assign cleanup vessels to the provided hotspots to maximize recovery and efficiency.
        Respond ONLY with a valid JSON array of objects.
        Each object must have exactly these keys: vessel_name, target_zone, eta_hours (integer), estimated_recovery_kg (integer), reasoning (short string).
        """
        
        prompt = f"Hotspots: {request.hotspots}\nAvailable Fleet: {fleet}"

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
                response_mime_type="application/json"
            )
        )
        
        return json.loads(response.text)

    except Exception as e:
        print("Error during dispatch optimization:", str(e))
        # Fallback for hackathon demo if API key is not present
        return [
            {
                "vessel_name": "TIDAL-SKIM-01",
                "target_zone": "Juhu",
                "eta_hours": 2,
                "estimated_recovery_kg": 420,
                "reasoning": "Juhu is Critical. Assigned highest capacity vessel."
            },
            {
                "vessel_name": "AQUA-SWEEP-ALPHA",
                "target_zone": "Versova",
                "eta_hours": 3,
                "estimated_recovery_kg": 300,
                "reasoning": "Versova is High risk. Assigned secondary vessel."
            }
        ]
