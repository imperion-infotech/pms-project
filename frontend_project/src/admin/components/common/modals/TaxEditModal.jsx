import React from 'react'
import { Receipt, X, Save } from 'lucide-react'

export const TaxEditModal = ({
  isOpen,
  setIsOpen,
  editTax,
  setEditTax,
  handleUpdateTax,
  taxes = [],
}) => {
  if (!isOpen) return null

  const isDuplicate = taxes.some(
    (t) =>
      t.id !== editTax.id &&
      String(t.taxMasterName).toLowerCase() === String(editTax.taxMasterName).toLowerCase(),
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleUpdateTax(e)
  }

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        <div className="flex items-center justify-between bg-blue-600 p-6 text-white transition-colors dark:bg-blue-900">
          <div className="flex items-center gap-3">
            <Receipt className="h-6 w-6 text-blue-200" />
            <div>
              <h3 className="text-lg font-bold">Update Tax Master</h3>
              <p className="text-pms-tiny font-bold tracking-widest text-blue-100 uppercase">
                Edit Configuration ID: {editTax.id}
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
              value={editTax.taxMasterName}
              onChange={(e) => setEditTax({ ...editTax, taxMasterName: e.target.value })}
              placeholder="e.g. GST 18%"
              className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm shadow-inner transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
            />
            {isDuplicate && (
              <p className="animate-in slide-in-from-top-1 mt-1.5 text-pms-tiny font-bold text-red-500 sm:text-xs">
                Other Tax name already exists!
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Tax Type
            </label>
            <select
              value={editTax.taxTypeEnum}
              onChange={(e) => setEditTax({ ...editTax, taxTypeEnum: e.target.value })}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            >
              <option value="Occupancy_tax">Occupancy Tax</option>
              <option value="Demo_tax">Demo Tax</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all ${editTax.perDayTax ? 'border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/5' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}
            >
              <input
                type="checkbox"
                checked={editTax.perDayTax}
                onChange={(e) => setEditTax({ ...editTax, perDayTax: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 accent-blue-500"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Per Day Tax
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all ${editTax.perStayTax ? 'border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/5' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}
            >
              <input
                type="checkbox"
                checked={editTax.perStayTax}
                onChange={(e) => setEditTax({ ...editTax, perStayTax: e.target.checked })}
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
              disabled={isDuplicate || !editTax.taxMasterName}
              className={`flex flex-2 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400`}
            >
              <Save className="h-4 w-4" />
              {isDuplicate ? 'EXISTS' : 'UPDATE TAX'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
