import { useState } from 'react';

const scenarios = [
  {
    id: 1,
    icon: 'bolt',
    title: 'Clean Juhu now',
    desc: 'Immediate deployment before peak accumulation.',
    impactLabel: 'Predicted Impact:',
    impactValue: '+34% Recovery',
    impactColor: 'text-primary-fixed',
    baseColor: 'primary-container'
  },
  {
    id: 2,
    icon: 'scan',
    title: 'Place collection barrier',
    desc: 'Deploy offshore boom at Bandra channel.',
    impactLabel: 'Predicted Impact:',
    impactValue: '-45% Shore Drift',
    impactColor: 'text-emerald-400',
    baseColor: 'primary-container'
  },
  {
    id: 3,
    icon: 'group_add',
    title: 'Increase cleanup teams',
    desc: 'Scale active units from 12 to 18 squads.',
    impactLabel: 'Predicted Impact:',
    impactValue: '1.8h Total Clear',
    impactColor: 'text-primary-fixed',
    baseColor: 'primary-container'
  },
  {
    id: 4,
    icon: 'schedule',
    title: 'Delay cleanup by 24h',
    desc: 'Simulate weather delay and tidal drift.',
    impactLabel: 'Predicted Impact:',
    impactValue: '-62% Efficiency',
    impactColor: 'text-error',
    baseColor: 'error'
  }
];

const InterventionSimulator = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed">science</span>
          Intervention Simulator
        </h3>
        <span className="text-label-sm text-on-surface-variant hidden sm:block">SELECT SCENARIO TO PREDICT CHANGE</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((scenario) => {
          const isActive = activeId === scenario.id;
          
          let cardClasses = "p-5 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-outline-variant/20 flex flex-col justify-between gap-4 transition-all cursor-pointer group ";
          let iconWrapperClasses = "w-8 h-8 rounded-lg flex items-center justify-center transition-colors ";
          
          if (scenario.baseColor === 'error') {
            cardClasses += isActive ? "border-error shadow-[0_0_15px_rgba(255,180,171,0.2)] " : "hover:border-error/50 ";
            iconWrapperClasses += isActive ? "bg-error text-on-error-container " : "bg-error/20 text-error group-hover:bg-error group-hover:text-on-error-container ";
          } else {
            cardClasses += isActive ? "border-primary-fixed shadow-[0_0_15px_rgba(0,242,254,0.2)] " : "hover:border-primary-fixed/50 ";
            iconWrapperClasses += isActive ? "bg-primary-container text-on-primary-container " : "bg-primary-container/20 text-primary-fixed group-hover:bg-primary-container group-hover:text-on-primary-container ";
          }

          return (
            <div 
              key={scenario.id} 
              className={cardClasses}
              onClick={() => setActiveId(isActive ? null : scenario.id)}
            >
              <div className="flex flex-col gap-2">
                <span className={iconWrapperClasses}>
                  <span className="material-symbols-outlined text-[18px]">{scenario.icon}</span>
                </span>
                <h4 className="font-headline-sm text-on-surface">{scenario.title}</h4>
                <p className="text-body-sm text-on-surface-variant">{scenario.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 font-label-md">
                <span className="text-on-surface-variant">{scenario.impactLabel}</span>
                <span className={`${scenario.impactColor} font-semibold`}>{scenario.impactValue}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterventionSimulator;
