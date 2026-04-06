import { Home, RefreshCw, Sun, Moon, Search, BedDouble, Layers, CalendarRange } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../../context/ThemeContext'

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
  onRefresh,
  isLoading,
}) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div
      className={`z-10 flex w-full shrink-0 flex-col transition-colors duration-300 ${isDark ? 'bg-surface-100' : 'bg-white'}`}
    >
      {/* ─── TOP TIER: Context, Stats, Tools ─── */}
      <div
        className={`flex min-h-[4rem] flex-col items-center justify-between gap-4 border-b px-4 py-3 sm:flex-row sm:gap-0 sm:py-0 md:px-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
      >
        {/* Context Breadcrumb */}
        <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-inner ${isDark ? 'bg-slate-800/80' : 'bg-slate-100/80 text-slate-600'}`}
          >
            <Home className={`h-5 w-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
          </div>
          <div className="flex flex-col text-left">
            <span
              className={`mb-1 text-[10px] leading-none font-black tracking-[0.15em] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
            >
              Current Module
            </span>
            <span
              className={`text-[15px] leading-none font-extrabold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
            >
              Property Engine
            </span>
          </div>
        </div>

        {/* RIGHT SECTION: Stats + Actions */}
        <div className="flex w-full shrink-0 flex-col items-end gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
          {/* QUICK STATS - Sleeker integration */}
          <div
            className={`hidden items-center gap-4 rounded-xl border px-4 py-1.5 lg:flex ${isDark ? 'border-slate-700/60 bg-slate-800/40' : 'border-slate-200/60 bg-slate-50'} shadow-inner`}
          >
            <div className="flex items-center gap-2" title="Total Rooms">
              <BedDouble size={14} className="text-blue-500" />
              <span
                className={`text-[11px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {totalRooms} Rooms
              </span>
            </div>
            <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className="flex items-center gap-2" title="Total Floors">
              <Layers size={14} className="text-orange-500" />
              <span
                className={`text-[11px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {totalFloors} Floors
              </span>
            </div>
            <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className="flex items-center gap-1.5" title="Available Rooms">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
              <span
                className={`text-[11px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {availableRooms} Avail
              </span>
            </div>
            <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className="flex items-center gap-1.5" title="Occupied Rooms">
              <div className="h-2 w-2 rounded-full bg-rose-500"></div>
              <span
                className={`text-[11px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {occupiedRooms} Occ
              </span>
            </div>
          </div>

          {/* Global Toolbar */}
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <div className="relative w-full sm:w-[220px]">
              <Search
                className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              />
              <input
                type="text"
                placeholder="Search resource..."
                className={`w-full rounded-xl border py-2 pr-4 pl-9 text-xs font-medium transition-all focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-200 shadow-inner placeholder:text-slate-500 focus:border-emerald-500/50'
                    : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-emerald-500'
                }`}
              />
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border p-2 transition-all ${
                isDark
                  ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : 'active:scale-95'}`}
              title="Sync Data"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={toggleTheme}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border p-2 transition-all active:scale-95 ${
                isDark
                  ? 'border-slate-700 bg-slate-800/80 hover:border-slate-600 hover:bg-slate-700'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
              title="Toggle Theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM TIER: Floor Navigation ─── */}
      <div
        className={`flex items-center border-b px-4 py-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] md:px-6 ${isDark ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'}`}
      >
        <div
          className={`custom-scrollbar flex w-full min-w-0 flex-1 items-center overflow-x-auto rounded-xl border p-1 ${isDark ? 'border-slate-700/60 bg-slate-900' : 'border-slate-200/60 bg-slate-100 shadow-inner'}`}
        >
          <button
            onClick={() => setSelectedFloor('All')}
            className={`relative flex items-center gap-2 rounded-lg px-5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
              selectedFloor === 'All'
                ? isDark
                  ? 'text-white'
                  : 'text-emerald-900'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {selectedFloor === 'All' && (
              <motion.div
                layoutId="active-floor-tab"
                className={`absolute inset-0 rounded-lg shadow-sm ${isDark ? 'bg-emerald-600' : 'border border-slate-200/60 bg-white shadow-md'}`}
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <CalendarRange size={14} /> All Floors
            </span>
          </button>

          {allFloors.map((floor) => (
            <button
              key={floor.id}
              onClick={() => setSelectedFloor(floor.name)}
              className={`relative flex items-center gap-2 rounded-lg px-5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                selectedFloor === floor.name
                  ? isDark
                    ? 'text-white'
                    : 'text-emerald-900'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {selectedFloor === floor.name && (
                <motion.div
                  layoutId="active-floor-tab"
                  className={`absolute inset-0 rounded-lg shadow-sm ${isDark ? 'bg-emerald-600' : 'border border-slate-200/60 bg-white shadow-md'}`}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Layers size={14} /> {floor.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserPageHeader
