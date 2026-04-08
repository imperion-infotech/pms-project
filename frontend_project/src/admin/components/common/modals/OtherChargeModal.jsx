import React from 'react'
import { Zap, X, CheckCircle2 } from 'lucide-react'

export const OtherChargeModal = ({
  isOpen,
  setIsOpen,
  newOtherCharge,
  setNewOtherCharge,
  handleAdd,
  otherCharges = [],
}) => {
  if (!isOpen) return null

  const isDuplicate = otherCharges.some(
    (oc) =>
      String(oc.otherChargeName).toLowerCase() ===
      String(newOtherCharge.otherChargeName).toLowerCase(),
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleAdd(e)
  }

  const toggleField = (field) => {
    setNewOtherCharge((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl duration-300 dark:border-slate-800/50">
        {/* Header */}
        <div className="relative flex items-center justify-between overflow-hidden bg-orange-600 p-6 text-white">
          <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10">
            <Zap className="h-24 w-24 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">New Other Charge</h3>
              <p className="text-[10px] font-bold tracking-[0.2em] text-orange-200 uppercase">
                Configuration Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="relative z-10 rounded-xl p-2 transition-colors hover:bg-white/20 active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="scrollbar-hide max-h-[75vh] overflow-y-auto p-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="col-span-1">
              <label className="mb-2 block px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Short Name
              </label>
              <input
                required
                type="text"
                value={newOtherCharge.otherChargeShortName}
                onChange={(e) =>
                  setNewOtherCharge({ ...newOtherCharge, otherChargeShortName: e.target.value })
                }
                placeholder="e.g., LDRY"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              />
            </div>

            <div className="col-span-1">
              <label className="mb-2 block px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Category
              </label>
              <select
                value={newOtherCharge.categoryName}
                onChange={(e) => setNewOtherCharge({ ...newOtherCharge, categoryName: e.target.value })}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              >
                <option value="">Select Category</option>
                <option value="Service">Service</option>
                <option value="Laundry">Laundry</option>
                <option value="Food">Food</option>
                <option value="Mini Bar">Mini Bar</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-2 block px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Charge Name
              </label>
              <input
                required
                type="text"
                value={newOtherCharge.otherChargeName}
                onChange={(e) => setNewOtherCharge({ ...newOtherCharge, otherChargeName: e.target.value })}
                placeholder="e.g., Laundry Service"
                className={`w-full border bg-slate-50 px-4 py-3 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:text-slate-200`}
              />
            </div>

            {/* Toggle Switches */}
            <div className="col-span-2 mt-4 grid grid-cols-2 gap-4">
              {[
                { label: 'Taxable', field: 'taxable', desc: 'Apply tax to this charge' },
                { label: 'Always Charge', field: 'alwaysCharge', desc: 'Apply to every guest' },
                { label: 'Reoccurr Charge', field: 'reoccureCharge', desc: 'Frequent charging' },
                { label: 'CRS Charge', field: 'crsCharge', desc: 'Include in CRS' },
                { label: 'POS Charge', field: 'callPOSCharge', desc: 'Sync with POS' },
                { label: 'Forecasting', field: 'foreCastingRevenue', desc: 'Revenue forecasting' },
              ].map((toggle) => (
                <div
                  key={toggle.field}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 transition-colors ${newOtherCharge[toggle.field] ? 'bg-orange-500/10 text-orange-600' : 'bg-slate-200 text-slate-400 dark:bg-slate-700'}`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {toggle.label}
                      </h4>
                      <p className="text-[9px] text-slate-400">{toggle.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={newOtherCharge[toggle.field]}
                      onChange={() => toggleField(toggle.field)}
                    />
                    <div className="peer h-5 w-9 rounded-full bg-slate-200 peer-checked:bg-orange-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700"></div>
                  </label>
                </div>
              ))}
            </div>

            {newOtherCharge.reoccureCharge && (
              <div className="col-span-2">
                <label className="mb-2 block px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Reoccurrence Frequency (Days)
                </label>
                <input
                  type="number"
                  value={newOtherCharge.reoccureChargeFrequency}
                  onChange={(e) =>
                    setNewOtherCharge({
                      ...newOtherCharge,
                      reoccureChargeFrequency: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-64 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-8">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-xs font-extrabold tracking-widest text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              DISCARD
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newOtherCharge.otherChargeName}
              className={`flex-2 rounded-2xl py-3.5 text-xs font-extrabold tracking-widest text-white shadow-xl transition-all active:scale-95 ${isDuplicate || !newOtherCharge.otherChargeName ? 'cursor-not-allowed bg-slate-300 shadow-none grayscale dark:bg-slate-800' : 'bg-orange-600 shadow-orange-600/30 hover:bg-orange-700'}`}
            >
              {isDuplicate ? 'ALREADY EXISTS' : 'SAVE CHARGE TYPE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
