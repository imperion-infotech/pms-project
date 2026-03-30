import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Pencil, Trash2, AlertTriangle, Receipt, Calendar, Info, CheckCircle2, XCircle } from 'lucide-react';
import useTaxController from '../../../../features/property/hooks/useTaxController';

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
    handleCancelDelete
  } = useTaxController({
    taxes,
    onDelete
  });

  return (
    <div className="bg-white dark:bg-surface-100 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Tax Action Bar */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b4b] dark:text-slate-100 font-heading tracking-tight">Tax Management</h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Manage and organize property tax masters</p>
        </div>

        <button
          onClick={() => setIsTaxModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 md:px-6 py-2.5 rounded-xl text-[11px] md:text-xs font-black tracking-wider transition-all shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          ADD NEW TAX MASTER
        </button>
      </div>

      {/* Tax Table */}
      <div className="w-full overflow-auto custom-scrollbar max-h-[600px]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f8fafc] dark:bg-slate-800 text-[#64748b] dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="px-8 py-4 w-24 text-center border-r border-slate-200 dark:border-slate-800">No.</th>
              <th className="px-8 py-4 border-r border-slate-200 dark:border-slate-800">Tax Name</th>
              <th className="px-8 py-4 border-r border-slate-200 dark:border-slate-800">Tax Type</th>
              <th className="px-8 py-4 border-r border-slate-200 dark:border-slate-800 text-center">Daily</th>
              <th className="px-8 py-4 border-r border-slate-200 dark:border-slate-800 text-center">Stay</th>
              <th className="px-8 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-slate-100 dark:divide-slate-800">
            {processedTaxes.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="w-10 h-10 opacity-20" />
                    <p className="font-medium uppercase tracking-widest text-[10px]">No tax masters defined</p>
                  </div>
                </td>
              </tr>
            ) : (
              processedTaxes.map((tax, idx) => (
                <tr key={tax.id} className="group hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all h-14">
                  <td className="px-8 py-2 text-center font-bold text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 font-mono text-[11px] border-r border-slate-100 dark:border-slate-800">
                    {idx + 1}
                  </td>
                  <td className="px-8 py-2 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                    {tax.taxMasterName}
                  </td>
                  <td className="px-8 py-2 border-r border-slate-100 dark:border-slate-800 text-slate-500 uppercase text-[11px] font-bold">
                    {tax.taxTypeEnum?.replace('_', ' ') || 'STANDARD'}
                  </td>
                  <td className="px-8 py-2 border-r border-slate-100 dark:border-slate-800 text-center">
                    <div className="flex justify-center">
                      {tax.perDayTax ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-200 dark:text-slate-700" />}
                    </div>
                  </td>
                  <td className="px-8 py-2 border-r border-slate-100 dark:border-slate-800 text-center">
                    <div className="flex justify-center">
                      {tax.perStayTax ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-200 dark:text-slate-700" />}
                    </div>
                  </td>
                  <td className="px-8 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onEdit(tax)}
                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors" title="Edit Tax"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tax)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors" title="Delete Tax"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="relative z-10 bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Delete Tax Master</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button onClick={handleCancelDelete} className="ml-auto p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete tax master{' '}
              <span className="font-bold text-red-500">"{deleteTarget.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-2 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TaxManagement);
