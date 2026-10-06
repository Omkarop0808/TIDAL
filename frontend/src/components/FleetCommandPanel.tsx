import { motion, AnimatePresence } from 'framer-motion';
import { X, Anchor, Zap } from 'lucide-react';

interface FleetCommandPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockFleet = [
  { id: 'SKM-01', type: 'Autonomous Skimmer', battery: 85, capacity: '8.2 / 10 tons', status: 'En route to Versova', lat: 19.129, lng: 72.815 },
  { id: 'SKM-02', type: 'Autonomous Skimmer', battery: 42, capacity: '9.8 / 10 tons', status: 'Returning to Port', lat: 18.922, lng: 72.834 },
  { id: 'T-BRAVO', type: 'Human Response Unit', battery: 100, capacity: 'N/A', status: 'On Standby at Juhu', lat: 19.098, lng: 72.826 },
  { id: 'SKM-03', type: 'Autonomous Skimmer', battery: 96, capacity: '2.1 / 10 tons', status: 'Active Sweeping', lat: 18.980, lng: 72.810 },
];

export const FleetCommandPanel = ({ isOpen, onClose }: FleetCommandPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-surface-container-low border-l border-outline-variant/20 z-[9999] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant font-label-md tracking-widest uppercase">Live Telemetry</span>
                <h2 className="text-3xl font-headline-md text-on-surface">Fleet Command</h2>
              </div>
              <button onClick={onClose} className="p-3 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              {mockFleet.map((unit) => (
                <div key={unit.id} className="p-6 rounded-2xl bg-surface-container border border-outline-variant/10 flex flex-col gap-6 group hover:border-outline-variant/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
                        {unit.id.startsWith('SKM') ? <Zap className="w-5 h-5" /> : <Anchor className="w-5 h-5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface font-headline-sm">{unit.id}</span>
                        <span className="text-on-surface-variant text-label-sm uppercase tracking-widest">{unit.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high">
                      <div className={`w-2 h-2 rounded-full ${unit.battery > 50 ? 'bg-emerald-400' : 'bg-warning'}`}></div>
                      <span className="text-on-surface-variant text-body-sm font-label-md tracking-wider">{unit.battery}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-on-surface-variant text-label-sm uppercase tracking-widest">Capacity</span>
                      <span className="text-on-surface text-body-lg">{unit.capacity}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-on-surface-variant text-label-sm uppercase tracking-widest">Status</span>
                      <span className="text-primary-container text-body-md truncate" title={unit.status}>{unit.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
