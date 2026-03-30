// Page layout structures - Navbar
import { Menu, Building2, Home, ChevronDown, UserCircle } from 'lucide-react';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="h-16 bg-surface-100 text-white flex items-center justify-between px-4 md:px-6 shrink-0 shadow-lg z-10">
      <div className="flex items-center gap-2 md:gap-6 min-w-0">
        <div className={`transition-all duration-300 overflow-hidden flex items-center justify-center ${!isSidebarOpen ? "w-10 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="Open Sidebar"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
          </button>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-xl leading-none tracking-tight">PMS</h1>
            <p className="text-[8px] md:text-[10px] text-emerald-400 font-bold tracking-[0.2em] mt-1">SYSTEMS</p>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-700 mx-2"></div>

        {/* <div className="flex items-center gap-3 cursor-pointer group bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-700/50 transition-all">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Home className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">ASI Anand Systems</span>
            <span className="text-[10px] text-slate-500">Property Admin</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div> */}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">Administrator</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Super User</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-all group">
            <UserCircle className="w-7 h-7 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
