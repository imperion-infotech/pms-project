import React, { useState } from 'react';
import { ChevronRight, Building2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoomCard from './RoomCard';

/**
 * FloorSection Component
 * Represents a professional accordion grouping for rooms per floor.
 * Optimized for high-end industrial property management dashboards.
 */
const FloorSection = ({ floorName, rooms = [], isDark, onRoomClick }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`mb-6 border rounded-3xl overflow-hidden transition-all duration-500 group/floor ${isDark
      ? 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80 shadow-2xl shadow-black/20'
      : 'bg-white border-slate-200/80 hover:border-emerald-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] shadow-sm'
      }`}>

      {/* ─── HEADER SECTION ─── */}
      <div
        onClick={() => setExpanded(e => !e)}
        className={`p-4 sm:p-5 flex items-center justify-between transition-all cursor-pointer select-none ${isDark
          ? 'bg-gradient-to-r from-slate-900/80 to-slate-900/40'
          : 'bg-gradient-to-r from-slate-50/80 to-white'
          } ${expanded ? (isDark ? 'border-b border-slate-800' : 'border-b border-slate-100') : ''}`}
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {/* Icon Container with Glass Effect */}
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-inner group-hover/floor:scale-110 ${isDark
            ? 'bg-emerald-500/10 text-emerald-400 group-hover/floor:bg-emerald-500/20'
            : 'bg-emerald-50 text-emerald-600 group-hover/floor:bg-emerald-100'
            }`}>
            <Building2 className="w-5.5 h-5.5" />
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className={`font-black text-[16px] tracking-tight truncate ${isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
              {floorName}
            </h3>

          </div>

          {/* Room Count Badge */}
          <div className={`ml-4 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black text-[11px] transition-all ${isDark
            ? 'bg-slate-800/50 border-slate-700/50 text-slate-400 group-hover/floor:border-emerald-500/30 group-hover/floor:text-emerald-400'
            : 'bg-slate-50 border-slate-200 text-slate-500 group-hover/floor:border-emerald-200 group-hover/floor:text-emerald-600'
            }`}>
            <Layers className="w-3.5 h-3.5 opacity-60" />
            <span>{rooms.length} Rooms</span>
          </div>
        </div>

        {/* Expansion Trigger */}
        <div className="flex items-center">
          <div className={`p-2 rounded-xl transition-all ${expanded
            ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
            : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400')
            }`}>
            <ChevronRight
              className={`w-5 h-5 transition-transform duration-500 ${expanded ? 'rotate-90' : 'rotate-0'}`}
            />
          </div>
        </div>
      </div>

      {/* ─── CONTENT AREA (With Smooth Animation) ─── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-5 px-6 py-8 relative ${isDark ? 'bg-slate-900/20' : 'bg-slate-50/30'
              }`}>
              {/* Background Accent Gleam */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />

              {rooms.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-10 opacity-60">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <Layers className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-400 italic">
                    All clear! No resources mapped to this level.
                  </span>
                </div>
              ) : (
                rooms.map(room => (
                  <RoomCard 
                    key={room.id} 
                    room={room} 
                    onClick={() => onRoomClick(room)}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloorSection;
