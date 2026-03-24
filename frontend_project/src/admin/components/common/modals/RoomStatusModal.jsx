import { LayoutDashboard, X } from 'lucide-react';

export const RoomStatusModal = ({ isOpen, setIsOpen, newRoomStatus, setNewRoomStatus, handleAddRoomStatus, roomStatuses = [] }) => {
  if (!isOpen) return null;

  const isDuplicate = roomStatuses.some(rs => String(rs.roomStatusName).toLowerCase() === String(newRoomStatus.roomStatusName).toLowerCase());

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleAddRoomStatus(e);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-[#1e293b] dark:bg-[#1e293b] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg">New Room Status</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Add Status Workflows</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Status Name</label>
            <input
              required
              type="text"
              value={newRoomStatus.roomStatusName}
              onChange={(e) => setNewRoomStatus({ ...newRoomStatus, roomStatusName: e.target.value })}
              placeholder="e.g. Vacant Ready"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Status Name already exists!</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Status Title</label>
            <input
              required
              type="text"
              value={newRoomStatus.roomStatusTitle}
              onChange={(e) => setNewRoomStatus({ ...newRoomStatus, roomStatusTitle: e.target.value })}
              placeholder="e.g. V/Ready"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Status Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newRoomStatus.roomStatusColor}
                onChange={(e) => setNewRoomStatus({ ...newRoomStatus, roomStatusColor: e.target.value })}
                className="w-12 h-10 p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={newRoomStatus.roomStatusColor}
                onChange={(e) => setNewRoomStatus({ ...newRoomStatus, roomStatusColor: e.target.value })}
                placeholder="#000000"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
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
              disabled={isDuplicate || !newRoomStatus.roomStatusName}
              className={`flex-[2] py-2.5 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${isDuplicate || !newRoomStatus.roomStatusName ? 'bg-slate-400 cursor-not-allowed shadow-none opacity-70' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10 active:scale-95'}`}
            >
              {isDuplicate ? 'STATUS EXISTS' : 'SAVE STATUS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
