import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, Activity, AlertTriangle, Users, BarChart3, Wifi } from 'lucide-react';
import { IntelligenceMap } from '../components/IntelligenceMap';
import { ProtocolAlphaOverlay } from '../components/ProtocolAlphaOverlay';
import { FleetCommandPanel } from '../components/FleetCommandPanel';
import { DebrisAnalysisPanel } from '../components/DebrisAnalysisPanel';
import { useLiveFeed } from '../hooks/useLiveFeed';

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
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isAlphaOpen, setIsAlphaOpen] = useState(false);
  const [isFleetOpen, setIsFleetOpen] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [debrisMultiplier, setDebrisMultiplier] = useState(0);
  const [activeLayers, setActiveLayers] = useState<string[]>(['Debris']);
  
  // OceanEye Integration State
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>();

  // Use the new websocket hook
  const { data: liveData, isConnected } = useLiveFeed('ws://localhost:8000/ws/live');

  useEffect(() => {
    if (liveData?.weather) {
      setWeatherData(liveData.weather);
    }
  }, [liveData]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/telemetry/summary');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching telemetry summary:', error);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleReleaseDebris = () => {
    if (isReleasing) return;
    setIsReleasing(true);
    setTimeout(() => {
      setDebrisMultiplier(prev => prev + 1);
      setIsReleasing(false);
    }, 2000);
  };

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => 
      prev.includes(layer) 
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };

  // Derived metrics incorporating simulated debris drops
  const predictedDebris = data ? ((data.predicted_debris / 1000) + (debrisMultiplier * 1.2)).toFixed(1) : '--';
  const highRiskZones = data ? data.high_risk_zones + debrisMultiplier : '--';

  // Motion variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.8, ease: "easeOut" }
    })
  };

  return (
    <main className="w-full bg-background min-h-screen text-on-surface overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Modals & Overlays */}
      <ProtocolAlphaOverlay isOpen={isAlphaOpen} onClose={() => setIsAlphaOpen(false)} />
      <FleetCommandPanel isOpen={isFleetOpen} onClose={() => setIsFleetOpen(false)} />
      <DebrisAnalysisPanel 
        isOpen={isAnalysisOpen} 
        onClose={() => setIsAnalysisOpen(false)} 
        activityId={selectedActivityId} 
      />

      {/* ATTENTION: Hero Section (Editorial Split) */}
      <section className="px-6 md:px-12 pt-32 pb-24 md:pb-40 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
        <motion.div 
          custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="lg:col-span-7 flex flex-col gap-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline-xl tracking-tighter leading-[1.05] text-on-surface">
            Marine Debris <br />
            <span className="text-primary-container italic">Intelligence.</span>
          </h1>
        </motion.div>
        
        <motion.div 
          custom={1} initial="hidden" animate="visible" variants={fadeUp}
          className="lg:col-span-5 flex flex-col gap-8 lg:pb-4"
        >
          <p className="text-lg md:text-xl font-body-lg text-on-surface-variant max-w-md leading-relaxed">
            Real-time telemetry, hydrodynamic modeling, and automated asset coordination for the Mumbai Coast.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button 
              onClick={handleReleaseDebris}
              disabled={isReleasing}
              className="px-8 py-4 rounded-full bg-primary-container text-on-primary-container font-headline-sm flex items-center gap-3 hover:scale-105 transition-transform duration-500 ease-out shadow-2xl shadow-primary-container/20 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isReleasing ? 'Simulating...' : 'Release Debris'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link to="/simulate" className="px-8 py-4 rounded-full bg-surface-container-high text-on-surface font-headline-sm flex items-center gap-3 hover:bg-surface-bright hover:scale-105 transition-all duration-500 ease-out border border-outline-variant/20">
              Simulate 72h
            </Link>
          </div>
        </motion.div>
      </section>

      {/* INTEREST: Gapless Bento Grid */}
      <section className="px-6 md:px-12 py-24 md:py-32 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-flow-dense">
          
          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} 
            className="col-span-1 lg:col-span-2 row-span-2 p-8 md:p-12 rounded-3xl bg-surface-container-low border border-outline-variant/10 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col h-full gap-16">
              <div className="flex items-start justify-between">
                <span className="text-on-surface-variant font-label-md tracking-widest uppercase">Predicted Debris</span>
                <Activity className="w-6 h-6 text-primary-container" />
              </div>
              <div className="flex items-end gap-3">
                <span className="text-7xl md:text-9xl font-headline-xl tracking-tighter text-on-surface">
                  {predictedDebris}
                </span>
                <span className="text-xl md:text-2xl text-on-surface-variant mb-3 md:mb-6">tons</span>
              </div>
            </div>
          </motion.div>

          <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} 
            className="p-8 rounded-3xl bg-surface-container border border-outline-variant/10 flex flex-col gap-6 group hover:bg-surface-container-high transition-colors duration-500">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-label-md tracking-widest uppercase">High-Risk Zones</span>
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <span className="text-5xl md:text-6xl font-headline-xl tracking-tighter text-error">
              {highRiskZones}
            </span>
          </motion.div>

          <motion.div 
            custom={4} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} 
            onClick={() => setIsFleetOpen(true)}
            className="p-8 rounded-3xl bg-surface-container border border-outline-variant/10 flex flex-col gap-6 group hover:bg-surface-container-high hover:border-primary-container/50 transition-colors duration-500 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant group-hover:text-primary-container transition-colors font-label-md tracking-widest uppercase">Cleanup Teams</span>
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-5xl md:text-6xl font-headline-xl tracking-tighter text-secondary">
              {data ? data.cleanup_teams_active : '-'}
            </span>
          </motion.div>

          <motion.div custom={5} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} 
            className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-surface-container border border-outline-variant/10 flex flex-col gap-6 group overflow-hidden hover:bg-surface-container-high transition-colors duration-500">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-label-md tracking-widest uppercase">Recovery Potential</span>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col gap-4 mt-auto">
              <span className="text-5xl md:text-6xl font-headline-xl tracking-tighter text-on-surface">
                {data ? data.recovery_potential : '--'}%
              </span>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary-container h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${data ? data.recovery_potential : 0}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* DESIRE: Digital Map & Coastal Intelligence (Asymmetric) */}
      <section className="px-6 md:px-12 py-24 md:py-40 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} 
            className="lg:col-span-8 relative h-[600px] md:h-[800px] rounded-[2rem] overflow-hidden group border border-outline-variant/10">
            
            <div className="absolute inset-0 z-0">
              <IntelligenceMap />
            </div>
            
            <div className="absolute top-8 left-8 flex flex-col gap-4 z-[2000]">
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-surface-container-lowest/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
                <span className="text-label-sm font-label-md text-on-surface tracking-widest uppercase">Active Node</span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 p-6 md:p-8 rounded-[1.5rem] bg-surface-container-lowest/80 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl z-[2000]">
              <div className="flex flex-col gap-2">
                <span className="text-on-surface font-headline-sm">Coordinates</span>
                <span className="text-on-surface-variant font-label-sm tracking-widest uppercase">18.9750° N, 72.8258° E</span>
              </div>
              <div className="flex flex-wrap gap-6">
                {['Current', 'Wind', 'Tide', 'Debris'].map(layer => {
                  const isActive = activeLayers.includes(layer);
                  return (
                    <div 
                      key={layer} 
                      onClick={() => toggleLayer(layer)}
                      className="flex items-center gap-3 cursor-pointer group/toggle"
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors bg-surface/50 ${isActive ? 'border-primary-container' : 'border-outline-variant group-hover/toggle:border-primary-container/60'}`}>
                        <div className={`w-2.5 h-2.5 bg-primary-container rounded-sm transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                      <span className={`text-label-sm uppercase tracking-widest transition-colors ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>{layer}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} 
            className="lg:col-span-4 flex flex-col gap-12 justify-center">
            
            <div className="flex flex-col gap-12">
              <h2 className="text-3xl md:text-5xl font-headline-lg tracking-tighter">Coastal <br/>Intelligence</h2>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-12 relative">
                {!isConnected && (
                   <div className="absolute top-0 right-0 text-error flex items-center gap-1 text-xs">
                     <Wifi className="w-3 h-3 line-through" /> Disconnected
                   </div>
                )}
                {isConnected && (
                   <div className="absolute top-0 right-0 text-emerald-400 flex items-center gap-1 text-xs">
                     <Wifi className="w-3 h-3" /> Live
                   </div>
                )}
                <div className="flex flex-col gap-3">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest">Tidal State</span>
                  <span className="text-2xl text-primary-container font-headline-sm">Rising</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest">Wind Vector</span>
                  <span className="text-2xl text-on-surface font-headline-sm">
                    {weatherData ? `${weatherData.wind_direction_10m}° ${weatherData.wind_speed_10m} km/h` : 'Fetching...'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest">Rainfall</span>
                  <span className="text-2xl text-on-surface font-headline-sm">
                    {weatherData ? `${weatherData.precipitation} mm` : 'Fetching...'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest">Current Vel</span>
                  <span className="text-2xl text-on-surface font-headline-sm">
                    {liveData?.marine ? `${liveData.marine.ocean_current_velocity} km/h` : (weatherData ? `${(weatherData.wind_speed_10m * 0.03).toFixed(2)} m/s` : 'Fetching...')}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-outline-variant/30"></div>

              <div className="flex flex-col gap-6">
                <p className="text-lg text-on-surface-variant font-body-lg leading-relaxed">
                  Elevated probability of debris concentration near <span className="text-on-surface">Juhu</span> and <span className="text-on-surface">Versova</span> due to converging tidal vectors.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-label-sm font-label-md text-on-surface-variant uppercase tracking-widest">Confidence</span>
                  <span className="text-3xl font-headline-md text-on-surface">87%</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsAlphaOpen(true)}
                className="w-full py-5 mt-4 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-bright hover:text-error transition-all duration-300 font-headline-sm tracking-wide border border-outline-variant/10 shadow-xl hover:shadow-2xl hover:border-error/50"
              >
                Execute Protocol Alpha
              </button>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* ACTION: Activity Log */}
      <section className="px-6 md:px-12 py-24 md:py-40 w-full max-w-[1600px] mx-auto border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <h2 className="text-4xl md:text-6xl font-headline-xl tracking-tighter">Live Telemetry</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {data?.recent_activity.map((activity, index) => {
              let dotColor = 'bg-primary-container';
              if (activity.type === 'alert') dotColor = 'bg-error';
              if (activity.type === 'dispatch') dotColor = 'bg-emerald-400';
              if (activity.type === 'info') dotColor = 'bg-secondary';

              return (
                <motion.div 
                  key={`${activity.time}-${activity.event}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200, delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedActivityId(`mock_id_${index}`);
                    setIsAnalysisOpen(true);
                  }}
                  className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/10 flex flex-col gap-8 group hover:border-primary-container/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-label-sm tracking-widest uppercase">{activity.time}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-[0_0_10px_currentColor] opacity-80`}></span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-on-surface font-label-md uppercase tracking-widest text-xs">{activity.type}</span>
                    <span className="text-on-surface-variant font-body-md leading-relaxed">{activity.event}</span>
                  </div>
                </motion.div>
              );
            }) || (
              <div className="col-span-full py-20 text-center text-on-surface-variant font-label-md tracking-widest uppercase">
                Connecting to telemetry stream...
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
    </main>
  );
};

export default Overview;
