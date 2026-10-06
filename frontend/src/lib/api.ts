import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getTelemetrySummary: () => apiClient.get('/telemetry/summary').then(res => res.data),
  getHotspots: () => apiClient.get('/hotspots/spatial').then(res => res.data),
  optimizeDispatch: (hotspots: any[]) => apiClient.post('/dispatch/optimize', { hotspots }).then(res => res.data),
  runSimulation: (scenario: any) => apiClient.post('/simulate/scenario', scenario).then(res => res.data),
  getDriftTrajectory: (lat: number, lon: number) => apiClient.get(`/simulate/predictive?lat=${lat}&lon=${lon}`).then(res => res.data),
  reportObservation: (formData: FormData) => apiClient.post('/recovery/observation', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data),
  chat: (message: string) => apiClient.post('/chat', { message }).then(res => res.data),
};
