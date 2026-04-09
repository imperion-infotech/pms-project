import React from 'react'

const FieldRow = ({
  label,
  name,
  highlight = false,
  colorClass = '',
  formData,
  handleChange,
  isDark,
  type = 'number',
  options = [],
}) => {
  const containerClass =
    'flex items-center justify-between py-2 border-b border-dashed border-slate-200 dark:border-slate-700/50'
  const labelClass = 'text-[10px] font-bold text-slate-500 uppercase tracking-widest'
  const inputContainerClass = `flex items-center px-4 py-2 rounded-xl border transition-all w-32 ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-blue-500/50'
      : 'bg-white border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 shadow-sm'
  } ${highlight ? 'border-blue-400/50 ring-4 ring-blue-500/5 shadow-blue-500/10' : ''}`
  const inputClass =
    'bg-transparent border-none outline-none w-full text-xs font-black text-right text-slate-800 dark:text-slate-100 placeholder:text-slate-400'

  return (
    <div className={containerClass}>
      <label
        className={`${labelClass} ${highlight ? 'text-blue-600 dark:text-blue-400' : ''} ${colorClass}`}
      >
        {label}
      </label>
      <div className={inputContainerClass}>
        {type === 'select' ? (
          <select
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer appearance-none text-left! ${colorClass}`}
          >
            <option value="">Select</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="number"
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className={`${inputClass} ${colorClass}`}
            step="0.01"
            placeholder="0.00"
          />
        )}
      </div>
    </div>
  )
}

const RentDetails = ({ formData, handleChange, isDark = false, taxes = [] }) => {
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
          label="Basic"
          name="basic"
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
        <FieldRow
          label="Tax"
          name="taxId"
          type="select"
          options={taxes.map((t) => ({ id: t.id, name: t.taxMasterName }))}
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
          name="otherCharges"
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
        <FieldRow
          label="Balance"
          name="balance"
          highlight
          formData={formData}
          handleChange={handleChange}
          isDark={isDark}
        />
      </div>
    </div>
  )
}

export default RentDetails
