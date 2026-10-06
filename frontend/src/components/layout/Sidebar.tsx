

import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low/90 backdrop-blur-xl z-50 hidden lg:flex flex-col justify-between py-6 px-4 border-r border-outline-variant/10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary-container font-headline-md">T</div>
          <span className="font-headline-lg text-primary tracking-wider">TIDAL</span>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/overview" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-container text-on-primary-container font-medium shadow-[0_0_15px_rgba(0,242,254,0.3)] text-glow' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            Overview
          </NavLink>
          <NavLink to="/simulate" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-container text-on-primary-container font-medium shadow-[0_0_15px_rgba(0,242,254,0.3)] text-glow' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            Simulate
          </NavLink>
          <NavLink to="/hotspots" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-container text-on-primary-container font-medium shadow-[0_0_15px_rgba(0,242,254,0.3)] text-glow' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[20px]">near_me</span>
            Hotspots
          </NavLink>
          <NavLink to="/circular-recovery" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-container text-on-primary-container font-medium shadow-[0_0_15px_rgba(0,242,254,0.3)] text-glow' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[20px]">cycle</span>
            Circular Recovery
          </NavLink>
          <NavLink to="/model-lab" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-container text-on-primary-container font-medium shadow-[0_0_15px_rgba(0,242,254,0.3)] text-glow' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[20px]">science</span>
            Model Lab
          </NavLink>
        </nav>
      </div>
      <div className="flex flex-col gap-4 px-3">
        <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-2 font-label-md">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Data Status</span>
            <span className="flex items-center gap-1.5 text-primary-fixed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
              LIVE
            </span>
          </div>
          <div className="text-on-surface font-semibold">LIVE DATA SIMULATION</div>
          <div className="flex items-center justify-between text-on-surface-variant pt-1 border-t border-outline-variant/20">
            <span>System</span>
            <span className="text-emerald-400">Operational</span>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline/30 text-on-surface font-headline-sm">AS</div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-body-md font-semibold text-on-surface truncate">Dr. Ananya Sharma</span>
            <span className="text-label-sm text-on-surface-variant truncate">Senior Oceanographer</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
