import React from 'react'
import { User, X } from 'lucide-react'

const ModalHeader = ({ isDark, room, formData, setFormData, onClose }) => {
  return (
    <div
      className={`flex shrink-0 items-center justify-between border-b p-4 shadow-sm sm:px-8 ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-white/40'} backdrop-blur-xl`}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/20">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 text-left">
          <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
            <span className="text-blue-500">Guest Profile</span>
          </h2>
          <div className="mt-0.5 flex items-center gap-2 text-left">
            <div className="h-1 w-1 rounded-full bg-blue-500"></div>
            <p className="text-pms-tiny font-bold tracking-widest text-slate-400 uppercase">
              Comprehensive Check-in & Allotment • RM {room.roomName}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-6 rounded-lg px-4 py-2 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
        >
          <div className="flex flex-col items-end">
            <span className="text-pms-micro font-bold tracking-widest text-slate-400 uppercase">
              Folio No.
            </span>
            <input
              type="text"
              value={formData.folioNo || ''}
              readOnly
              className="bg-transparent text-right text-xs font-black text-blue-600 outline-none dark:text-blue-400"
              placeholder="—"
            />
          </div>
          <div className={`h-8 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          <div className="flex flex-col items-end">
            <span className="text-pms-micro font-bold tracking-widest text-slate-400 uppercase">
              CRS Folio No.
            </span>
            <input
              type="text"
              value={formData.crsFolioNo || ''}
              onChange={(e) => setFormData({ ...formData, crsFolioNo: e.target.value })}
              className={`w-24 bg-transparent text-right text-xs font-black outline-none focus:text-blue-600 dark:text-white dark:focus:text-blue-400 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}
              placeholder="Enter No."
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="group flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 active:scale-95 dark:bg-slate-800 dark:hover:bg-red-900/20"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default ModalHeader
