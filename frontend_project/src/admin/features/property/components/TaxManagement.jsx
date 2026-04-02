import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusCircle,
  Pencil,
  Trash2,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react'
import useTaxController from '../hooks/useTaxController'

/**
 * View: TaxManagement
 * Tax configuration module using MVC architecture.
 */
const TaxManagement = ({ taxes, setIsTaxModalOpen, onEdit, onDelete }) => {
  const {
    processedTaxes,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useTaxController({
    taxes,
    onDelete,
  })

  return (
    <div className="dark:bg-surface-100 rounded-xl border border-slate-200 bg-white shadow-md transition-colors duration-300 dark:border-slate-800">
      {/* Tax Action Bar */}
      <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:p-6 dark:border-slate-800">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-lg font-bold tracking-tight text-[#1a2b4b] md:text-xl dark:text-slate-100">
            Tax Management
          </h2>
          <p className="text-xs font-medium text-slate-400 md:text-sm">
            Manage and organize property tax masters
          </p>
        </div>

        <button
          onClick={() => setIsTaxModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-[11px] font-black tracking-wider text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95 sm:w-auto md:px-6 md:text-xs"
        >
          <PlusCircle className="h-5 w-5" />
          ADD NEW TAX MASTER
        </button>
      </div>

      <div className="custom-scrollbar max-h-[600px] w-full overflow-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-200 bg-[#f8fafc] text-[11px] font-bold tracking-wider text-[#64748b] uppercase dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
              <th className="w-24 border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                No.
              </th>
              <th className="border-r border-slate-200 px-8 py-4 dark:border-slate-800">
                Tax Name
              </th>
              <th className="border-r border-slate-200 px-8 py-4 dark:border-slate-800">
                Tax Type
              </th>
              <th className="border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                Daily
              </th>
              <th className="border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                Stay
              </th>
              <th className="px-8 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-800">
            {processedTaxes.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-8 py-20 text-center text-slate-400 dark:text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="h-10 w-10 opacity-20" />
                    <p className="text-[10px] font-medium tracking-widest uppercase">
                      No tax masters defined
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              processedTaxes.map((tax, idx) => (
                <tr
                  key={tax.id}
                  className="group h-14 transition-all hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5"
                >
                  <td className="border-r border-slate-100 px-8 py-2 text-center font-mono text-[11px] font-bold text-slate-300 group-hover:text-emerald-500 dark:border-slate-800 dark:text-slate-600">
                    {idx + 1}
                  </td>
                  <td className="border-r border-slate-100 px-8 py-2 font-bold tracking-tight text-slate-800 uppercase dark:border-slate-800 dark:text-slate-200">
                    {tax.taxMasterName}
                  </td>
                  <td className="border-r border-slate-100 px-8 py-2 text-[11px] font-bold text-slate-500 uppercase dark:border-slate-800">
                    {tax.taxTypeEnum?.replace('_', ' ') || 'STANDARD'}
                  </td>
                  <td className="border-r border-slate-100 px-8 py-2 text-center dark:border-slate-800">
                    <div className="flex justify-center">
                      {tax.perDayTax ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-200 dark:text-slate-700" />
                      )}
                    </div>
                  </td>
                  <td className="border-r border-slate-100 px-8 py-2 text-center dark:border-slate-800">
                    <div className="flex justify-center">
                      {tax.perStayTax ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-200 dark:text-slate-700" />
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onEdit(tax)}
                        className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        title="Edit Tax"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tax)}
                        className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                        title="Delete Tax"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
          <div className="dark:bg-surface-100 relative z-10 w-full max-w-sm rounded-2xl border border-red-100 bg-white p-6 shadow-2xl dark:border-red-900/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Delete Tax Master
                </h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button
                onClick={handleCancelDelete}
                className="ml-auto rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete tax master{' '}
              <span className="font-bold text-red-500">"{deleteTarget.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-2 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(TaxManagement)
