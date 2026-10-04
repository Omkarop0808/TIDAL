

const Header = () => {
  return (
    <header className="fixed top-0 lg:left-72 left-0 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-gutter shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <span className="text-label-md text-on-surface-variant uppercase tracking-wider hidden sm:block">Monitored Region:</span>
        <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md border border-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">public</span>
          Mumbai Coast
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-label-sm text-on-surface-variant hidden sm:block">Updated: Just now</span>
        <button className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container"></span>
        </button>
        <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
