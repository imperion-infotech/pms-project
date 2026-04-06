import React from 'react'

const CheckInOutDetails = ({ formData, handleChange }) => {
  return (
    <div className="space-y-2 rounded-xl bg-slate-100/50 p-3 dark:bg-slate-800/40">
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {/* CHECK-IN */}
        <div className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate ? formData.checkInDate.split('T')[0] : ''}
            onChange={handleChange}
            className="bg-transparent text-[11px] font-bold text-slate-700 outline-none dark:text-slate-200"
          />
          <input
            type="time"
            name="checkInTime"
            value={formData.checkInTime}
            onChange={handleChange}
            className="w-20 bg-transparent text-[11px] font-bold text-slate-700 outline-none dark:text-slate-200"
            step="1"
          />
        </div>

        {/* DURATION */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black tracking-wider text-slate-400">Days</span>
          <input
            type="number"
            name="noOfDays"
            value={formData.noOfDays}
            onChange={handleChange}
            className="w-10 rounded border border-slate-200 bg-white px-1 py-1 text-center text-[11px] font-bold text-slate-700 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200"
            min="1"
          />
        </div>

        {/* CHECK-OUT */}
        <div className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate ? formData.checkOutDate.split('T')[0] : ''}
            onChange={handleChange}
            className="bg-transparent text-[11px] font-bold text-slate-700 outline-none dark:text-slate-200"
          />
          <input
            type="time"
            name="checkOutTime"
            value={formData.checkOutTime}
            onChange={handleChange}
            className="w-20 bg-transparent text-[11px] font-bold text-slate-700 outline-none dark:text-slate-200"
            step="1"
          />
        </div>
      </div>
    </div>
  )
}

export default CheckInOutDetails
