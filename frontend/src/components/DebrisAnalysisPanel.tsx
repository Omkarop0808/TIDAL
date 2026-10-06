import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Recycle, Droplets } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface DebrisAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activityId?: string;
}

export function DebrisAnalysisPanel({ isOpen, onClose, activityId }: DebrisAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activityId) {
      setLoading(true);
      // Fetching from the new OceanEye-inspired endpoint
      axios.get(`http://localhost:8000/api/v1/telemetry/analysis/${activityId}`)
        .then(res => {
          setAnalysis(res.data.analysis);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, activityId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[4000]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-surface-container-low border-l border-outline-variant/20 z-[5000] overflow-y-auto"
          >
            <div className="p-8 pt-12 md:p-12 flex flex-col gap-12">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-on-surface-variant font-label-sm tracking-widest uppercase mb-4 block">OceanEye Vision Link</span>
                  <h2 className="text-4xl font-headline-md tracking-tighter text-on-surface">Debris Analysis</h2>
                </div>
                <button onClick={onClose} className="p-4 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors group">
                  <X className="w-6 h-6 text-on-surface-variant group-hover:text-on-surface transition-colors" />
                </button>
              </div>

              {loading || !analysis ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                  <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-on-surface-variant font-label-md tracking-widest uppercase">Analyzing Telemetry Data...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-10">
                  {/* Mock Drone Image crop */}
                  <div className="w-full h-72 bg-surface-container-lowest rounded-3xl overflow-hidden relative border border-outline-variant/10 group">
                    <img src="/drone-debris.jpg" alt="Detected Debris" className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 border-2 border-primary-container/50 rounded-3xl m-4 pointer-events-none"></div>
                    
                    {/* Bounding Box Mock */}
                    <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] border-2 border-primary-container bg-primary-container/20 rounded-xl flex items-start justify-start p-3 pointer-events-none transition-all duration-700">
                      <div className="w-3 h-3 bg-primary-container rounded-full animate-pulse"></div>
                    </div>

                    <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <span className="text-on-surface font-label-sm tracking-widest uppercase">Confidence {analysis.confidence}%</span>
                    </div>
                  </div>

                  {/* Classification header */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-4xl md:text-5xl font-headline-lg tracking-tighter text-on-surface">{analysis.trashType}</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="px-5 py-2.5 rounded-full bg-error/10 text-error font-label-sm tracking-widest uppercase border border-error/20">Threat: {analysis.threatLevel}</span>
                      <span className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm tracking-widest uppercase border border-outline-variant/10">{analysis.size}</span>
                    </div>
                  </div>

                  {/* Data Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-surface-container flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-warning">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-label-sm tracking-widest uppercase text-on-surface-variant">Decomposition</span>
                      </div>
                      <span className="text-3xl font-headline-md text-on-surface">{analysis.decompositionYears} Years</span>
                    </div>

                    <div className="p-6 rounded-3xl bg-surface-container flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-error">
                        <Droplets className="w-5 h-5" />
                        <span className="font-label-sm tracking-widest uppercase text-on-surface-variant">Location</span>
                      </div>
                      <span className="text-2xl font-headline-sm text-on-surface">{analysis.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="p-8 rounded-3xl bg-error/5 border border-error/10 flex flex-col gap-4">
                      <span className="font-label-sm tracking-widest uppercase text-error">Environmental Impact</span>
                      <p className="text-lg font-body-lg text-on-surface leading-relaxed">{analysis.environmentalImpact}</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-secondary/5 border border-secondary/10 flex flex-col gap-4">
                      <span className="font-label-sm tracking-widest uppercase text-secondary">Probable Source</span>
                      <p className="text-lg font-body-lg text-on-surface leading-relaxed">{analysis.probableSource}</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-primary-container/5 border border-primary-container/10 flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-primary-container">
                        <Recycle className="w-5 h-5" />
                        <span className="font-label-sm tracking-widest uppercase">Disposal Strategy</span>
                      </div>
                      <p className="text-lg font-body-lg text-on-surface leading-relaxed">{analysis.disposalInstructions}</p>
                    </div>
                  </div>
                  
                  <button onClick={onClose} className="mt-4 py-5 rounded-full bg-primary-container text-on-primary-container font-headline-sm hover:scale-105 transition-transform shadow-xl shadow-primary-container/20">
                    Acknowledge & Route Skimmer
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
