import { PlusCircle, X } from 'lucide-react';

export const FloorModal = ({ isFloorModalOpen, setIsFloorModalOpen, newFloor, setNewFloor, handleAddFloor, floors = [] }) => {
  if (!isFloorModalOpen) return null;

  const isDuplicate = floors.some(f => String(f.name).toLowerCase() === String(newFloor.name).toLowerCase());

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleAddFloor(e);
  };
  if (!isFloorModalOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsFloorModalOpen(false)}
      ></div>
      <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 transition-colors duration-300">
        <div className="p-6 bg-surface-100 dark:bg-surface-50 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg">Add New Floor</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Master Data Entry</p>
            </div>
          </div>
          <button
            onClick={() => setIsFloorModalOpen(false)}
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
              value={newFloor.name}
              onChange={(e) => setNewFloor({ ...newFloor, name: e.target.value })}
              placeholder="Floor Name"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Floor Name already exists!</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows="3"
              value={newFloor.description}
              onChange={(e) => setNewFloor({ ...newFloor, description: e.target.value })}
              placeholder="Floor Description"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner resize-none"
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFloorModalOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newFloor.name}
              className={`flex-2 py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${isDuplicate || !newFloor.name ? 'bg-slate-400 cursor-not-allowed shadow-none opacity-70' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'}`}
            >
              {isDuplicate ? 'FLOOR EXISTS' : 'ADD FLOOR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
