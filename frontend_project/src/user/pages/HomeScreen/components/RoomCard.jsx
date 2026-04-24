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
      className="group relative aspect-3/4.5 w-full cursor-pointer overflow-hidden rounded-2xl border bg-white transition-all duration-500 dark:bg-slate-900/60 dark:backdrop-blur-2xl"
      style={{
        borderColor: `${statusColor}40`,
        boxShadow: `
          0 10px 30px -10px rgba(0,0,0,0.5),
          0 0 20px -5px ${statusColor}30,
          0 0 40px -10px ${statusColor}20
        `, // Layered Triple Glow Effect
      }}
      variants={{
        initial: { y: 0, scale: 1 },
        hover: {
          y: -8,
          scale: 1.02,
          boxShadow: `0 25px 50px -12px ${statusColor}50`, // Intense hover bloom
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {/* Technical Border Glow (Industrial Detail) */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-700 group-hover:border-current opacity-0 group-hover:opacity-20"
        style={{ color: statusColor }}
      />
      {/* Dynamic Inner Glow for Premium Depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top left, ${statusColor}15, transparent 70%)`,
        }}
      />
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
            <span className="text-pms-compact leading-tight font-black tracking-tight text-white uppercase">
              {room.guestName ||
                (room.profile ? `${room.profile.firstName} ${room.profile.lastName}` : 'GUEST')}
            </span>
            {(room.profile?.phone || room.phone) && (
              <span className="text-pms-tiny font-bold text-slate-300">
                {room.profile?.phone || room.phone}
              </span>
            )}
            {(room.profile?.email || room.email) && (
              <span className="text-pms-micro truncate font-medium text-slate-400">
                {room.profile?.email || room.email}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Status Strip (Dynamic Position) */}
      <div
        className={`absolute top-0 bottom-0 w-1.5 ${room.side === 'right' ? 'right-0' : 'left-0'}`}
        style={{ backgroundColor: statusColor }}
      />

      <div
        className={`flex h-full flex-col justify-between p-3 ${room.side === 'right' ? 'pr-5.5' : 'pl-5.5'}`}
      >
        {/* Top Header Row (Side Aware Alignment) */}
        <div
          className={`mb-2 flex items-start justify-between ${room.side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <div
            className={`flex flex-col ${room.side === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
          >
            <span
              className="text-lg leading-tight font-black tracking-tight"
              style={{ color: statusColor }}
            >
              {room.roomName}
            </span>

            {!room.isNonRoom && (
              <span
                className="mt-1 block text-[9px] leading-tight font-black tracking-wider uppercase"
                style={{ color: statusColor }}
              >
                {statusName}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`text-[9px] font-black tracking-tight text-slate-900 uppercase dark:text-white ${room.side === 'right' ? 'text-left' : 'text-right'}`}
            >
              {room.shortName || 'STD'}
            </span>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="mx-auto flex gap-1">
          <div
            title="Guest Profile"
            className="flex h-6.5 w-6.5 cursor-pointer items-center justify-center rounded-md border border-slate-100/50 bg-slate-50/30 transition-all hover:scale-110 hover:bg-emerald-500/10 active:scale-95 dark:border-slate-700/30 dark:bg-slate-800/30"
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
              className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-slate-100/50 bg-slate-50/30 transition-all hover:bg-orange-500/10 dark:border-slate-700/30 dark:bg-slate-800/30"
            >
              <Cigarette className="h-3 w-3 text-orange-500 opacity-80 group-hover:opacity-100" />
            </div>
          )}
          {room.handicap && (
            <div
              title="Handicap Accessible"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-slate-100/50 bg-slate-50/30 transition-all hover:bg-blue-500/10 dark:border-slate-700/30 dark:bg-slate-800/30"
            >
              <Accessibility className="h-3 w-3 text-blue-500 opacity-80 group-hover:opacity-100" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default RoomCard
