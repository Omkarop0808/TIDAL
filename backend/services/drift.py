import numpy as np

class DriftEngine:
    def __init__(self):
        # Mumbai bounding box approx
        self.lat_min = 18.80
        self.lat_max = 19.30
        self.lon_min = 72.70
        self.lon_max = 72.95
        
        # Simple coastline approx (longitudes eastward of this are 'beached' in Mumbai)
        self.coastline_lon = 72.82 

    def simulate_drift_monte_carlo(self, start_lat: float, start_lon: float, env_data: dict, hours: int = 72, num_particles: int = 1000):
        """
        Vectorized Monte-Carlo simulation for N particles.
        Returns the center trajectory and the percentage of particles that beach.
        """
        # Fallback physics if env_data is missing
        wind_u, wind_v = 0.0, 0.0
        curr_u, curr_v = 0.0, 0.0

        if env_data:
            weather = env_data.get('weather', {})
            marine = env_data.get('marine', {})
            
            wind_speed = weather.get('wind_speed_10m', 15)  # km/h
            wind_dir = weather.get('wind_direction_10m', 225) # degrees

            curr_speed = marine.get('ocean_current_velocity', 1.0) # km/h
            curr_dir = marine.get('ocean_current_direction', 225) # degrees

            # Convert to u,v components (km/h)
            wind_u = wind_speed * np.sin(np.radians(wind_dir))
            wind_v = wind_speed * np.cos(np.radians(wind_dir))
            
            curr_u = curr_speed * np.sin(np.radians(curr_dir))
            curr_v = curr_speed * np.cos(np.radians(curr_dir))

        # Initialize particles
        particles_lat = np.full(num_particles, start_lat)
        particles_lon = np.full(num_particles, start_lon)
        beached_mask = np.zeros(num_particles, dtype=bool)

        trajectory = []
        
        # Precompute constants
        lat_km = 111.0
        leeway_factor = 0.03
        
        total_u = curr_u + (wind_u * leeway_factor)
        total_v = curr_v + (wind_v * leeway_factor)

        for hour in range(0, hours + 1, 6):
            if hour > 0:
                lon_km = 111.0 * np.cos(np.radians(np.mean(particles_lat[~beached_mask]))) if np.any(~beached_mask) else 111.0
                
                # Active particles (not beached)
                active = ~beached_mask
                n_active = np.sum(active)
                
                if n_active > 0:
                    diffusion_u = np.random.normal(0, 0.5, n_active)
                    diffusion_v = np.random.normal(0, 0.5, n_active)

                    # Calculate shift in degrees for 6 hours
                    lat_shift = ((total_v + diffusion_v) * 6) / lat_km
                    lon_shift = ((total_u + diffusion_u) * 6) / lon_km

                    particles_lat[active] += lat_shift
                    particles_lon[active] += lon_shift
                    
                    # Beaching condition: particles hit the coastline (approx moving east of 72.82)
                    newly_beached = (particles_lon > self.coastline_lon) & active
                    beached_mask[newly_beached] = True

            # Record center of mass of active particles, or last known if all beached
            if np.any(~beached_mask):
                center_lat = np.mean(particles_lat[~beached_mask])
                center_lon = np.mean(particles_lon[~beached_mask])
            else:
                center_lat = np.mean(particles_lat)
                center_lon = np.mean(particles_lon)

            trajectory.append({
                "hour": hour,
                "lat": float(center_lat),
                "lon": float(center_lon),
                "beached_percent": float(np.mean(beached_mask) * 100)
            })

        return {
            "start_point": {"lat": start_lat, "lon": start_lon},
            "forecast_hours": hours,
            "beached_percent_final": float(np.mean(beached_mask) * 100),
            "trajectory": trajectory
        }

    def simulate_drift(self, start_lat: float, start_lon: float, env_data: dict, hours: int = 72):
        """Legacy wrapper for single trajectory"""
        res = self.simulate_drift_monte_carlo(start_lat, start_lon, env_data, hours, num_particles=1)
        return res["trajectory"]

drift_engine = DriftEngine()
