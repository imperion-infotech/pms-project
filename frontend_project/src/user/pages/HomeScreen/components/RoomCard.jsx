import React from 'react'
import { motion } from 'framer-motion'
import { Cigarette, CigaretteOff, Accessibility, Ban, AlertTriangle, User } from 'lucide-react'

const RoomCard = ({ room, onClick, onContextMenu }) => {
  // Use status details directly from API
  const statusDetails = room.statusDetails || {}

  // Extract color from API (trying common field names)
  const statusColor =
    statusDetails.roomStatusColor || statusDetails.statusColor || statusDetails.color || '#94a3b8' // Fallback to slate if none found

  const statusName =
    statusDetails.roomStatusName || statusDetails.statusName || statusDetails.name || 'Unknown'

  return (
    <motion.div
      onClick={onClick}
      onContextMenu={(e) => onContextMenu(e, room)}
      whileHover="hover"
      initial="initial"
      animate="initial"
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 sm:w-[165px] dark:border-slate-700/50 dark:bg-slate-800"
    >
      {/* Tooltip Overlay (Appears on Hover) */}
      {(room.guestName || room.firstName || room.profile) && (
        <motion.div
          variants={{
            initial: { opacity: 0, y: 15, scale: 0.9, display: 'none' },
            hover: { opacity: 1, y: 0, scale: 1, display: 'flex' },
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 p-4 text-center backdrop-blur-md"
        >
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <User size={18} />
          </div>
          <div className="flex w-full flex-col gap-1">
            <span className="text-[12px] leading-tight font-black tracking-tight text-white uppercase">
              {room.guestName ||
                (room.profile ? `${room.profile.firstName} ${room.profile.lastName}` : 'GUEST')}
            </span>
            {(room.profile?.phone || room.phone) && (
              <span className="text-[10px] font-bold text-slate-300">
                {room.profile?.phone || room.phone}
              </span>
            )}
            {(room.profile?.email || room.email) && (
              <span className="truncate text-[9px] font-medium text-slate-400">
                {room.profile?.email || room.email}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Status Strip (Left) */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1.5"
        style={{ backgroundColor: statusColor }}
      />

      <div className="p-3.5 pl-5">
        {/* Top Header Row */}
        <div className="mb-2 flex items-start justify-between">
          <div className="flex flex-col">
            <span
              className="mb-1 text-[17px] leading-none font-black tracking-tight"
              style={{ color: statusColor }}
            >
              {room.roomName}
            </span>

            {/* Guest Name removed as per user request */}

            {!room.isNonRoom && (
              <span
                className="mt-1 block text-[9px] font-bold tracking-widest uppercase"
                style={{ color: statusColor }}
              >
                {statusName}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] leading-none font-black tracking-widest text-slate-900 uppercase dark:text-white">
              {room.shortName || 'STD'}
            </span>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-2 dark:border-slate-700/50">
          <div className="flex gap-1">
            <div
              title="Guest Profile"
              className="cursor-pointer rounded bg-slate-50 p-1 transition-transform hover:bg-emerald-500/10 dark:bg-slate-700/40"
              onClick={(e) => {
                e.stopPropagation()
                onClick(room)
              }}
            >
              <User className="h-3 w-3 text-emerald-500" />
            </div>
            {room.smoking && (
              <div
                title="Smoking Allowed"
                className="rounded bg-slate-50 p-1 transition-transform dark:bg-slate-700/40"
              >
                <Cigarette className="h-3 w-3 text-orange-500 opacity-60 group-hover:opacity-100" />
              </div>
            )}
            {room.handicap && (
              <div
                title="Handicap Accessible"
                className="rounded bg-slate-50 p-1 transition-transform dark:bg-slate-700/40"
              >
                <Accessibility className="h-3 w-3 text-blue-500 opacity-60 group-hover:opacity-100" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RoomCard
