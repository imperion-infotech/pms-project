import React from 'react'

const FinancialPlacement = ({ formData, handleChange, isDark = false }) => {
  const labelClass =
    'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'
  const inputContainerClass = `flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50'
      : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
  }`
  const inputClass =
    'bg-transparent border-none outline-none w-full text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300'

  return (
    <div className="space-y-4 rounded-2xl bg-slate-100/50 p-4 dark:bg-slate-800/40">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
          Financial Details
        </span>
      </div>

      {/* Core Financials */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Basic Rate</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="basic"
              value={formData.basic}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Rent Amount</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tax ID</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className={inputClass}
              placeholder="ID"
            />
          </div>
        </div>
      </div>

      {/* Adjustments & Totals */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Discount</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Other Charges</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="otherChanrges"
              value={formData.otherChanrges}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Total Rental</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="totalRental"
              value={formData.totalRental}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Guests</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="noOfGuest"
              value={formData.noOfGuest}
              onChange={handleChange}
              className={inputClass}
              min="1"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Total Charges</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="totalCharges"
              value={formData.totalCharges}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="grid grid-cols-4 gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
        <div>
          <label className={labelClass}>Payments</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              step="0.01"
              name="payments"
              value={formData.payments}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>CC Auth</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              step="0.01"
              name="ccAuthorized"
              value={formData.ccAuthorized}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Deposit</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              step="0.01"
              name="deposite"
              value={formData.deposite}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Balance</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              step="0.01"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialPlacement
