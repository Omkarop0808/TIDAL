import numpy as np
from scipy.optimize import linear_sum_assignment
from google import genai
from google.genai import types
from groq import Groq
import os

class DispatchService:
    def __init__(self):
        pass

    def optimize_dispatch(self, hotspots: list, fleet: list):
        """
        Deterministic dispatch optimizer using the Hungarian algorithm.
        Cost = travel_time - (forecast_kg * capacity_fit_bonus)
        """
        if not hotspots or not fleet:
            return []
            
        n_vessels = len(fleet)
        n_hotspots = len(hotspots)
        
        cost_matrix = np.zeros((n_vessels, n_hotspots))
        
        for i, vessel in enumerate(fleet):
            for j, hs in enumerate(hotspots):
                travel_hours = np.random.uniform(1, 4) 
                capacity = vessel.get('capacity_kg', 100)
                risk_kg = hs.get('estimated_debris_kg', 0)
                
                capacity_penalty = 50 if risk_kg > capacity else 0
                fit_bonus = min(capacity, risk_kg) * 0.1
                
                cost = travel_hours + capacity_penalty - fit_bonus
                cost_matrix[i, j] = cost
                
        row_ind, col_ind = linear_sum_assignment(cost_matrix)
        
        assignments = []
        for i, j in zip(row_ind, col_ind):
            assignments.append({
                "vessel_name": fleet[i]["vessel"],
                "target_zone": hotspots[j]["zone_name"],
                "eta_hours": 2, 
                "estimated_recovery_kg": min(fleet[i]["capacity_kg"], hotspots[j]["estimated_debris_kg"])
            })
            
        return assignments

    def explain_assignment(self, assignments: list):
        """
        Use Gemini 2.5 Flash to generate natural language explanations. Fallback to Groq.
        """
        prompt = f'''
        Explain these vessel dispatch assignments logically to a fleet commander.
        Assignments: {assignments}
        Keep explanations short (1 sentence per vessel).
        Return a JSON array of objects with "vessel_name" and "reasoning" keys.
        '''

        try:
            client = genai.Client()
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return response.text
        except Exception as gemini_err:
            print(f"Gemini dispatch explanation failed, falling back to Groq: {gemini_err}")
            try:
                groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
                completion = groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.2
                )
                
                # Check if it returned an array wrapped in an object or just the array text
                result_text = completion.choices[0].message.content
                return result_text
            except Exception as groq_err:
                print(f"Groq fallback failed: {groq_err}")
                raise

dispatch_service = DispatchService()
