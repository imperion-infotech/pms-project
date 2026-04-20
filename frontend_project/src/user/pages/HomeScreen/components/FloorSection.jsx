import React, { useState } from 'react'
import { ChevronRight, Building2, Layers } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RoomCard from './RoomCard'

/**
 * FloorSection Component
 * Represents a professional accordion grouping for rooms per floor.
 * Optimized for high-end industrial property management dashboards.
 */
const FloorSection = ({ floorName, rooms = [], isDark, onRoomClick, onContextMenu }) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <div
      className={`group/floor mb-6 overflow-hidden rounded-3xl border transition-all duration-500 ${
        isDark
          ? 'border-slate-800/60 bg-slate-900/40 shadow-2xl shadow-black/20 hover:border-slate-700/80'
          : 'border-slate-200/80 bg-white shadow-sm hover:border-emerald-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* ─── HEADER SECTION ─── */}
      <div
        onClick={() => setExpanded((e) => !e)}
        className={`flex cursor-pointer items-center justify-between p-4 transition-all select-none sm:p-5 ${
          isDark
            ? 'bg-linear-to-r from-slate-900/80 to-slate-900/40'
            : 'bg-linear-to-r from-slate-50/80 to-white'
        } ${expanded ? (isDark ? 'border-b border-slate-800' : 'border-b border-slate-100') : ''}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-6">
          {/* Icon Container with Glass Effect */}
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-inner transition-all duration-300 group-hover/floor:scale-110 ${
              isDark
                ? 'bg-emerald-500/10 text-emerald-400 group-hover/floor:bg-emerald-500/20'
                : 'bg-emerald-50 text-emerald-600 group-hover/floor:bg-emerald-100'
            }`}
          >
            <Building2 className="h-5.5 w-5.5" />
          </div>

          <div className="flex min-w-0 flex-col">
            <h3
              className={`truncate text-pms-section font-black tracking-tight ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              {floorName}
            </h3>
          </div>

          {/* Room Count Badge */}
          <div
            className={`ml-4 hidden items-center gap-1.5 rounded-xl border px-3 py-1.5 text-pms-mini font-black transition-all sm:flex ${
              isDark
                ? 'border-slate-700/50 bg-slate-800/50 text-slate-400 group-hover/floor:border-emerald-500/30 group-hover/floor:text-emerald-400'
                : 'border-slate-200 bg-slate-50 text-slate-500 group-hover/floor:border-emerald-200 group-hover/floor:text-emerald-600'
            }`}
          >
            <Layers className="h-3.5 w-3.5 opacity-60" />
            <span>{rooms.length} Rooms</span>
          </div>
        </div>

        {/* Expansion Trigger */}
        <div className="flex items-center">
          <div
            className={`rounded-xl p-2 transition-all ${
              expanded
                ? isDark
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-emerald-50 text-emerald-600'
                : isDark
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-slate-100 text-slate-400'
            }`}
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-500 ${expanded ? 'rotate-90' : 'rotate-0'}`}
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
            <div
              className={`relative grid grid-cols-2 gap-3 px-4 py-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-15 ${
                isDark ? 'bg-slate-900/20' : 'bg-slate-50/30'
              }`}
            >
              {/* Background Accent Gleam */}
              <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-emerald-500/10 to-transparent" />

              {rooms.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-10 opacity-60">
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
                  >
                    <Layers className="h-6 w-6 text-slate-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-400 italic">
                    All clear! No resources mapped to this level.
                  </span>
                </div>
              ) : (
                rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onClick={() => onRoomClick(room)}
                    onContextMenu={onContextMenu}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloorSection
