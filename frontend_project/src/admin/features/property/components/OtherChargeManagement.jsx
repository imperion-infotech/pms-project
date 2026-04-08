import React, { useState } from 'react'
import { Plus, Edit3, Trash2, Zap, Search, Check, X } from 'lucide-react'
import { useOtherChargeController } from '../controllers/useOtherChargeController'

const OtherChargeManagement = ({
  otherCharges,
  setIsOtherChargeModalOpen,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
}) => {
  const { processedOtherCharges, getIndex } = useOtherChargeController({
    otherCharges,
    currentPage,
    itemsPerPage,
  })

  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDeleteClick = (oc) => {
    setDeleteConfirm(oc)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Layer */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm transition-all hover:scale-110">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
              Other Charges
            </h1>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Manage Additional Service Fees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOtherChargeModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-700 hover:shadow-orange-500/40 active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-3" />
            <span>Add Charge Type</span>
          </button>
        </div>
      </div>

      {/* Main Table Layer */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-2xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:shadow-slate-300/50 dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  No.
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Short Name
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Charge Name
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Taxable
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Always Charge
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Reoccur Charge
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Reoccur Frequency
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  CRS Charge
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Call Logging Charge
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  POS Charge
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Forecasting Revenue
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {processedOtherCharges.length > 0 ? (
                processedOtherCharges.map((oc, index) => (
                  <tr
                    key={oc.id || index}
                    className="group transition-all hover:bg-orange-500/5 dark:hover:bg-orange-500/10"
                  >
                    <td className="px-6 py-5 text-center font-mono text-xs font-bold text-slate-300 group-hover:text-orange-500 dark:text-slate-600">
                      {getIndex(index)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {oc.otherChargeShortName}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400">
                          <Zap className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {oc.otherChargeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {oc.categoryName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {oc.taxable ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <X className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {oc.alwaysCharge ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <X className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {oc.reoccureCharge ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <X className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {oc.reoccureChargeFrequency || 0}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {oc.crsCharge ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <X className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {oc.callLoggingCharge ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <X className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {oc.callPOSCharge ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <X className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {oc.foreCastingRevenue ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <X className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => onEdit(oc)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-orange-200 hover:text-orange-500 hover:shadow-orange-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-900 dark:hover:shadow-none"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(oc)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-red-200 hover:text-red-500 hover:shadow-red-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900 dark:hover:shadow-none"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/20">
                        <Zap className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                          No Other Charges Found
                        </p>
                        <p className="text-xs text-slate-400">
                          Try adding a new charge type to get started
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-8 shadow-2xl dark:bg-slate-900">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-black tracking-tight text-slate-800 dark:text-white">
              Delete Charge Type?
            </h3>
            <p className="mb-8 text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-bold text-slate-800 dark:text-white">
                "{deleteConfirm.otherChargeName}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-extrabold tracking-widest text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 dark:bg-slate-800"
              >
                CANCEL
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-2xl bg-red-500 py-3 text-xs font-extrabold tracking-widest text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OtherChargeManagement
