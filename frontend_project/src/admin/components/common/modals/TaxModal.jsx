import React from 'react';
import { Receipt, X } from 'lucide-react';

export const TaxModal = ({ isOpen, setIsOpen, newTax, setNewTax, handleAddTax, taxes = [] }) => {
  if (!isOpen) return null;

  const isDuplicate = taxes.some(t => String(t.taxMasterName).toLowerCase() === String(newTax.taxMasterName).toLowerCase());

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleAddTax(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-[#1a2b4b] dark:bg-[#0f172a] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg">Add New Tax</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Tax Master Configuration</p>
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
              value={newTax.taxMasterName}
              onChange={(e) => setNewTax({ ...newTax, taxMasterName: e.target.value })}
              placeholder="e.g. GST 18%"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Tax Name already exists!</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Tax Type</label>
            <select
              value={newTax.taxTypeEnum}
              onChange={(e) => setNewTax({ ...newTax, taxTypeEnum: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="Occupancy_tax">Occupancy Tax</option>
              <option value="Demo_tax">Demo Tax</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${newTax.perDayTax ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={newTax.perDayTax}
                onChange={(e) => setNewTax({ ...newTax, perDayTax: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded border-slate-300"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Per Day Tax</span>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${newTax.perStayTax ? 'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={newTax.perStayTax}
                onChange={(e) => setNewTax({ ...newTax, perStayTax: e.target.checked })}
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
              disabled={isDuplicate || !newTax.taxMasterName}
              className={`flex-[2] py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${isDuplicate || !newTax.taxMasterName ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'}`}
            >
              {isDuplicate ? 'EXISTS' : 'ADD TAX'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
