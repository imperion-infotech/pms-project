import React from 'react'
import { CreditCard, X, CheckCircle2 } from 'lucide-react'

export const PaymentTypeModal = ({
  isOpen,
  setIsOpen,
  newPaymentType,
  setNewPaymentType,
  handleAdd,
  paymentTypes = [],
}) => {
  if (!isOpen) return null

  const isDuplicate = paymentTypes.some(
    (pt) =>
      String(pt.paymentTypeName).toLowerCase() ===
      String(newPaymentType.paymentTypeName).toLowerCase(),
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleAdd(e)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl duration-300 dark:border-slate-800/50">
        <div className="relative flex items-center justify-between overflow-hidden bg-orange-600 p-6 text-white">
          <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10">
            <CreditCard className="h-24 w-24 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">New Payment Type</h3>
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
        <form onSubmit={onSubmit} className="space-y-6 p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="mb-2 block px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Short Name
              </label>
              <input
                required
                type="text"
                value={newPaymentType.paymentTypeShortName}
                onChange={(e) =>
                  setNewPaymentType({ ...newPaymentType, paymentTypeShortName: e.target.value })
                }
                placeholder="e.g., CC"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              />
            </div>
            <div className="col-span-1">
              <label className="mb-2 block px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Category
              </label>
              <select
                value={newPaymentType.categoryName}
                onChange={(e) =>
                  setNewPaymentType({ ...newPaymentType, categoryName: e.target.value })
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              >
                <option value="">Select Category</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Net Banking">Net Banking</option>
                <option value="UPI">UPI</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              Payment Type Name
            </label>
            <input
              autoFocus
              required
              type="text"
              value={newPaymentType.paymentTypeName}
              onChange={(e) =>
                setNewPaymentType({ ...newPaymentType, paymentTypeName: e.target.value })
              }
              placeholder="e.g., Visa Credit Card"
              className={`w-full border bg-slate-50 px-4 py-3 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:text-slate-200`}
            />
            {isDuplicate && (
              <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-red-500">
                <X className="h-3 w-3" /> This payment type already exists!
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              Description
            </label>
            <textarea
              rows="3"
              value={newPaymentType.description}
              onChange={(e) =>
                setNewPaymentType({ ...newPaymentType, description: e.target.value })
              }
              placeholder="Describe this payment method..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            ></textarea>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 transition-colors ${newPaymentType.creditCardProcessing ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-400 dark:bg-slate-700'}`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Credit Card Processing
                </h4>
                <p className="text-[10px] text-slate-400">Enable online card verification</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={newPaymentType.creditCardProcessing}
                onChange={(e) =>
                  setNewPaymentType({ ...newPaymentType, creditCardProcessing: e.target.checked })
                }
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-orange-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700"></div>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-xs font-extrabold tracking-widest text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              DISCARD
            </button>
            <button
              type="submit"
              disabled={
                isDuplicate ||
                !newPaymentType.paymentTypeName ||
                !newPaymentType.paymentTypeShortName
              }
              className={`flex-2 rounded-2xl py-3.5 text-xs font-extrabold tracking-widest text-white shadow-xl transition-all active:scale-95 ${isDuplicate || !newPaymentType.paymentTypeName || !newPaymentType.paymentTypeShortName ? 'cursor-not-allowed bg-slate-300 shadow-none grayscale dark:bg-slate-800' : 'bg-orange-600 shadow-orange-600/30 hover:bg-orange-700'}`}
            >
              {isDuplicate ? 'ALREADY EXISTS' : 'SAVE PAYMENT METHOD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
