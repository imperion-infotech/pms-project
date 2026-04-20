import React from 'react'
import { Receipt, X } from 'lucide-react'

export const TaxModal = ({ isOpen, setIsOpen, newTax, setNewTax, handleAddTax, taxes = [] }) => {
  if (!isOpen) return null

  const isDuplicate = taxes.some(
    (t) => String(t.taxMasterName).toLowerCase() === String(newTax.taxMasterName).toLowerCase(),
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleAddTax(e)
  }

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        <div className="dark:bg-surface-50 flex items-center justify-between bg-[#1a2b4b] p-6 text-white">
          <div className="flex items-center gap-3">
            <Receipt className="h-6 w-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold">Add New Tax</h3>
              <p className="text-pms-tiny font-bold tracking-widest text-slate-400 uppercase">
                Tax Master Configuration
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Tax Name
            </label>
            <input
              required
              autoFocus
              type="text"
              value={newTax.taxMasterName}
              onChange={(e) => setNewTax({ ...newTax, taxMasterName: e.target.value })}
              placeholder="e.g. GST 18%"
              className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm shadow-inner transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
            />
            {isDuplicate && (
              <p className="animate-in slide-in-from-top-1 mt-1.5 text-pms-tiny font-bold text-red-500 sm:text-xs">
                Tax Name already exists!
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Tax Type
            </label>
            <select
              value={newTax.taxTypeEnum}
              onChange={(e) => setNewTax({ ...newTax, taxTypeEnum: e.target.value })}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            >
              <option value="Occupancy_tax">Occupancy Tax</option>
              <option value="Demo_tax">Demo Tax</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all ${newTax.perDayTax ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/5' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}
            >
              <input
                type="checkbox"
                checked={newTax.perDayTax}
                onChange={(e) => setNewTax({ ...newTax, perDayTax: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 accent-emerald-500"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Per Day Tax
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all ${newTax.perStayTax ? 'border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/5' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}
            >
              <input
                type="checkbox"
                checked={newTax.perStayTax}
                onChange={(e) => setNewTax({ ...newTax, perStayTax: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 accent-blue-500"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Per Stay Tax
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800 dark:hover:text-slate-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newTax.taxMasterName}
              className={`flex-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${isDuplicate || !newTax.taxMasterName ? 'cursor-not-allowed bg-slate-400' : 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95'}`}
            >
              {isDuplicate ? 'EXISTS' : 'ADD TAX'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
