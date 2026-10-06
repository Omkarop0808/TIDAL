import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Database, RefreshCw, BarChart2 } from 'lucide-react';

export default function ModelLab() {
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
    }, 3000);
  };

  return (
    <main className="w-full bg-background min-h-screen text-on-surface px-6 md:px-12 pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-headline-xl tracking-tighter">AI Model Lab</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl">
            Live telemetry and performance metrics for the XGBoost Beaching-Risk Forecaster and YOLO11 Vision pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* XGBoost Performance Card */}
          <div className="p-8 rounded-3xl bg-surface-container border border-outline-variant/10 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline-md flex items-center gap-3">
                <BarChart2 className="text-primary-container" /> XGBoost Performance
              </h2>
              <span className="text-xs uppercase tracking-widest text-emerald-400">Live</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant text-sm tracking-widest uppercase">Mean Absolute Error</span>
                <span className="text-4xl text-on-surface font-headline-lg">14.2 kg</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant text-sm tracking-widest uppercase">R-Squared</span>
                <span className="text-4xl text-on-surface font-headline-lg">0.89</span>
              </div>
            </div>

            <div className="w-full h-px bg-outline-variant/30 my-2"></div>
            
            <div className="flex flex-col gap-3">
              <span className="text-on-surface-variant text-sm tracking-widest uppercase">Top Drivers (SHAP)</span>
              <ul className="flex flex-col gap-2 text-on-surface">
                <li className="flex justify-between"><span>1. Wind Speed (Onshore)</span> <span className="text-primary-container">+45%</span></li>
                <li className="flex justify-between"><span>2. Precipitation (48h)</span> <span className="text-primary-container">+30%</span></li>
                <li className="flex justify-between"><span>3. Tide Velocity</span> <span className="text-primary-container">+15%</span></li>
              </ul>
            </div>
          </div>

          {/* YOLO11 Vision Specs */}
          <div className="p-8 rounded-3xl bg-surface-container border border-outline-variant/10 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline-md flex items-center gap-3">
                <BrainCircuit className="text-secondary" /> YOLO11 Debris Vision
              </h2>
              <span className="text-xs uppercase tracking-widest text-emerald-400">Live</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant text-sm tracking-widest uppercase">Precision</span>
                <span className="text-4xl text-on-surface font-headline-lg">0.92</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant text-sm tracking-widest uppercase">Recall</span>
                <span className="text-4xl text-on-surface font-headline-lg">0.88</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant text-sm tracking-widest uppercase">mAP@50</span>
                <span className="text-4xl text-on-surface font-headline-lg">0.91</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant text-sm tracking-widest uppercase">F1-Score</span>
                <span className="text-4xl text-on-surface font-headline-lg">0.90</span>
              </div>
            </div>
          </div>
        </div>

        {/* Retraining Feedback Loop */}
        <div className="p-8 rounded-3xl bg-surface-container-high border border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-headline-md flex items-center gap-3"><Database className="text-primary" /> Active Learning Feedback Loop</h3>
            <p className="text-on-surface-variant">124 new field reports have been logged since the last model generation.</p>
          </div>
          <button 
            onClick={handleRetrain}
            disabled={isRetraining}
            className="px-8 py-4 rounded-full bg-primary-container text-on-primary-container font-headline-sm flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {isRetraining ? <RefreshCw className="animate-spin" /> : 'Trigger Nightly Retrain'}
          </button>
        </div>
      </div>
    </main>
  );
}
