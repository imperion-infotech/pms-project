import { LayoutDashboard, X } from 'lucide-react';

export const RoomTypeEditModal = ({ isOpen, setIsOpen, editRoomType, setEditRoomType, handleUpdateRoomType, roomTypes = [] }) => {
  if (!isOpen) return null;

  const isDuplicate = roomTypes.some(rt => String(rt.roomTypeName).toLowerCase() === String(editRoomType.roomTypeName).toLowerCase() && rt.id !== editRoomType.id);

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleUpdateRoomType(e);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-surface-100 dark:bg-surface-100 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="font-bold text-lg">Edit Room Type</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Update Room Type Details</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 flex flex-col gap-4">
          {/* Short Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Short Name</label>
            <input
              required
              type="text"
              value={editRoomType.shortName || ''}
              onChange={(e) => setEditRoomType({ ...editRoomType, shortName: e.target.value })}
              placeholder="e.g. DXL"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          {/* Room Type Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Room Type Name</label>
            <input
              required
              type="text"
              value={editRoomType.roomTypeName || ''}
              onChange={(e) => setEditRoomType({ ...editRoomType, roomTypeName: e.target.value })}
              placeholder="e.g. Deluxe Room"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Room Type Name already exists!</p>}
          </div>
          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Base Price (Per Night)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={editRoomType.price || ''}
                onChange={(e) => setEditRoomType({ ...editRoomType, price: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-sm font-bold text-slate-500 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !editRoomType.roomTypeName}
              className={`flex-2 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${isDuplicate || !editRoomType.roomTypeName ? 'bg-slate-400 cursor-not-allowed shadow-none opacity-70' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/10 active:scale-95'}`}
            >
              {isDuplicate ? 'TYPE EXISTS' : 'UPDATE ROOM TYPE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
