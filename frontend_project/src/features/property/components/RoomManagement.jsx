/**
 * RoomManagement (Live Inventory View)
 * 
 * Ye project ki main 'Room Inventory' table hai jisme Framer Motion 
 * lagaya gaya hai. Iska design premium (indigo/glass effect) hai.
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusCircle,
  Search,
  Cigarette,
  Accessibility,
  Ban,
  Pencil,
  Trash2,
  LayoutGrid,
} from 'lucide-react'
import useRoomController from '../hooks/useRoomController'

/**
 * View: RoomManagement
 * This serves as the 'View' in our MVC architecture.
 * It focuses exclusively on rendering the UI and handling user interactions.
 */
const RoomManagement = ({
  rooms = [],
  roomTypes = [],
  floors = [],
  buildings = [],
  roomStatuses = [],
  setIsRoomModalOpen = () => {},
  onEdit = () => {},
  onDelete = () => {},
  currentPage = 1,
  itemsPerPage = 8,
  isLoading = false,
}) => {
  // Initialize Controller
  const { processedRooms, getIndex } = useRoomController({
    rooms,
    roomTypes,
    floors,
    buildings,
    roomStatuses,
    currentPage,
    itemsPerPage,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-glass overflow-hidden rounded-3xl border border-white/5 shadow-2xl transition-all duration-500"
    >
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/5 bg-linear-to-br from-indigo-500/5 to-transparent p-6 md:p-8 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <div className="bg-brand/10 border-brand/20 rounded-2xl border p-3">
            <LayoutGrid className="text-brand h-6 w-6" />
          </div>
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
              Room Inventory
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                Live
              </span>
            </h2>
            <p className="mt-1 text-sm font-medium tracking-widest text-slate-400 uppercase opacity-80">
              PHYSICAL ASSETS MONITORING
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRoomModalOpen(true)}
          className="group bg-brand hover:bg-brand-hover shadow-brand/25 relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all active:scale-95"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <PlusCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          ADD NEW ROOM
        </button>
      </div>

      {/* Table Section */}
      <div className="custom-scrollbar w-full overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/5 bg-slate-900/40 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              <th className="w-20 px-6 py-4">Index</th>
              <th className="px-6 py-4">Room & Building</th>
              <th className="px-6 py-4">Room Type & Floor</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-4 py-4 text-center">Amenities</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={`skeleton-${i}`}>
                      <td colSpan="6" className="px-8 py-6">
                        <div className="skeleton h-14 w-full rounded-2xl" />
                      </td>
                    </tr>
                  ))
              ) : processedRooms.length > 0 ? (
                processedRooms.map((room, idx) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={room.id}
                    className="group transition-colors hover:bg-white/2"
                  >
                    <td className="px-6 py-6">
                      <span className="rounded bg-white/5 px-2 py-1 font-mono text-xs font-bold text-slate-500">
                        #{getIndex(idx)}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="group-hover:text-brand text-lg font-bold text-slate-200 transition-colors">
                          {room.roomName}
                          {room.roomShortName && room.roomShortName !== room.roomName && (
                            <span className="ml-2 text-sm text-slate-400 font-medium">({room.roomShortName})</span>
                          )}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded bg-white/5 px-2 font-mono text-[11px] tracking-wider text-slate-500">
                            ID: {room.id}
                          </span>
                          <span className="text-sm font-medium text-slate-400">
                            | {room.displayBuilding}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="bg-brand/10 border-brand/20 w-fit rounded-lg border px-3 py-1 text-sm font-bold text-slate-300">
                          {room.displayRoomType}
                        </span>
                        <span className="ml-1 text-[11px] font-medium text-slate-500">
                          📍 {room.displayFloor}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase shadow-inner">
                        {room.displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <AmenityBadge
                          active={room.isSmoking}
                          icon={<Cigarette className="h-4 w-4" />}
                          color="text-orange-400"
                          tooltip="Smoking Allowed"
                        />
                        <AmenityBadge
                          active={room.isHandicap}
                          icon={<Accessibility className="h-4 w-4" />}
                          color="text-blue-400"
                          tooltip="Handicap Accessible"
                        />
                        <AmenityBadge
                          active={room.isNonRoom}
                          icon={<Ban className="h-4 w-4" />}
                          color="text-rose-400"
                          tooltip="Non-Room Unit (Maintenance/Utility)"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex translate-x-4 items-center justify-end gap-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <button
                          onClick={() => onEdit(room)}
                          className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400 transition-all hover:bg-blue-500 hover:text-white active:scale-90"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(room.id)}
                          className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400 transition-all hover:bg-rose-500 hover:text-white active:scale-90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center space-y-4"
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/5 bg-slate-800/50 shadow-inner">
                        <Search className="h-8 w-8 text-slate-600" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">No Results Found</h3>
                        <p className="mx-auto max-w-[280px] text-sm text-slate-500 italic">
                          We couldn't find any rooms matching your current search parameters.
                        </p>
                      </div>
                    </motion.div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

const AmenityBadge = ({ active, icon, color, tooltip }) => (
  <div
    className={`rounded-xl border p-2.5 transition-all ${
      active
        ? `${color} scale-100 border-white/10 bg-white/5 opacity-100 shadow-lg`
        : 'scale-90 border-transparent bg-transparent text-slate-700 opacity-20'
    }`}
    title={active ? tooltip : 'N/A'}
  >
    {icon}
  </div>
)

export default RoomManagement
