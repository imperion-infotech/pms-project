import React from 'react'
import CheckInOutDetails from './CheckInOutDetails'

const GuestInformation = ({ formData, handleChange, isDark = false }) => {
  const labelClass = 'text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block'
  const inputContainerClass = `flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-blue-500/50'
      : 'bg-white border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 shadow-sm'
  }`
  const selectClass =
    'bg-transparent border-none outline-none w-full text-xs font-bold text-slate-700 dark:text-slate-100 placeholder:text-slate-400'

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClass}>
            Guest Status <span className="text-red-500">*</span>
          </label>
          <div className={inputContainerClass}>
            <select
              required
              name="guestDetailsStatus"
              value={formData.guestDetailsStatus}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="Reservation">Reservation</option>
              <option value="Check-In">Check-In</option>
              <option value="In-House">In-House</option>
              <option value="Check-Out">Check-Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Temporal Logistics (Check In / Out) */}
      <CheckInOutDetails formData={formData} handleChange={handleChange} isDark={isDark} />
    </div>
  )
}

export default GuestInformation
