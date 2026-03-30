import { Pencil, X } from 'lucide-react';

export const FloorEditModal = ({ isOpen, setIsOpen, editFloor, setEditFloor, handleUpdateFloor, floors = [] }) => {
  if (!isOpen) return null;

  const isDuplicate = floors.some(f => String(f.name).toLowerCase() === String(editFloor.name).toLowerCase() && String(f.id) !== String(editFloor.id));

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleUpdateFloor(e);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 transition-colors duration-300">
        <div className="p-6 bg-surface-100 dark:bg-surface-100 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Pencil className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="font-bold text-lg">Edit Floor</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Update Floor Details</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Floor Name</label>
            <input
              autoFocus
              required
              type="text"
              value={editFloor.name}
              onChange={(e) => setEditFloor({ ...editFloor, name: e.target.value })}
              placeholder="e.g. 6th Floor"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Floor Name already exists!</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows="3"
              value={editFloor.description || ''}
              onChange={(e) => setEditFloor({ ...editFloor, description: e.target.value })}
              placeholder="Enter details about this floor..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner resize-none"
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !editFloor.name}
              className={`flex-2 py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${isDuplicate || !editFloor.name ? 'bg-slate-400 cursor-not-allowed shadow-none opacity-70' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 active:scale-95'}`}
            >
              {isDuplicate ? 'FLOOR EXISTS' : 'UPDATE FLOOR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
