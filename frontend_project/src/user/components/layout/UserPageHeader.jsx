import {
  Home, RefreshCw, Sun, Moon, Search,
  BedDouble, Layers, CalendarRange
} from 'lucide-react';
import { motion } from 'framer-motion';
/**
 * UserPageHeader component - Professional industrial-level secondary header.
 * Contains purely breadcrumbs, segmented floor navigation, real-time stats, and contextual actions.
 */
const UserPageHeader = ({
  selectedFloor,
  setSelectedFloor,
  allFloors = [],
  totalRooms,
  totalFloors,
  availableRooms,
  occupiedRooms,
  isDark,
  setIsDark,
  onRefresh,
  isLoading
}) => {
  return (
    <div className={`flex flex-col w-full shrink-0 z-10 transition-colors duration-300 ${isDark ? 'bg-[#1e293b]' : 'bg-white'}`}>

      {/* ─── TOP TIER: Context, Stats, Tools ─── */}
      <div className={`min-h-[4rem] border-b flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 sm:py-0 gap-4 sm:gap-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>

        {/* Context Breadcrumb */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${isDark ? 'bg-slate-800/80' : 'bg-slate-100/80 text-slate-600'}`}>
            <Home className={`w-5 h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
          </div>
          <div className="flex flex-col text-left">
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] leading-none mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Current Module</span>
            <span className={`font-extrabold text-[15px] tracking-tight leading-none ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Property Engine
            </span>
          </div>
        </div>

        {/* RIGHT SECTION: Stats + Actions */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:gap-6 shrink-0 w-full sm:w-auto">

          {/* QUICK STATS - Sleeker integration */}
          <div className={`hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200/60'} shadow-inner`}>
            <div className="flex items-center gap-2" title="Total Rooms">
              <BedDouble size={14} className="text-blue-500" />
              <span className={`text-[11px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{totalRooms} Rooms</span>
            </div>
            <div className={`w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className="flex items-center gap-2" title="Total Floors">
              <Layers size={14} className="text-orange-500" />
              <span className={`text-[11px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{totalFloors} Floors</span>
            </div>
            <div className={`w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className="flex items-center gap-1.5" title="Available Rooms">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className={`text-[11px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{availableRooms} Avail</span>
            </div>
            <div className={`w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className="flex items-center gap-1.5" title="Occupied Rooms">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className={`text-[11px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{occupiedRooms} Occ</span>
            </div>
          </div>

          {/* Global Toolbar */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-[220px]">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search resource..."
                className={`pl-9 pr-4 py-2 w-full border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500/50 shadow-inner'
                  : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500'
                  }`}
              />
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center w-9 h-9 ${isDark
                ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-300'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
              title="Sync Data"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center w-9 h-9 active:scale-95 ${isDark
                ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              title="Toggle Protocol Interface"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

        </div>
      </div>

      {/* ─── BOTTOM TIER: Floor Navigation ─── */}
      <div className={`px-4 md:px-6 py-2.5 border-b shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] flex items-center ${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'}`}>
        <div className={`flex items-center p-1 rounded-xl flex-1 min-w-0 w-full overflow-x-auto custom-scrollbar border ${isDark ? 'bg-slate-900 border-slate-700/60' : 'bg-slate-100 border-slate-200/60 shadow-inner'}`}>
          <button
            onClick={() => setSelectedFloor('All')}
            className={`relative px-5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${selectedFloor === 'All'
              ? isDark ? 'text-white' : 'text-emerald-900'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {selectedFloor === 'All' && (
              <motion.div
                layoutId="active-floor-tab"
                className={`absolute inset-0 rounded-lg shadow-sm ${isDark ? 'bg-emerald-600' : 'bg-white border border-slate-200/60 shadow-md'}`}
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5"><CalendarRange size={14} /> All Floors</span>
          </button>

          {allFloors.map(floor => (
            <button
              key={floor.id}
              onClick={() => setSelectedFloor(floor.name)}
              className={`relative px-5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${selectedFloor === floor.name
                ? isDark ? 'text-white' : 'text-emerald-900'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {selectedFloor === floor.name && (
                <motion.div
                  layoutId="active-floor-tab"
                  className={`absolute inset-0 rounded-lg shadow-sm ${isDark ? 'bg-emerald-600' : 'bg-white border border-slate-200/60 shadow-md'}`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5"><Layers size={14} /> {floor.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPageHeader;
