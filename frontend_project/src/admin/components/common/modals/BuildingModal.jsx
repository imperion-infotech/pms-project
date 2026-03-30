import { PlusCircle, X, Building } from 'lucide-react';

export const BuildingModal = ({ isBuildingModalOpen, setIsBuildingModalOpen, newBuilding, setNewBuilding, handleAddBuilding, buildings = [] }) => {
  if (!isBuildingModalOpen) return null;

  const isDuplicate = buildings.some(b => String(b.name).toLowerCase() === String(newBuilding.name).toLowerCase());

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleAddBuilding(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsBuildingModalOpen(false)}
      ></div>
      <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 transition-colors duration-300">
        <div className="p-6 bg-surface-100 dark:bg-surface-50 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg">Add New Building</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Master Data Entry</p>
            </div>
          </div>
          <button
            onClick={() => setIsBuildingModalOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Building Name</label>
            <input
              autoFocus
              required
              type="text"
              value={newBuilding.name}
              onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
              placeholder="e.g. Tower A"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Building Name already exists!</p>}

          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows="3"
              value={newBuilding.description || ''}
              onChange={(e) => setNewBuilding({ ...newBuilding, description: e.target.value })}
              placeholder="Building details (address, wing, etc.)"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner resize-none"
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsBuildingModalOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newBuilding.name}
              className={`flex-[2] py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${isDuplicate || !newBuilding.name ? 'bg-slate-400 cursor-not-allowed shadow-none opacity-70' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'}`}
            >
              {isDuplicate ? 'BUILDING EXISTS' : 'ADD BUILDING'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
