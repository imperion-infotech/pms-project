import React from 'react';
import { LayoutDashboard, X } from 'lucide-react';

export const RoomTypeModal = ({ isRoomTypeModalOpen, setIsRoomTypeModalOpen, newRoomType, setNewRoomType, handleAddRoomType, roomTypes = [] }) => {
  if (!isRoomTypeModalOpen) return null;

  const isDuplicate = roomTypes.some(rt => String(rt.roomTypeName).toLowerCase() === String(newRoomType.roomTypeName).toLowerCase());

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleAddRoomType(e);
  };
  if (!isRoomTypeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsRoomTypeModalOpen(false)}
      ></div>
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-[#1e293b] dark:bg-[#1e293b] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg">New Room Type</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Add Room Type</p>
            </div>
          </div>
          <button onClick={() => setIsRoomTypeModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
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
              value={newRoomType.shortName}
              onChange={(e) => setNewRoomType({ ...newRoomType, shortName: e.target.value })}
              placeholder="Short Name"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          {/* Room Type Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Room Type Name</label>
            <input
              required
              type="text"
              value={newRoomType.roomTypeName}
              onChange={(e) => setNewRoomType({ ...newRoomType, roomTypeName: e.target.value })}
              placeholder="Room Type Name"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
            />
            {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Room Type Name already exists!</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRoomTypeModalOpen(false)}
              className="flex-1 py-2.5 text-sm font-bold text-slate-500 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newRoomType.roomTypeName}
              className={`flex-[2] py-2.5 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${isDuplicate || !newRoomType.roomTypeName ? 'bg-slate-400 cursor-not-allowed shadow-none opacity-70' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10 active:scale-95'}`}
            >
              {isDuplicate ? 'TYPE EXISTS' : 'SAVE ROOM TYPE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
