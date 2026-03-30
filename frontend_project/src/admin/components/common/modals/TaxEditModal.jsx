import React from 'react';
import { Receipt, X, Save } from 'lucide-react';

export const TaxEditModal = ({ isOpen, setIsOpen, editTax, setEditTax, handleUpdateTax, taxes = [] }) => {
  if (!isOpen) return null;

  const isDuplicate = taxes.some(t =>
    t.id !== editTax.id &&
    String(t.taxMasterName).toLowerCase() === String(editTax.taxMasterName).toLowerCase()
  );

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleUpdateTax(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-blue-600 dark:bg-blue-900 text-white flex justify-between items-center transition-colors">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-blue-200" />
            <div>
              <h3 className="font-bold text-lg">Update Tax Master</h3>
              <p className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">Edit Configuration ID: {editTax.id}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Tax Name</label>
            <input
              required
              autoFocus
              type="text"
              value={editTax.taxMasterName}
              onChange={(e) => setEditTax({ ...editTax, taxMasterName: e.target.value })}
              placeholder="e.g. GST 18%"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Other Tax name already exists!</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Tax Type</label>
            <select
              value={editTax.taxTypeEnum}
              onChange={(e) => setEditTax({ ...editTax, taxTypeEnum: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="Occupancy_tax">Occupancy Tax</option>
              <option value="Demo_tax">Demo Tax</option>

            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${editTax.perDayTax ? 'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={editTax.perDayTax}
                onChange={(e) => setEditTax({ ...editTax, perDayTax: e.target.checked })}
                className="w-4 h-4 accent-blue-500 rounded border-slate-300"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Per Day Tax</span>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${editTax.perStayTax ? 'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={editTax.perStayTax}
                onChange={(e) => setEditTax({ ...editTax, perStayTax: e.target.checked })}
                className="w-4 h-4 accent-blue-500 rounded border-slate-300"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Per Stay Tax</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !editTax.taxMasterName}
              className={`flex-[2] flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed`}
            >
              <Save className="w-4 h-4" />
              {isDuplicate ? 'EXISTS' : 'UPDATE TAX'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
