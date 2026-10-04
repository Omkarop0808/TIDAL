import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Simulate = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeVal, setTimeVal] = useState(24);
  const [windSpeed, setWindSpeed] = useState(18);
  const [rainfall, setRainfall] = useState(12);
  const [results, setResults] = useState({
    accum: '62 kg', travel: '18.4 km', primary: 'Versova', secondary: 'Bandra', peak: 'T+48h', confidence: 84
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeVal((prev) => {
          if (prev >= 72) {
            setIsPlaying(false);
            return 72;
          }
          return prev + 1;
        });
      }, 50); // Fast forward simulation
    }
    return () => clearInterval(interval);
  }, [isPlaying]);
  const runSimulation = async (customScenario?: { wind_speed: number, rainfall_increase: number, barrier_efficiency: number, cleanup_teams: number }) => {
    setIsLoading(true);
    try {
      const payload = customScenario || {
        wind_speed: windSpeed,
        rainfall_increase: rainfall,
        barrier_efficiency: 10,
        cleanup_teams: 5
      };
      
      const response = await axios.post('http://localhost:8000/api/v1/simulate/scenario', payload);
      const data = response.data;
      
      setResults({
        accum: `${data.predicted_accumulation_kg} kg`,
        travel: `${(data.predicted_accumulation_kg * 0.05).toFixed(1)} km`,
        primary: data.peak_risk_time_hours > 48 ? 'Bandra' : 'Versova',
        secondary: 'Juhu',
        peak: `T+${data.peak_risk_time_hours}h`,
        confidence: data.ai_confidence
      });
      setIsPlaying(true);
      setTimeVal(0); // reset playback
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runScenario = (type: string) => {
    if (type === 'rain') {
      runSimulation({ wind_speed: windSpeed, rainfall_increase: 50, barrier_efficiency: 10, cleanup_teams: 5 });
      setRainfall(50);
    } else if (type === 'wind') {
      runSimulation({ wind_speed: 40, rainfall_increase: rainfall, barrier_efficiency: 10, cleanup_teams: 5 });
      setWindSpeed(40);
    } else if (type === 'clean') {
      runSimulation({ wind_speed: windSpeed, rainfall_increase: rainfall, barrier_efficiency: 10, cleanup_teams: 20 });
    } else if (type === 'barrier') {
      runSimulation({ wind_speed: windSpeed, rainfall_increase: rainfall, barrier_efficiency: 50, cleanup_teams: 5 });
    }
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      <div className="px-gutter pt-gutter pb-space-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-md text-primary mb-1">
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            <span>DIGITAL TWIN SIMULATION ENGINE // V4.2</span>
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">Model how marine debris moves through the coastal system.</h1>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md">Model ID: #MUMB-7749</span>
          <button onClick={() => alert("Scenario Saved Successfully!")} className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-label-md flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,242,254,0.2)]">
            <span className="material-symbols-outlined text-[18px]">save</span> Save Scenario
          </button>
        </div>
      </div>

      <div className="px-gutter pb-space-xl grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">tune</span> Release Scenario
              </h2>
              <span className="text-label-sm text-on-surface-variant">CONFIG 01</span>
            </div>
            <div className="flex flex-col gap-3 font-body-md">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-md text-on-surface-variant">Release Location</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-high text-on-surface px-3 py-2.5 rounded-lg appearance-none outline-none focus:ring-1 focus:ring-primary-container">
                    <option>Juhu Beach</option>
                    <option>Versova Creek</option>
                    <option>Bandra Promenade</option>
                    <option>Colaba Outfall</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant">Debris Quantity</label>
                  <input className="w-full bg-surface-container-high text-on-surface px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary-container font-label-md" type="text" defaultValue="100 kg"/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant">Material</label>
                  <select className="w-full bg-surface-container-high text-on-surface px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary-container">
                    <option>Mixed Plastic</option>
                    <option>Micro-plastics</option>
                    <option>HDPE Containers</option>
                    <option>Organic/Silt</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant">Entry Source</label>
                  <select className="w-full bg-surface-container-high text-on-surface px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary-container">
                    <option>Coastal Outflow</option>
                    <option>Direct Dump</option>
                    <option>Vessel Spill</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant">Duration</label>
                  <select className="w-full bg-surface-container-high text-on-surface px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary-container">
                    <option>72 Hours</option>
                    <option>48 Hours</option>
                    <option>24 Hours</option>
                  </select>
                </div>
              </div>
              <button onClick={() => runSimulation()} disabled={isLoading} className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-secondary-container font-headline-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,242,254,0.3)] hover:brightness-110 transition-all cursor-pointer">
                <span className="material-symbols-outlined">{isLoading ? 'hourglass_empty' : 'play_arrow'}</span> {isLoading ? 'SIMULATING...' : 'SIMULATE'}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">air</span> Environmental Conditions
              </h2>
              <span className="text-label-sm text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Feed</span>
            </div>
            <div className="flex flex-col gap-3 font-body-md">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/60">
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface-variant">Wind Vector</span>
                  <span className="font-semibold">SW -&gt; {windSpeed} km/h</span>
                </div>
                <input className="w-24 accent-primary-container cursor-pointer" max="50" min="0" type="range" value={windSpeed} onChange={(e) => setWindSpeed(Number(e.target.value))}/>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/60">
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface-variant">Rainfall</span>
                  <span className="font-semibold">{rainfall} mm</span>
                </div>
                <input className="w-24 accent-primary-container cursor-pointer" max="100" min="0" type="range" value={rainfall} onChange={(e) => setRainfall(Number(e.target.value))}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-high/60">
                  <span className="text-label-md text-on-surface-variant">Current</span>
                  <span className="font-semibold text-primary-fixed">0.8 m/s</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-high/60">
                  <span className="text-label-md text-on-surface-variant">Tide State</span>
                  <span className="font-semibold text-secondary-fixed">Rising (+2.4m)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-gutter">
          <div className="relative w-full h-[550px] rounded-2xl overflow-hidden bg-surface-container-lowest shadow-2xl flex flex-col perspective-[1200px]">
            {/* 3D Map Container */}
            <div className={`absolute inset-0 transition-transform duration-1000 ease-in-out origin-center ${isPlaying ? 'scale-[1.15]' : 'scale-100'}`}>
              <div className="absolute inset-0 bg-cover bg-center opacity-80 filter saturate-150" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2Dp5KOX9TjwCg8bpmNOj0L4npkWmsgi2lLIOJUP8p8tCwoRSxDjpj75KhTicoM7aOP2KaGA-5EAOHtMRTrYZKynG-cGXhdx7qrbtH6GDpC1Z8fgOvC8rsOcyVRb5Mab3bhpEftucKlldEz78luQkFtv_5eoeyP-qK9_Wk1treMnco7fmHUzuYstl2B_kH5oaFEdpXBfCYy8ZxUqwwJe8aZ4FSOPOQaPJ-8ixEIz7CQybZThBNsLtizw')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/20 pointer-events-none"></div>
              
              {/* Dynamic Animated Particles (Debris Flow) */}
              {isPlaying && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-error/80 blur-[1px] animate-pulse"
                      style={{
                        top: `${Math.random() * 50 + 20}%`,
                        left: `${Math.random() * 50 + 20}%`,
                        animation: `flow ${Math.random() * 3 + 2}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    ></div>
                  ))}
                  <style>{`
                    @keyframes flow {
                      0% { transform: translate(0, 0) scale(1); opacity: 0; }
                      20% { opacity: 1; }
                      80% { opacity: 1; }
                      100% { transform: translate(${windSpeed * 2}px, ${rainfall * 2}px) scale(0.5); opacity: 0; }
                    }
                  `}</style>
                </div>
              )}
            </div>
            
            {/* UI Overlays (not 3D transformed) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/80 backdrop-blur-md border border-primary/20 text-label-sm font-label-md">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <span>3D SPATIAL TELEMETRY ACTIVE</span>
            </div>
            
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-md bg-surface/80 backdrop-blur-md text-label-sm text-primary font-label-md">LAT: 19.0760° N</div>
              <div className="px-2.5 py-1 rounded-md bg-surface/80 backdrop-blur-md text-label-sm text-primary font-label-md">LON: 72.8777° E</div>
            </div>
            
            <div className="absolute top-[35%] left-[45%] z-20 flex flex-col items-center animate-bounce">
              <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-secondary-container to-surface text-on-secondary-container text-label-sm font-label-md shadow-2xl border border-secondary/50">
                <span className="block font-bold">{results.primary}</span>
                <span className="text-primary-fixed">{results.accum} DEBRIS</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-error mt-2 ring-4 ring-error/30 animate-pulse"></div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-xl bg-surface/90 backdrop-blur-xl border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex items-center justify-between text-label-md">
                <div className="flex items-center gap-3">
                  <button className={`w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-105 transition-all ${isPlaying ? 'ring-2 ring-primary-container' : ''}`} onClick={() => setIsPlaying(!isPlaying)}>
                    <span className="material-symbols-outlined text-[18px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
                  </button>
                  <span className="text-primary font-semibold">T + {timeVal}h</span>
                </div>
                <span className="text-on-surface-variant">Progress: {Math.round((timeVal / 72) * 100)}% Elapsed</span>
              </div>
              <div className="flex flex-col gap-1">
                <input className="w-full accent-primary-container cursor-pointer" max="72" min="0" onChange={(e) => { setTimeVal(Number(e.target.value)); setIsPlaying(false); }} type="range" value={timeVal} />
                <div className="flex justify-between text-label-sm text-on-surface-variant font-label-md px-1">
                  <span>T+0h</span>
                  <span>T+12h</span>
                  <span className="text-primary">T+24h</span>
                  <span>T+48h</span>
                  <span>T+72h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">experiment</span> What-If Scenario Matrix
              </h3>
              <span className="text-label-sm text-primary-fixed">Baseline vs Scenario</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button className="p-2.5 rounded-xl bg-surface-container-high/70 hover:bg-primary-container/20 hover:text-primary transition-all text-left flex flex-col gap-1 border border-transparent hover:border-primary/30" onClick={() => runScenario('rain')}>
                <span className="text-label-sm text-on-surface-variant">Modifier</span>
                <span className="text-body-md font-semibold truncate">Increase rainfall</span>
              </button>
              <button className="p-2.5 rounded-xl bg-surface-container-high/70 hover:bg-primary-container/20 hover:text-primary transition-all text-left flex flex-col gap-1 border border-transparent hover:border-primary/30" onClick={() => runScenario('wind')}>
                <span className="text-label-sm text-on-surface-variant">Modifier</span>
                <span className="text-body-md font-semibold truncate">High winds</span>
              </button>
              <button className="p-2.5 rounded-xl bg-surface-container-high/70 hover:bg-primary-container/20 hover:text-primary transition-all text-left flex flex-col gap-1 border border-transparent hover:border-primary/30" onClick={() => runScenario('clean')}>
                <span className="text-label-sm text-on-surface-variant">Intervention</span>
                <span className="text-body-md font-semibold truncate">Clean hotspot now</span>
              </button>
              <button className="p-2.5 rounded-xl bg-surface-container-high/70 hover:bg-primary-container/20 hover:text-primary transition-all text-left flex flex-col gap-1 border border-transparent hover:border-primary/30" onClick={() => runScenario('barrier')}>
                <span className="text-label-sm text-on-surface-variant">Infrastructure</span>
                <span className="text-body-md font-semibold truncate">Add coastal barrier</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-gutter">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">insights</span> Simulation Results
              </h2>
              <span className={`px-2 py-0.5 rounded bg-primary-container/20 text-primary text-label-sm font-label-md ${isLoading ? 'animate-pulse' : ''}`}>{results.confidence}% CONFIDENCE</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container-high/60 flex flex-col gap-1">
                <span className="text-label-md text-on-surface-variant">Predicted Accumulation</span>
                <span className={`font-headline-md text-primary ${isLoading ? 'blur-sm' : ''}`}>{results.accum}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-high/60 flex flex-col gap-1">
                <span className="text-label-md text-on-surface-variant">Estimated Travel</span>
                <span className={`font-headline-md text-secondary ${isLoading ? 'blur-sm' : ''}`}>{results.travel}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40">
                <span className="text-body-md text-on-surface-variant">Primary Hotspot</span>
                <span className={`font-semibold text-on-surface bg-surface-container-high px-2.5 py-1 rounded-md ${isLoading ? 'blur-sm' : ''}`}>{results.primary}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40">
                <span className="text-body-md text-on-surface-variant">Secondary Hotspot</span>
                <span className={`font-semibold text-on-surface bg-surface-container-high px-2.5 py-1 rounded-md ${isLoading ? 'blur-sm' : ''}`}>{results.secondary}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40">
                <span className="text-body-md text-on-surface-variant">Peak Accumulation</span>
                <span className={`font-semibold text-primary-fixed ${isLoading ? 'blur-sm' : ''}`}>{results.peak}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
              <div className="flex items-center justify-between text-label-md text-on-surface-variant">
                <span>Debris Concentration Curve</span>
                <span>kg/m³</span>
              </div>
              <div className="h-28 w-full bg-surface-container-high/50 rounded-xl p-3 flex items-end justify-between gap-1 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full p-3" preserveAspectRatio="none" viewBox="0 0 100 50">
                  <path d="M 0 40 Q 25 35, 50 15 T 100 5 L 100 50 L 0 50 Z" fill="url(#grad)" opacity="0.3"></path>
                  <path d="M 0 40 Q 25 35, 50 15 T 100 5" fill="none" stroke="#00f2fe" strokeWidth="2"></path>
                  <defs>
                    <linearGradient id="grad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#00f2fe"></stop>
                      <stop offset="100%" stopColor="transparent"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-2 left-3 text-label-sm text-on-surface-variant font-label-md">T+0h</div>
                <div className="absolute bottom-2 right-3 text-label-sm text-primary font-label-md">T+72h Max</div>
              </div>
            </div>
            <Link className="w-full py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline-sm flex items-center justify-center gap-2 transition-all border border-primary/20 hover:border-primary/50 group" to="/hotspots">
              <span>View Hotspots</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulate;
