# TIDAL v2: AI Integration Specification (AI-SPEC.md)

## 1. Objective
Integrate robust, real-time AI and physics-based modeling into the TIDAL platform to transition from static heuristics/mocked data to a predictive, physics-aware, and vision-enabled intelligent system.

## 2. Core AI Components
### 2.1 XGBoost Beaching-Risk Forecaster
- **Goal:** Predict debris mass (kg) expected to beach at specific coastal zones over 24/48/72h horizons.
- **Inputs:** Environmental parameters (Open-Meteo), physics drift output (Monte-Carlo), static geospatial features, and lagged field reports.
- **Outputs:** Predicted beaching kg (Regression) and Risk Tier (Classification).
- **Explainability:** SHAP-based feature contributions (via XGBoost `pred_contribs=True`) to explain *why* a zone is at risk (e.g., "High onshore wind + rainfall at river outfall").
- **Training Strategy:** 
  - *Bootstrap Phase:* Pre-train on 1-year historical Open-Meteo data paired with physics drift labels.
  - *Fine-Tuning Phase:* Continuous learning via real field reports (Kaggle dataset/live data).

### 2.2 YOLOv8 (or YOLO11) Marine Debris Vision Detector
- **Goal:** Real-time object detection and classification of marine debris from webcam/video feeds, robust to low-visibility underwater environments.
- **Inputs:** Live frame streams (via WebSocket) or uploaded images.
- **Preprocessing:** CLAHE (Contrast Limited Adaptive Histogram Equalization) for low-visibility enhancement.
- **Model:** `ultralytics` YOLO11 initialized with pretrained marine debris weights (e.g., TACO/TrashCan).
- **Outputs:** Bounding boxes, class labels, and item counts.

### 2.3 Gemini / Groq Orchestration (Material & Dispatch)
- **Material Valuation:** Two-stage vision pipeline where Gemini-2.5-Flash (or Groq LLaMA-3 Vision if available) analyzes YOLO-cropped debris to determine material composition, recyclability, and upcycler matching.
- **Fleet Dispatch:** Deterministic optimization (Hungarian algorithm via `scipy.optimize.linear_sum_assignment`) pairs vessels to hotspots. Gemini provides natural language explanations of the assignment rationale.
- **Ocean-GPT:** Function calling enabled LLM agent to interact with live state (wind, currents, active dispatch).

## 3. Evaluation & Metrics
- **XGBoost:** Evaluate via chronological split. Target metrics: MAE, RMSE, and $R^2$.
- **YOLO Vision:** Evaluate via Precision, Recall, F1-Score, and mAP@50 (as per the referenced IEEE paper).
- **Physics Drift:** Sanity checks on particle conservation and boundary interactions.

## 4. Execution Plan (Waves)
1. **Wave 1:** Real-time Open-Meteo ingestion and WebSocket telemetry.
2. **Wave 2:** Monte-Carlo physics drift engine.
3. **Wave 3:** XGBoost risk modeling and hotspot forecasting.
4. **Wave 4:** YOLO vision integration and CLAHE preprocessing.
5. **Wave 5:** Feedback loop and ML Lab dashboard.
6. **Wave 6:** Hungarian dispatch optimizer and Ocean-GPT function calling.
