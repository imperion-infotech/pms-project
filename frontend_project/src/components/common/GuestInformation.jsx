import React from 'react'
import CheckInOutDetails from './CheckInOutDetails'

const GuestInformation = ({ formData, handleChange, isDark = false }) => {
  const labelClass =
    'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'
  const inputContainerClass = `flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50'
      : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
  }`
  const selectClass =
    'bg-transparent border-none outline-none w-full text-xs font-bold text-slate-800 dark:text-slate-100'

  return (
    <div className="space-y-4 text-left">

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClass}>Guest Status</label>
          <div className={inputContainerClass}>
            <select
              name="guestDetailsStats"
              value={formData.guestDetailsStats}
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
