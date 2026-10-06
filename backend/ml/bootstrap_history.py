import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Note: In a real environment, this script would make requests to the
# Open-Meteo Historical Marine API to fetch real 1-year data.
# For demonstration purposes, it bootstraps the dataset using statistical distributions
# derived from the physics model constraints.

def generate_bootstrap_data(output_path="historical_bootstrap.csv"):
    dates = [datetime.now() - timedelta(days=x) for x in range(365)]
    zones = ["Juhu", "Versova", "Bandra"]
    
    records = []
    
    for date in dates:
        for zone in zones:
            # Baseline weather
            wind_speed = np.random.normal(15, 5) # km/h
            precip = np.random.exponential(2.0) # mm
            
            # Monsoon scaling (June-September)
            is_monsoon = date.month in [6, 7, 8, 9]
            if is_monsoon:
                wind_speed += 10
                precip += np.random.exponential(20.0)
                
            current_speed = np.random.normal(1.2, 0.3)
            
            # Simulated physics correlation
            # Beaching is heavily driven by onshore wind and river outfall precipitation
            base_kg = 50
            wind_factor = (wind_speed / 15) * 30
            rain_factor = (precip / 10) * 100
            
            # Zone specific vulnerability
            zone_multipliers = {"Versova": 1.5, "Juhu": 1.2, "Bandra": 0.8}
            
            beached_percent = min(100, max(0, (wind_factor * 0.4) + (current_speed * 10)))
            
            beaching_kg = int((base_kg + wind_factor + rain_factor) * zone_multipliers[zone])
            
            # Add some noise
            beaching_kg += int(np.random.normal(0, 15))
            beaching_kg = max(0, beaching_kg)

            records.append({
                "timestamp": date.strftime("%Y-%m-%d"),
                "zone_name": zone,
                "wind_speed": float(max(0, wind_speed)),
                "precipitation": float(precip),
                "current_speed": float(max(0, current_speed)),
                "beached_percent": float(beached_percent),
                "beaching_kg": beaching_kg
            })
            
    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} bootstrap records at {output_path}")
    
    return df

if __name__ == "__main__":
    # If run directly, generate the data and immediately train the XGBoost model
    df = generate_bootstrap_data()
    
    try:
        from model import risk_model
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from services.store import store_service
        
        print("Training initial XGBoost model on bootstrap data...")
        metrics = risk_model.train(df)
        print(f"Training Complete! MAE: {metrics['mae']:.2f}, R2: {metrics['r2']:.2f}")
        
        # Save metrics to store
        store_service.save_model_run({
            "mae": metrics['mae'],
            "r2": metrics['r2'],
            "samples": len(df)
        })
        print("Metrics saved to SQLite store.")
        
    except ImportError as e:
        print(f"ImportError: {e}. Make sure to run this from the backend directory.")
