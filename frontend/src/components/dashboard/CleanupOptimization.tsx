

const CleanupOptimization = () => {
  return (
    <div className="lg:col-span-3 glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed">tune</span>
            Cleanup Optimization
          </h3>
          <span className="text-label-sm text-primary-fixed">AI RECOMMENDED</span>
        </div>
        
        {/* Resource Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-surface-container-high flex flex-col items-center text-center">
            <span className="text-label-sm text-on-surface-variant">TEAMS</span>
            <span className="font-headline-md text-on-surface">12</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-high flex flex-col items-center text-center">
            <span className="text-label-sm text-on-surface-variant">VEHICLES</span>
            <span className="font-headline-md text-on-surface">4</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-high flex flex-col items-center text-center">
            <span className="text-label-sm text-on-surface-variant">CAPACITY</span>
            <span className="font-headline-md text-primary-fixed">1.8t</span>
          </div>
        </div>

        {/* Recommended Allocation */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-label-md text-on-surface-variant">Recommended Allocation:</span>
          <div className="flex flex-col gap-1.5 font-label-md">
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60">
              <span className="text-on-surface font-semibold">Team 01 & 02</span>
              <span className="text-error font-medium">→ Juhu Beach</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60">
              <span className="text-on-surface font-semibold">Team 03</span>
              <span className="text-primary-fixed font-medium">→ Versova</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60">
              <span className="text-on-surface font-semibold">Team 04</span>
              <span className="text-secondary font-medium">→ Bandra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Summary */}
      <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-body-md">
          <span className="text-on-surface-variant">Est. Debris Recovery:</span>
          <span className="text-primary-fixed font-semibold font-headline-sm">1.24 tons</span>
        </div>
        <div className="flex items-center justify-between text-body-md">
          <span className="text-on-surface-variant">Travel Distance:</span>
          <span className="text-on-surface font-semibold">36.2 km</span>
        </div>
        <div className="flex items-center justify-between text-body-md">
          <span className="text-on-surface-variant">Recovery Efficiency:</span>
          <span className="text-emerald-400 font-semibold">78%</span>
        </div>
      </div>
    </div>
  );
};

export default CleanupOptimization;
