import pandas as pd
from services.drift import drift_engine

def extract_features(env_data: dict, zone_lat: float, zone_lon: float) -> dict:
    """
    Extract features for a specific zone given the environment data.
    """
    weather = env_data.get('weather', {}) if env_data else {}
    marine = env_data.get('marine', {}) if env_data else {}
    
    wind_speed = weather.get('wind_speed_10m', 15)
    precipitation = weather.get('precipitation', 0)
    current_speed = marine.get('ocean_current_velocity', 1.0)
    
    # Run a fast drift simulation to get beaching percent
    drift_res = drift_engine.simulate_drift_monte_carlo(
        start_lat=19.0, start_lon=72.7, # Offshore release point
        env_data=env_data, hours=24, num_particles=100
    )
    beached_percent = drift_res["beached_percent_final"]
    
    return {
        "wind_speed": wind_speed,
        "precipitation": precipitation,
        "current_speed": current_speed,
        "beached_percent": beached_percent,
        "zone_lat": zone_lat,
        "zone_lon": zone_lon
    }
