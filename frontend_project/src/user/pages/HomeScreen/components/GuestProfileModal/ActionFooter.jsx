import React from 'react'
import { CalendarCheck, CheckCircle, RefreshCw, ArrowLeftRight, Printer, X } from 'lucide-react'

const ActionFooter = ({
  isSubmitting,
  uploadingType,
  isReserved,
  handleSubmit,
  reservationColor,
  occupiedColor,
  onClose,
}) => {
  return (
    <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-slate-50/80 px-8 py-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <button
        type="button"
        onClick={(e) => handleSubmit(e, 'Reservation')}
        disabled={isSubmitting || uploadingType || isReserved}
        className={`text-pms-tiny flex items-center gap-2 rounded-lg px-5 py-2.5 font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${
          isSubmitting || uploadingType || isReserved
            ? 'cursor-not-allowed bg-slate-400 shadow-none'
            : 'hover:opacity-90'
        }`}
        style={{
          backgroundColor:
            isSubmitting || uploadingType || isReserved ? undefined : reservationColor,
          boxShadow:
            isSubmitting || uploadingType || isReserved
              ? undefined
              : `0 20px 25px -5px ${reservationColor}4d, 0 8px 10px -6px ${reservationColor}4d`,
        }}
      >
        <CalendarCheck size={14} />
        <span>Reservation</span>
      </button>

      <button
        type="button"
        onClick={(e) => handleSubmit(e, 'Occupied')}
        disabled={isSubmitting || uploadingType}
        className={`text-pms-tiny flex items-center gap-2 rounded-lg px-5 py-2.5 font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${
          isSubmitting || uploadingType
            ? 'cursor-not-allowed bg-slate-400 shadow-none'
            : 'hover:opacity-90'
        }`}
        style={{
          backgroundColor: isSubmitting || uploadingType ? undefined : occupiedColor,
          boxShadow:
            isSubmitting || uploadingType
              ? undefined
              : `0 20px 25px -5px ${occupiedColor}4d, 0 8px 10px -6px ${occupiedColor}4d`,
        }}
      >
        <CheckCircle size={14} />
        <span>Check In</span>
      </button>

      <button
        type="submit"
        form="guestProfileForm"
        disabled={isSubmitting || uploadingType}
        className={`text-pms-tiny flex items-center gap-2 rounded-lg px-5 py-2.5 font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'bg-indigo-600 shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40'}`}
      >
        <RefreshCw size={14} className={isSubmitting ? 'animate-spin' : ''} />
        <span>Update Profile</span>
      </button>

      <div className="mx-2 h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        <ArrowLeftRight size={14} />
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        <Printer size={16} />
      </button>

      <button
        type="button"
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-red-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default ActionFooter
