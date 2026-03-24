import React from 'react';
import { motion } from 'framer-motion';
import {
  Cigarette, CigaretteOff, Accessibility, Ban,
  AlertTriangle
} from 'lucide-react';

// ─── Room Status Palette ───
export const STATUS_PALETTE = {
  VACANT: { color: '#22c55e', bg: '#f0fdf4', label: 'Ready' },
  OCCUPIED: { color: '#eab308', bg: '#fefce8', label: 'Staying' },
  DIRTY: { color: '#ef4444', bg: '#fef2f2', label: 'Cleaning' },
  MAINTENANCE: { color: '#3b82f6', bg: '#eff6ff', label: 'Repairs' },
  RESERVED: { color: '#6366f1', bg: '#eef2ff', label: 'Incoming' }
};

export const getStatusTheme = (statusName = '') => {
  const name = statusName.toUpperCase();
  if (name.includes('VAC') || name.includes('READY') || name.includes('CLEAN')) return STATUS_PALETTE.VACANT;
  if (name.includes('OCC') || name.includes('STAY')) return STATUS_PALETTE.OCCUPIED;
  if (name.includes('DIRT') || name.includes('CLEAN')) return STATUS_PALETTE.DIRTY;
  if (name.includes('MAINT') || name.includes('OUT')) return STATUS_PALETTE.MAINTENANCE;
  if (name.includes('RES') || name.includes('EXP')) return STATUS_PALETTE.RESERVED;
  return { color: '#94a3b8', bg: '#f8fafc', label: statusName };
};

const RoomCard = ({ room, onClick }) => {
  const theme = getStatusTheme(room.statusDetails?.roomStatusName || 'Unknown');
  const statusColor = room.statusDetails?.roomStatusColor || theme.color;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: "0 20px 40px -10px rgb(0 0 0 / 0.15)",
        borderColor: statusColor + '90'
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-full sm:w-[165px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-sm transition-all duration-300 cursor-pointer"
    >
      {/* Status Strip (Left) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: statusColor }}
      />

      <div className="p-3.5 pl-5">
        {/* Top Header Row */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-[17px] font-black tracking-tight leading-none mb-1" style={{ color: statusColor }}>
              {room.roomName}
            </span>
            {room.isNonRoom ? (
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mt-1">Utility Space</span>
            ) : room.guestName ? (
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate max-w-[85px]">
                {room.guestName}
              </span>
            ) : (
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Vacant</span>
            )}
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">
              {room.shortName || 'STD'}
            </span>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex justify-between items-center pt-2 mt-4 border-t border-slate-50 dark:border-slate-700/50">

          <div className="flex gap-1">
            {room.smoking && (
              <div title="Smoking Allowed" className="p-1 bg-slate-50 dark:bg-slate-700/40 rounded transition-transform">
                <Cigarette className="w-3 h-3 text-orange-500 opacity-60 group-hover:opacity-100" />
              </div>
            )}
            {room.handicap && (
              <div title="Handicap Accessible" className="p-1 bg-slate-50 dark:bg-slate-700/40 rounded transition-transform">
                <Accessibility className="w-3 h-3 text-blue-500 opacity-60 group-hover:opacity-100" />
              </div>
            )}
          </div>

          {room.isNonRoom && (
            <div title="Internal Utility" className="text-red-400 opacity-40 group-hover:opacity-100">
              <AlertTriangle className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
