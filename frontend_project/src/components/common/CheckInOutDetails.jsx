import React from 'react'

const CheckInOutDetails = ({ formData, handleChange }) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-1.5 dark:border-slate-800 dark:bg-slate-800/40">
      {/* CHECK-IN */}
      <div className="flex flex-1 items-center justify-between rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900">
        <input
          type="date"
          name="checkInDate"
          value={formData.checkInDate ? formData.checkInDate.split('T')[0] : ''}
          onChange={handleChange}
          className="w-full bg-transparent text-[10px] font-bold text-slate-700 outline-none dark:text-slate-200"
        />
        <div className="mx-2 h-3 w-px bg-slate-200 dark:bg-slate-700"></div>
        <input
          type="time"
          name="checkInTime"
          value={formData.checkInTime}
          onChange={handleChange}
          className="w-16 bg-transparent text-[10px] font-bold text-slate-700 outline-none dark:text-slate-200"
          step="1"
        />
      </div>

      {/* DURATION */}
      <div className="flex items-center rounded-lg border border-blue-100 bg-blue-50 px-2 py-1.5 dark:border-blue-900/50 dark:bg-blue-900/20">
        <span className="mr-1 text-[9px] font-black tracking-widest text-blue-500 uppercase">
          Days
        </span>
        <input
          type="number"
          name="noOfDays"
          value={formData.noOfDays}
          onChange={handleChange}
          className="w-6 bg-transparent text-center text-[11px] font-black text-blue-700 outline-none dark:text-blue-400"
          min="1"
        />
      </div>

      {/* CHECK-OUT */}
      <div className="flex flex-1 items-center justify-between rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900">
        <input
          type="date"
          name="checkOutDate"
          value={formData.checkOutDate ? formData.checkOutDate.split('T')[0] : ''}
          onChange={handleChange}
          className="w-full bg-transparent text-[10px] font-bold text-slate-700 outline-none dark:text-slate-200"
        />
        <div className="mx-2 h-3 w-px bg-slate-200 dark:bg-slate-700"></div>
        <input
          type="time"
          name="checkOutTime"
          value={formData.checkOutTime}
          onChange={handleChange}
          className="w-16 bg-transparent text-[10px] font-bold text-slate-700 outline-none dark:text-slate-200"
          step="1"
        />
      </div>
    </div>
  )
}

export default CheckInOutDetails
