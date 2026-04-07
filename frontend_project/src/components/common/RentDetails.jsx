import React from 'react'

const FieldRow = ({
  label,
  name,
  highlight = false,
  colorClass = '',
  formData,
  handleChange,
  isDark,
}) => {
  const containerClass =
    'flex items-center justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-700/50'
  const labelClass = 'text-[9px] font-bold text-slate-500 uppercase tracking-widest'
  const inputContainerClass = `flex items-center px-2 py-0.5 rounded-lg w-24 border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10'
      : 'bg-white border-slate-100 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10'
  }`
  const inputClass =
    'bg-transparent border-none outline-none w-full text-[10px] font-black text-right text-slate-800 dark:text-slate-100 placeholder:text-slate-300'

  return (
    <div className={containerClass}>
      <label
        className={`${labelClass} ${highlight ? 'font-black text-emerald-600 dark:text-emerald-400' : ''} ${colorClass}`}
      >
        {label}
      </label>
      <div
        className={`${inputContainerClass} ${highlight ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/20' : ''}`}
      >
        <input
          type="number"
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          className={`${inputClass} ${colorClass}`}
          step="0.01"
          placeholder="0.00"
        />
      </div>
    </div>
  )
}

const RentDetails = ({ formData, handleChange, isDark = false }) => {
  return (
    <div className="flex h-full flex-col font-sans">
      <div className="flex-1 space-y-1">
        <FieldRow
          label="Rent"
          name="rent"
          colorClass="text-blue-600 dark:text-blue-400"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <FieldRow
          label="Basic Rent"
          name="totalRental"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <FieldRow
          label="Tax"
          name="taxId"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <FieldRow
          label="Total Rental"
          name="totalRental"
          highlight
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <div className="my-2 h-px bg-transparent"></div> {/* Spacing */}
        <FieldRow
          label="Other Charges"
          name="otherChanrges"
          colorClass="text-blue-600 dark:text-blue-400"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <FieldRow
          label="Discount"
          name="discount"
          colorClass="text-blue-600 dark:text-blue-400"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <FieldRow
          label="Total Charges"
          name="totalCharges"
          highlight
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <div className="my-2 h-px bg-transparent"></div>
        <FieldRow
          label="Payments"
          name="payments"
          colorClass="text-blue-600 dark:text-blue-400"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <FieldRow
          label="CC Auth"
          name="ccAuthorized"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <FieldRow
          label="Deposit"
          name="deposite"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
      </div>

      <div className="mt-4 border-t-2 border-slate-800 pt-3 dark:border-slate-200">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <label className="text-[11px] font-black tracking-widest text-slate-900 uppercase dark:text-white">
            Balance
          </label>
          <div className="w-[45%]">
            <input
              type="number"
              name="balance"
              value={formData.balance || ''}
              onChange={handleChange}
              readOnly
              className="w-full bg-transparent text-right text-base font-black text-slate-900 outline-none dark:text-slate-100"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentDetails
