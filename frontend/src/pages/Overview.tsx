import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface TelemetrySummary {
  predicted_debris: number;
  high_risk_zones: number;
  cleanup_teams_active: number;
  recovery_potential: number;
  recent_activity: Array<{
    time: string;
    event: string;
    type: string;
  }>;
}

const Overview = () => {
  const [data, setData] = useState<TelemetrySummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/telemetry/summary');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching telemetry summary:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s for the live effect
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Top Section: Header & KPIs */}
      <div className="px-gutter pt-gutter pb-space-md flex flex-col gap-6">
        {/* Subtitle & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-label-md font-label-md text-primary tracking-widest uppercase">Digital Twin Status</span>
            <h1 className="text-headline-lg font-headline-lg text-on-surface">Marine Debris Intelligence for Mumbai Coast</h1>
            <p className="text-body-md font-body-md text-on-surface-variant">Real-time telemetry, hydrodynamic modeling, and automated asset coordination.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-secondary-container font-headline-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              + Release Debris
            </button>
            <Link to="/simulate" className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-headline-sm flex items-center gap-2 hover:bg-surface-bright transition-colors">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              Simulate 72 Hours
            </Link>
          </div>
        </div>
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between gap-3 group relative overflow-hidden">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-label-md font-label-md uppercase">Predicted Debris</span>
              <span className="material-symbols-outlined text-primary-container">delete_sweep</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-xl font-headline-xl text-primary">{data ? (data.predicted_debris / 1000).toFixed(1) : '--'}</span>
              <span className="text-body-md font-body-md text-on-surface-variant">tons</span>
            </div>
            <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-emerald-400">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              -4.2% vs yesterday
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between gap-3 group relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all"></div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-label-md font-label-md uppercase">High-Risk Zones</span>
              <span className="material-symbols-outlined text-error">warning</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-xl font-headline-xl text-error">{data ? data.high_risk_zones : '-'}</span>
              <span className="text-body-md font-body-md text-on-surface-variant">sectors critical</span>
            </div>
            <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-error">
              <span className="material-symbols-outlined text-[14px]">priority_high</span>
              Active threats detected
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between gap-3 group relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all"></div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-label-md font-label-md uppercase">Cleanup Teams</span>
              <span className="material-symbols-outlined text-secondary">groups</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-xl font-headline-xl text-secondary">{data ? data.cleanup_teams_active : '-'}</span>
              <span className="text-body-md font-body-md text-on-surface-variant">active units</span>
            </div>
            <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-primary-fixed">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              All operational
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between gap-3 group relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all"></div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-label-md font-label-md uppercase">Recovery Potential</span>
              <span className="material-symbols-outlined text-primary">eco</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-xl font-headline-xl text-primary">{data ? data.recovery_potential : '--'}%</span>
              <span className="text-body-md font-body-md text-on-surface-variant">efficiency</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${data ? data.recovery_potential : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Map & Intelligence Panel */}
      <div className="px-gutter pb-gutter grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Digital Map (8 Cols) */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-surface-container-lowest min-h-[600px] flex flex-col shadow-2xl">
          <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJpZMSV54ZEv3f5Y7aX63J4JpNI52yWc12851q4wn8Q2cwqmjo_fmXMKjzWDW-Uh7UF-QjPZSqIIG8c8_AJ2AoKYsWrmsI9DTll23Ezv0C96nnuKh79if0qbtHQsdZBNoZKyBc2FNWcYoG54Kised9BNpaCBBNhQAxRPcAHKGRUGlkfHfTSC6RKs69rGg9o40yDz4s64oiwdOIToR5BZnZJAkCJ50N6F8OqJCeQAMe0bNixtpBqoMifg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/40 pointer-events-none"></div>
          
          <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/80 backdrop-blur-md pointer-events-auto border border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
              <span className="text-label-md font-label-md text-primary">HYDRO-MESH ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-surface/80 backdrop-blur-md text-label-md font-label-md text-on-surface-variant border border-outline-variant/20">Lat: 18.9750° N, Lon: 72.8258° E</span>
            </div>
          </div>
          
          <div className="absolute top-20 right-4 z-20 flex flex-col gap-2">
            <div className="flex flex-col rounded-xl bg-surface/90 backdrop-blur-md overflow-hidden border border-outline-variant/20 shadow-lg">
              <button className="p-2.5 hover:bg-surface-container-high text-on-surface transition-colors border-b border-outline-variant/10" title="Zoom In"><span className="material-symbols-outlined text-[20px]">add</span></button>
              <button className="p-2.5 hover:bg-surface-container-high text-on-surface transition-colors" title="Zoom Out"><span className="material-symbols-outlined text-[20px]">remove</span></button>
            </div>
            <div className="flex flex-col gap-1 p-2 rounded-xl bg-surface/90 backdrop-blur-md border border-outline-variant/20 shadow-lg">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase px-2 py-1">Layers</span>
              {['Current', 'Wind', 'Rainfall', 'Tide', 'Debris', 'Cleanup Teams'].map(layer => (
                <label key={layer} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface-container-high text-body-sm cursor-pointer">
                  <input defaultChecked className="accent-primary-container" type="checkbox" /> {layer}
                </label>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 mt-auto p-4 flex flex-wrap items-center gap-4 bg-surface/80 backdrop-blur-md border-t border-outline-variant/20">
            <span className="text-label-md font-label-md uppercase text-on-surface-variant">Risk Zones:</span>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-body-sm">Low</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400"></span><span className="text-body-sm">Moderate</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span><span className="text-body-sm">High</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span><span className="text-body-sm">Critical</span></div>
          </div>
        </div>

        {/* Right-side Intelligence Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h2 className="text-headline-sm font-headline-sm text-on-surface">Coastal Intelligence</h2>
              <span className="material-symbols-outlined text-primary-container">analytics</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-surface-container/50 flex flex-col gap-1">
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase">Tidal State</span>
                <span className="text-headline-sm font-headline-sm text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span> Rising
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container/50 flex flex-col gap-1">
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase">Wind Vector</span>
                <span className="text-headline-sm font-headline-sm text-on-surface">SW 18 km/h</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container/50 flex flex-col gap-1">
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase">Rainfall</span>
                <span className="text-headline-sm font-headline-sm text-on-surface">12 mm</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container/50 flex flex-col gap-1">
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase">Current Velocity</span>
                <span className="text-headline-sm font-headline-sm text-on-surface">0.8 m/s</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-body-md font-body-md text-on-surface-variant">Next 24 Hours Accumulation</span>
                <span className="text-label-md font-label-md text-error font-semibold">High Alert</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Elevated probability of debris concentration near <strong className="text-on-surface">Juhu</strong> and <strong className="text-on-surface">Versova</strong> due to converging tidal vectors.</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
              <span className="text-label-md font-label-md text-on-surface-variant uppercase">Prediction Confidence</span>
              <span className="text-headline-sm font-headline-sm text-primary-container">87%</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-container-low to-surface-container flex flex-col gap-4 shadow-xl">
            <h3 className="text-headline-sm font-headline-sm text-on-surface">Automated Dispatch</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Deploy autonomous skimmers based on real-time accumulation probability vectors.</p>
            <button className="w-full py-2.5 rounded-xl bg-surface-container-high text-primary hover:bg-surface-bright transition-colors font-headline-sm text-center">
              Execute Protocol Alpha
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Recent Activity Timeline */}
      <div className="px-gutter pb-gutter">
        <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-headline-sm font-headline-sm text-on-surface">Recent Activity</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Live telemetry feed from sensors and backend</p>
            </div>
            <button className="text-label-md font-label-md text-primary hover:underline">View All Logs</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {data?.recent_activity.map((activity, index) => {
              // Determine color based on type
              let dotColor = 'bg-primary-container';
              if (activity.type === 'alert') dotColor = 'bg-error animate-pulse';
              if (activity.type === 'dispatch') dotColor = 'bg-emerald-400';
              if (activity.type === 'info') dotColor = 'bg-secondary';

              return (
                <div key={index} className="p-4 rounded-xl bg-surface-container/50 flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm font-label-sm text-primary-container font-mono">{activity.time}</span>
                    <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                  </div>
                  <span className="text-body-md font-medium text-on-surface">{activity.type.toUpperCase()}</span>
                  <span className="text-body-sm text-on-surface-variant">{activity.event}</span>
                </div>
              );
            }) || <p className="text-body-sm text-on-surface-variant">Loading live feed...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
