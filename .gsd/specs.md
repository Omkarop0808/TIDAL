# Dynamic Fleet Dispatch & Routing AI Specification

## Objective
Convert the current static hotspots view into an actionable, AI-driven fleet dispatch system that generates optimal routing plans using Gemini.

## Components
1. **Backend - AI Dispatch Endpoint (`/api/v1/dispatch/optimize`)**
   - **Input:** Environment state (Hotspots data, active fleet availability).
   - **Logic:** Uses `gemini-2.5-flash` with structured JSON output to assign specific `Fleet Vessels` to `Hotspots` based on risk severity, debris amount, and peak arrival hours.
   - **Output:** A JSON array of dispatch assignments containing:
     - `vessel_name`
     - `target_zone`
     - `eta_hours`
     - `estimated_recovery_kg`
     - `reasoning` (why AI chose this assignment)

2. **Frontend - Dispatch UI**
   - **Trigger:** "Deploy Cleanup Plan" button in `Hotspots.tsx`.
   - **Component:** A new modal overlay `DispatchPlanModal.tsx`.
   - **Data Fetching:** Calls `/api/v1/dispatch/optimize` when opened. Shows an "AI Optimizing..." loading state, then displays the Gemini-generated assignments in a clean, high-tech interface.

## Assumptions
- We will use a mock list of available vessels (e.g., TIDAL-SKIM-01, AQUA-SWEEP-A, etc.) in the backend to feed to the AI.
- The `GEMINI_API_KEY` is available in the environment to process the request.
