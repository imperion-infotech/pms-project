import React, { useRef } from 'react'
import { Calendar, Clock } from 'lucide-react'

const CheckInOutDetails = ({ formData, handleChange }) => {
  // Get local YYYY-MM-DD to avoid UTC timezone issues
  const today = new Date().toLocaleDateString('en-CA')

  // Refs for programmatic picker triggering
  const checkInDateRef = useRef(null)
  const checkInTimeRef = useRef(null)
  const checkOutDateRef = useRef(null)
  const checkOutTimeRef = useRef(null)

  const handleIconClick = (ref) => {
    if (ref.current && ref.current.showPicker) {
      ref.current.showPicker()
    } else if (ref.current) {
      ref.current.focus()
    }
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-3 dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/40 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end shadow-xs transition-all hover:shadow-md">
      
      {/* CHECK-IN */}
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-500 uppercase">
          Check-In <span className="text-red-500">*</span>
        </label>
        <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-xs transition-all duration-300 focus-within:border-amber-500/50 focus-within:ring-[6px] focus-within:ring-amber-500/5 dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex flex-1 items-center gap-1.5 min-w-0">
            <input
              required
              ref={checkInDateRef}
              type="date"
              name="checkInDate"
              value={formData.checkInDate ? (formData.checkInDate.includes('T') ? formData.checkInDate.split('T')[0] : formData.checkInDate) : ''}
              onChange={handleChange}
              min={today}
              className="w-full min-w-0 bg-transparent text-[11px] font-bold text-slate-700 outline-none dark:text-slate-100 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
            <Calendar
              size={11}
              className="shrink-0 cursor-pointer text-slate-400 transition-colors hover:text-amber-500"
              onClick={() => handleIconClick(checkInDateRef)}
            />
          </div>
          <div className="mx-2 h-4 w-px shrink-0 bg-slate-100 dark:bg-slate-700"></div>
          <div className="flex shrink-0 items-center gap-1.5">
            <input
              required
              ref={checkInTimeRef}
              type="time"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleChange}
              className="w-auto shrink-0 bg-transparent text-[11px] font-bold text-slate-700 outline-none dark:text-slate-100 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              step="1"
            />
            <Clock
              size={11}
              className="shrink-0 cursor-pointer text-slate-400 transition-colors hover:text-amber-500"
              onClick={() => handleIconClick(checkInTimeRef)}
            />
          </div>
        </div>
      </div>

      {/* CHECK-OUT & DURATION */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[9px] font-black tracking-widest text-slate-500 uppercase">Check-Out <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-black tracking-widest text-amber-500 uppercase">Days</span>
            <input
              type="number"
              name="noOfDays"
              value={formData.noOfDays}
              onChange={handleChange}
              className="w-10 rounded-lg bg-amber-100/40 px-1 py-0.5 text-center text-[10px] font-black text-amber-700 outline-none transition-all dark:bg-amber-900/40 dark:text-amber-400 focus:ring-4 focus:ring-amber-500/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="1"
            />
          </div>
        </div>
        <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-xs transition-all duration-300 focus-within:border-amber-500/50 focus-within:ring-[6px] focus-within:ring-amber-500/5 dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex flex-1 items-center gap-1.5 min-w-0">
            <input
              required
              ref={checkOutDateRef}
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate ? (formData.checkOutDate.includes('T') ? formData.checkOutDate.split('T')[0] : formData.checkOutDate) : ''}
              onChange={handleChange}
              min={formData.checkInDate ? (formData.checkInDate.includes('T') ? formData.checkInDate.split('T')[0] : formData.checkInDate) : today}
              className="w-full min-w-0 bg-transparent text-[11px] font-bold text-slate-700 outline-none dark:text-slate-100 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
            <Calendar
              size={11}
              className="shrink-0 cursor-pointer text-slate-400 transition-colors hover:text-amber-500"
              onClick={() => handleIconClick(checkOutDateRef)}
            />
          </div>
          <div className="mx-2 h-4 w-px shrink-0 bg-slate-100 dark:bg-slate-700"></div>
          <div className="flex shrink-0 items-center gap-1.5">
            <input
              required
              ref={checkOutTimeRef}
              type="time"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleChange}
              className="w-auto shrink-0 bg-transparent text-[11px] font-bold text-slate-700 outline-none dark:text-slate-100 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              step="1"
            />
            <Clock
              size={11}
              className="shrink-0 cursor-pointer text-slate-400 transition-colors hover:text-amber-500"
              onClick={() => handleIconClick(checkOutTimeRef)}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default CheckInOutDetails
