import React from 'react';
import { PencilLine, X, FileText, CheckCircle2 } from 'lucide-react';

export const DocumentTypeEditModal = ({ 
  isOpen, 
  setIsOpen, 
  editDocType, 
  setEditDocType, 
  handleUpdate, 
  documentTypes = [] 
}) => {
  if (!isOpen) return null;

  const isDuplicate = documentTypes.some(
    d => String(d.documentTypeName).toLowerCase() === String(editDocType.documentTypeName).toLowerCase() && d.id !== editDocType.id
  );

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleUpdate(e);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="bg-white dark:bg-surface-100 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200/50 dark:border-slate-800/50">
        <div className="p-6 bg-slate-900 dark:bg-black text-white flex justify-between items-center relative overflow-hidden">
             <div className="absolute -bottom-8 -right-8 p-4 opacity-5 pointer-events-none">
                <PencilLine className="w-32 h-32" />
             </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-orange-600 rounded-xl">
               <PencilLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl tracking-tight">Edit Document Type</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Update Configuration</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10 active:scale-90"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Short Name</label>
                <input
                required
                type="text"
                value={editDocType.documentTypeShortName}
                onChange={(e) => setEditDocType({ ...editDocType, documentTypeShortName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
                />
            </div>
            <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Category</label>
                <select
                value={editDocType.documentTypeCategory}
                onChange={(e) => setEditDocType({ ...editDocType, documentTypeCategory: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium appearance-none"
                >
                    <option value="">Select Category</option>
                    <option value="ID Proof">ID Proof</option>
                    <option value="Address Proof">Address Proof</option>
                    <option value="Visa/Passport">Visa/Passport</option>
                    <option value="Other">Other</option>
                </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Document Name</label>
            <input
              required
              type="text"
              value={editDocType.documentTypeName}
              onChange={(e) => setEditDocType({ ...editDocType, documentTypeName: e.target.value })}
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/20 border ${isDuplicate ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-slate-800'} text-slate-800 dark:text-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] mt-2 font-bold flex items-center gap-1"><X className="w-3 h-3" /> This document name already exists!</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
            <textarea
              rows="3"
              value={editDocType.documentTypeDescription}
              onChange={(e) => setEditDocType({ ...editDocType, documentTypeDescription: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg transition-colors ${editDocType.documentTypeDefault ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Set as Default</h4>
                    <p className="text-[10px] text-slate-400">Mark this as the primary document type</p>
                 </div>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={editDocType.documentTypeDefault}
                  onChange={(e) => setEditDocType({ ...editDocType, documentTypeDefault: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-xs font-extrabold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors tracking-widest"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !editDocType.documentTypeName || !editDocType.documentTypeShortName}
              className={`flex-2 py-3.5 text-white rounded-2xl text-xs font-extrabold shadow-xl transition-all tracking-widest active:scale-95 ${isDuplicate || !editDocType.documentTypeName || !editDocType.documentTypeShortName ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none grayscale' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/30'}`}
            >
              {isDuplicate ? 'DOC EXISTS' : 'UPDATE DOCUMENT TYPE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
