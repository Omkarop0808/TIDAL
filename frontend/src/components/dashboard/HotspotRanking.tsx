

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Hotspot {
  zone_name: string;
  lat: number;
  lon: number;
  risk_percentage: number;
  estimated_debris_kg: number;
  peak_arrival_hours: number;
  severity: string;
}

const HotspotRanking = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/hotspots/spatial');
        setHotspots(response.data);
      } catch (error) {
        console.error('Error fetching hotspots:', error);
      }
    };
    fetchHotspots();
    const interval = setInterval(fetchHotspots, 10000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityStyle = (severity: string) => {
    if (severity === 'Critical') return 'border-error/30 hover:border-error';
    if (severity === 'High') return 'border-warning/30 hover:border-primary-fixed';
    return 'border-outline-variant/30 hover:border-outline-variant';
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'Critical') return 'bg-error-container text-on-error-container';
    if (severity === 'High') return 'bg-primary-container/20 text-primary-fixed';
    return 'bg-secondary-container/20 text-secondary';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'Critical') return 'text-error';
    if (severity === 'High') return 'text-primary-fixed';
    return 'text-secondary';
  };

  const getSeverityBgColor = (severity: string) => {
    if (severity === 'Critical') return 'bg-error';
    if (severity === 'High') return 'bg-primary-container';
    return 'bg-secondary';
  };

  return (
    <div className="lg:col-span-3 glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed">format_list_numbered</span>
            Hotspot Ranking
          </h3>
          <span className="text-label-sm text-on-surface-variant">{hotspots.length} ZONES</span>
        </div>
        
        <div className="flex flex-col gap-3">
          {hotspots.map((hotspot, index) => (
            <div key={index} className={`p-3.5 rounded-xl bg-surface-container-high/80 border flex flex-col gap-2 relative overflow-hidden group cursor-pointer transition-all ${getSeverityStyle(hotspot.severity)}`}>
              {hotspot.severity === 'Critical' && <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-full blur-xl pointer-events-none"></div>}
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-on-surface flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${getSeverityBgColor(hotspot.severity)} ${hotspot.severity === 'Critical' ? 'animate-ping' : ''}`}></span>
                  Zone {String.fromCharCode(65 + index)}: {hotspot.zone_name}
                </span>
                <span className={`px-2 py-0.5 rounded font-label-sm ${getSeverityBadge(hotspot.severity)}`}>{hotspot.severity}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 font-label-md text-on-surface-variant">
                <div>Risk: <span className={`${getSeverityColor(hotspot.severity)} font-semibold`}>{hotspot.risk_percentage}%</span></div>
                <div>Qty: <span className="text-on-surface font-semibold">{hotspot.estimated_debris_kg} kg</span></div>
                <div>Peak: <span className="text-on-surface font-semibold">{hotspot.peak_arrival_hours}h</span></div>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden mt-1">
                <div className={`${getSeverityBgColor(hotspot.severity)} h-full transition-all duration-1000`} style={{ width: `${hotspot.risk_percentage}%` }}></div>
              </div>
            </div>
          ))}
          {hotspots.length === 0 && <p className="text-body-sm text-on-surface-variant">Loading hotspots...</p>}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
        <div className="flex justify-between text-label-md text-on-surface-variant">
          <span>Environmental Sensitivity Index</span>
          <span className="text-primary-fixed font-semibold">8.4 / 10</span>
        </div>
        <div className="flex justify-between text-label-md text-on-surface-variant">
          <span>Avg Distance from Base</span>
          <span className="text-on-surface font-semibold">12.4 km</span>
        </div>
      </div>
    </div>
  );
};

export default HotspotRanking;
