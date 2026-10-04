import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DispatchPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DispatchAssignment {
  vessel_name: string;
  target_zone: string;
  eta_hours: number;
  estimated_recovery_kg: number;
  reasoning: string;
}

const DispatchPlanModal: React.FC<DispatchPlanModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<DispatchAssignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      // First, get the current hotspots
      axios.get('http://localhost:8000/api/v1/hotspots/spatial')
        .then(res => {
          const hotspots = res.data;
          // Then request optimized dispatch
          return axios.post('http://localhost:8000/api/v1/dispatch/optimize', { hotspots });
        })
        .then(res => {
          setAssignments(res.data);
        })
        .catch(err => {
          console.error("Error generating dispatch plan:", err);
          setError("Failed to generate optimized dispatch plan.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-outline/20 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline/10 bg-surface-container-high/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <span className="material-symbols-outlined text-primary-fixed text-[24px]">route</span>
            </div>
            <div>
              <h2 className="text-on-surface font-headline-md">AI Fleet Dispatch Optimizer</h2>
              <p className="text-on-surface-variant font-body-md">Gemini-powered tactical routing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-surface-bright flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-6">
              <div className="w-16 h-16 rounded-full border-4 border-surface-container-highest border-t-primary-fixed animate-spin"></div>
              <div className="text-center">
                <h3 className="font-headline-sm text-on-surface">Optimizing Dispatch Plan...</h3>
                <p className="font-body-md text-on-surface-variant">Analyzing hotspots, weather, and fleet capacity</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-error">
              <span className="material-symbols-outlined text-[48px]">error</span>
              <p className="font-headline-sm">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between bg-primary-container/10 p-4 rounded-xl border border-primary-container/30">
                <div className="flex items-center gap-2 text-primary-fixed font-label-lg">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Optimal Plan Generated</span>
                </div>
                <div className="flex gap-6">
                  <div className="text-right">
                    <p className="font-label-sm text-on-surface-variant">Est. Recovery</p>
                    <p className="font-headline-sm text-on-surface">
                      {assignments.reduce((acc, curr) => acc + curr.estimated_recovery_kg, 0)} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-on-surface-variant">Vessels Deployed</p>
                    <p className="font-headline-sm text-on-surface">{assignments.length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((assignment, index) => (
                  <div key={index} className="bg-surface rounded-2xl p-5 border border-outline/10 hover:border-primary/30 transition-colors shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">directions_boat</span>
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-on-surface">{assignment.vessel_name}</h4>
                          <p className="font-label-sm text-on-surface-variant tracking-wider uppercase">Deploying to {assignment.target_zone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface font-label-md">
                          ETA: {assignment.eta_hours}h
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="font-body-md text-on-surface-variant border-l-2 border-primary-fixed pl-3 py-1 italic">
                        "{assignment.reasoning}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-outline/10">
                      <span className="font-label-md text-on-surface-variant">Target Yield</span>
                      <span className="font-headline-sm text-primary">{assignment.estimated_recovery_kg} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline/10 bg-surface flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-on-surface font-label-lg hover:bg-surface-container-highest transition-colors">
            Dismiss
          </button>
          <button 
            disabled={loading || !!error}
            onClick={() => {
              alert("Dispatch orders transmitted to fleet!");
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Transmit Orders
          </button>
        </div>

      </div>
    </div>
  );
};

export default DispatchPlanModal;
