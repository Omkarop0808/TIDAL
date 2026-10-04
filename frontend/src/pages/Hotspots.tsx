import HotspotRanking from '../components/dashboard/HotspotRanking';
import LiveMap from '../components/dashboard/LiveMap';
import CleanupOptimization from '../components/dashboard/CleanupOptimization';
import ComparisonVisual from '../components/dashboard/ComparisonVisual';
import InterventionSimulator from '../components/dashboard/InterventionSimulator';
import DispatchPlanModal from '../components/dashboard/DispatchPlanModal';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Hotspots = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full px-gutter py-8 gap-10">
      
      {/* Top Header / Intro Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-primary-container/20 text-primary-fixed font-label-md tracking-wider">TACTICAL DEPLOYMENT</span>
            <span className="text-on-surface-variant font-label-md">// SECTOR 04 - MUMBAI COASTLINE</span>
          </div>
          <h1 className="font-headline-xl text-on-surface">Hotspots & Cleanup Operations</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">Turn predictions into targeted action. Real-time telemetry guides tactical deployment to intercept marine debris before shoreline impact.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 rounded-xl bg-surface-container-high text-on-surface font-headline-sm hover:bg-surface-container-highest transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed">refresh</span>
            Recalculate
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-secondary-container font-headline-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,254,0.5)] animate-pulse group">
            <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-error text-white text-[10px] font-bold rounded-full shadow-lg">NEW AI</span>
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">auto_awesome</span>
            Deploy AI Cleanup Plan
          </button>
        </div>
      </div>

      {/* Main Grid: Left Panel, Center Map, Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <HotspotRanking />
        <LiveMap />
        <CleanupOptimization />
      </div>

      <ComparisonVisual />
      <InterventionSimulator />

      {/* Bottom CTA connecting to Circular Recovery */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high border border-primary-container/30 flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed">cycle</span>
            <span className="font-label-md text-primary-fixed">SECTOR INTEGRATION</span>
          </div>
          <h3 className="font-headline-lg text-on-surface">Ready to route recovered debris to Circular Recovery?</h3>
          <p className="font-body-md text-on-surface-variant">Seamlessly transfer collected marine waste batches into downstream recycling and upcycling facilities for verified carbon offset tracking.</p>
        </div>
        <Link to="/circular-recovery" className="px-8 py-4 rounded-xl bg-primary-container text-on-primary-container font-headline-sm hover:opacity-90 transition-opacity flex items-center gap-3 whitespace-nowrap shadow-[0_0_25px_rgba(0,242,254,0.4)]">
          <span>Proceed to Circular Recovery</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <DispatchPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Hotspots;
