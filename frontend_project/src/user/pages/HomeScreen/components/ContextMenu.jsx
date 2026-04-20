import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, CheckCircle2, AlertTriangle, Hammer, PlusCircle } from 'lucide-react'

const ContextMenu = ({ x, y, room, onClose, onStatusUpdate, roomStatuses }) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('scroll', onClose, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', onClose, true)
    }
  }, [onClose])

  if (!room) return null

  const isOccupied = !!room.guestName
  const prefix = isOccupied ? 'O/' : 'V/'

  // Dynamic items based on room type and current status
  const menuItems = []

  // Helper to find status by name or keyword
  const findStatus = (keyword) => {
    return roomStatuses.find(
      (s) =>
        s.roomStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
        s.shortName?.toLowerCase().includes(keyword.toLowerCase()),
    )
  }

  // Status mapping for quick updates
  const statusOptions = [
    {
      label: `${prefix}Dirty`,
      keyword: 'Dirty',
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    },
    {
      label: `${prefix}Clean`,
      keyword: 'Clean',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    },
    {
      label: `${prefix}Main`,
      keyword: 'Maintenance',
      icon: <Hammer className="h-4 w-4 text-blue-500" />,
    },
  ]

  statusOptions.forEach((opt) => {
    const statusObj = findStatus(opt.keyword)
    if (statusObj) {
      menuItems.push({
        label: opt.label,
        icon: opt.icon,
        onClick: () => onStatusUpdate(room.id, statusObj.id),
      })
    }
  })

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="fixed z-9999 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
        style={{ top: y, left: x }}
      >
        <div className="mb-1 border-b border-slate-100 px-4 py-2 dark:border-slate-700/50">
          <p className="text-pms-tiny font-black tracking-widest text-slate-400 uppercase">
            Room {room.roomName} Actions
          </p>
        </div>

        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              item.onClick()
              onClose()
            }}
            className="group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <span className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="text-xs font-bold tracking-wide text-slate-700 uppercase dark:text-slate-200">
              {item.label}
            </span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default ContextMenu
