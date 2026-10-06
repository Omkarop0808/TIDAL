import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Crosshair, Map, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProtocolAlphaOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolAlphaOverlay = ({ isOpen, onClose }: ProtocolAlphaOverlayProps) => {
  const [stage, setStage] = useState(0); // 0: initial, 1: simulated

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setStage(1), 2000);
      return () => clearTimeout(timer);
    } else {
      setStage(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-6 md:p-12"
        >
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={onClose}></div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-surface-container-low border border-primary-container/20 rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col gap-12 overflow-hidden"
          >
            {/* Grid background effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f2fe1a_1px,transparent_1px),linear-gradient(to_bottom,#00f2fe1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-error-container/20 text-error flex items-center justify-center animate-pulse">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-headline-xl text-on-surface tracking-tighter">Protocol Alpha</h2>
                </div>
                <p className="text-xl text-on-surface-variant font-body-lg max-w-2xl">
                  Simulating extreme response scenario based on current hydrodynamic vectors and predictive debris aggregation.
                </p>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest font-label-md">
                Abort
              </button>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/10 flex flex-col gap-4">
                <Crosshair className="w-6 h-6 text-primary-container" />
                <div className="flex flex-col gap-1">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest">Primary Objective</span>
                  <span className="text-on-surface font-headline-sm">Containment at Versova</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/10 flex flex-col gap-4">
                <Map className="w-6 h-6 text-secondary" />
                <div className="flex flex-col gap-1">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest">Asset Reallocation</span>
                  <span className="text-on-surface font-headline-sm">3 Skimmers Diverted</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/10 flex flex-col gap-4">
                <Activity className="w-6 h-6 text-emerald-400" />
                <div className="flex flex-col gap-1">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest">Projected Impact</span>
                  <span className="text-on-surface font-headline-sm">
                    {stage === 0 ? 'Calculating...' : '+7% Recovery'}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between font-label-md uppercase tracking-widest">
                <span className="text-on-surface-variant">Simulation Progress</span>
                <span className="text-primary-container">{stage === 0 ? '34%' : '100%'}</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: stage === 0 ? '34%' : '100%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-primary-container h-full rounded-full"
                ></motion.div>
              </div>
            </div>

            <div className="relative z-10 flex justify-end">
              <button 
                disabled={stage === 0}
                className="px-10 py-5 rounded-full bg-primary-container text-on-primary-container font-headline-sm flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-500 ease-out shadow-2xl shadow-primary-container/20"
                onClick={onClose}
              >
                {stage === 0 ? 'Simulating...' : 'Confirm Execution'}
              </button>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
