import httpx
import asyncio
from datetime import datetime

class EnvironmentService:
    def __init__(self):
        self.cached_data = None
        self.last_fetch = None

    async def fetch_live_data(self):
        # Coordinates for Mumbai coastal area
        lat, lon = 19.10, 72.80
        url = (
            f"https://marine-api.open-meteo.com/v1/marine?"
            f"latitude={lat}&longitude={lon}&"
            f"current=wave_height,ocean_current_velocity,ocean_current_direction,sea_level_height_msl"
            f"&timezone=Asia/Kolkata"
        )
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&"
            f"current=wind_speed_10m,wind_direction_10m,precipitation"
            f"&timezone=Asia/Kolkata"
        )

        async with httpx.AsyncClient() as client:
            try:
                # Fetch marine data
                marine_resp = await client.get(url)
                marine_data = marine_resp.json()
                
                # Fetch weather data
                weather_resp = await client.get(weather_url)
                weather_data = weather_resp.json()

                if "current" in marine_data and "current" in weather_data:
                    self.cached_data = {
                        "timestamp": marine_data["current"].get("time"),
                        "marine": marine_data["current"],
                        "weather": weather_data["current"]
                    }
                    self.last_fetch = datetime.now()
                    return self.cached_data
            except Exception as e:
                print(f"Error fetching environment data: {e}")
        return self.cached_data

    def get_current_data(self):
        return self.cached_data

env_service = EnvironmentService()
