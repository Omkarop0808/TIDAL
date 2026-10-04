

const ComparisonVisual = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Without TIDAL */}
      <div className="bg-surface-container/40 backdrop-blur-xl rounded-2xl p-6 flex flex-col gap-4 border border-error/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-error-container text-on-error-container rounded-bl-xl font-label-md">RANDOM DEPLOYMENT</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-error/20 flex items-center justify-center text-error">
            <span className="material-symbols-outlined">block</span>
          </div>
          <div>
            <h4 className="font-headline-md text-on-surface">WITHOUT TIDAL</h4>
            <p className="text-body-sm text-on-surface-variant">Conventional reactionary cleanup cycles</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant">RECOVERY RATE</span>
            <span className="font-headline-md text-error">38%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant">TIME TO CLEAR</span>
            <span className="font-headline-md text-on-surface">72h+</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant">COST EFFICIENCY</span>
            <span className="font-headline-md text-on-surface">Low</span>
          </div>
        </div>
      </div>

      {/* With TIDAL */}
      <div className="bg-surface-container/80 backdrop-blur-xl rounded-2xl p-6 flex flex-col gap-4 border border-primary-container/40 relative overflow-hidden shadow-[0_0_30px_rgba(0,242,254,0.1)]">
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary-container text-on-primary-container rounded-bl-xl font-label-md font-semibold">PREDICTION-DRIVEN</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-fixed">
            <span className="material-symbols-outlined">auto_graph</span>
          </div>
          <div>
            <h4 className="font-headline-md text-on-surface">WITH TIDAL</h4>
            <p className="text-body-sm text-on-surface-variant">AI-optimized telemetry routing</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant">RECOVERY RATE</span>
            <span className="font-headline-md text-primary-fixed">78%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant">TIME TO CLEAR</span>
            <span className="font-headline-md text-on-surface">18h</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant">COST EFFICIENCY</span>
            <span className="font-headline-md text-primary-fixed">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonVisual;
