import React from 'react'

const CheckInOutDetails = ({ formData, handleChange }) => {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
      
      {/* CHECK-IN */}
      <div>
        <label className="mb-1.5 block text-[9px] font-black tracking-widest text-slate-400 uppercase">Check-In</label>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition-all focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900">
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate ? (formData.checkInDate.includes('T') ? formData.checkInDate.split('T')[0] : formData.checkInDate) : ''}
            onChange={handleChange}
            min={today}
            className="w-full min-w-0 bg-transparent text-[10px] font-bold text-slate-700 outline-none dark:text-slate-200"
          />
          <div className="mx-2 h-3 w-px shrink-0 bg-slate-200 dark:bg-slate-700"></div>
          <input
            type="time"
            name="checkInTime"
            value={formData.checkInTime}
            onChange={handleChange}
            className="w-auto shrink-0 bg-transparent text-[10px] font-bold text-slate-700 outline-none dark:text-slate-200"
            step="1"
          />
        </div>
      </div>

      {/* CHECK-OUT & DURATION */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase">Check-Out</label>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-black tracking-widest text-blue-500 uppercase">Days</span>
            <input
              type="number"
              name="noOfDays"
              value={formData.noOfDays}
              onChange={handleChange}
              className="w-10 rounded-md bg-blue-100/60 px-1 py-0.5 text-center text-[10px] font-black text-blue-700 outline-none dark:bg-blue-900/40 dark:text-blue-400 focus:ring-2 focus:ring-blue-400/30"
              min="1"
            />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition-all focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900">
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate ? (formData.checkOutDate.includes('T') ? formData.checkOutDate.split('T')[0] : formData.checkOutDate) : ''}
            onChange={handleChange}
            min={formData.checkInDate ? (formData.checkInDate.includes('T') ? formData.checkInDate.split('T')[0] : formData.checkInDate) : today}
            className="w-full min-w-0 bg-transparent text-[10px] font-bold text-slate-700 outline-none dark:text-slate-200"
          />
          <div className="mx-2 h-3 w-px shrink-0 bg-slate-200 dark:bg-slate-700"></div>
          <input
            type="time"
            name="checkOutTime"
            value={formData.checkOutTime}
            onChange={handleChange}
            className="w-auto shrink-0 bg-transparent text-[10px] font-bold text-slate-700 outline-none dark:text-slate-200"
            step="1"
          />
        </div>
      </div>

    </div>
  )
}

export default CheckInOutDetails
