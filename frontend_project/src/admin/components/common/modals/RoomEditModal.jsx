import { Pencil, X, Cigarette, Accessibility, Ban } from 'lucide-react';

export const RoomEditModal = ({ isOpen, setIsOpen, editRoom, setEditRoom, handleUpdateRoom, roomTypes, floors, rooms = [] }) => {
  if (!isOpen) return null;

  const isDuplicate = rooms.some(r => String(r.roomName) === String(editRoom.roomName) && r.id !== editRoom.id);

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleUpdateRoom(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 transition-colors duration-300">
        <div className="p-6 bg-[#1e293b] dark:bg-[#1e293b] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Pencil className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="font-bold text-lg font-heading tracking-tight">Edit Room</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Update Property Mapping</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Floor</label>
              <select
                required
                value={editRoom.floorId}
                onChange={(e) => setEditRoom({ ...editRoom, floorId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="" disabled>Select Floor</option>
                {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Room Type</label>
              <select
                required={!editRoom.nonRoom}
                disabled={editRoom.nonRoom}
                value={editRoom.roomTypeId}
                onChange={(e) => setEditRoom({ ...editRoom, roomTypeId: e.target.value })}
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none ${editRoom.nonRoom ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              >
                <option value="" disabled>Select Room Type</option>
                {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.roomTypeName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Room Name</label>
              <input
                required
                type="text"
                value={editRoom.roomName}
                onChange={(e) => setEditRoom({ ...editRoom, roomName: e.target.value })}
                placeholder="e.g. 101"
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all`}
              />
              {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Room Name already exists!</p>}
            </div>


          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Room Features</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl transition-all border-2 group ${editRoom.smoking ? 'bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20 ring-2 ring-orange-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'} ${editRoom.nonRoom ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale' : 'cursor-pointer'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    disabled={editRoom.nonRoom}
                    checked={editRoom.smoking}
                    onChange={(e) => setEditRoom({ ...editRoom, smoking: e.target.checked })}
                    className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer transition-transform group-active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Cigarette className={`w-4 h-4 ${editRoom.smoking ? 'text-orange-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${editRoom.smoking ? 'text-orange-700 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>Smoking</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Guest can smoke in room</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl transition-all border-2 group ${editRoom.handicap ? 'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 ring-2 ring-blue-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'} ${editRoom.nonRoom ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale' : 'cursor-pointer'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    disabled={editRoom.nonRoom}
                    checked={editRoom.handicap}
                    onChange={(e) => setEditRoom({ ...editRoom, handicap: e.target.checked })}
                    className="w-5 h-5 accent-blue-500 rounded-md cursor-pointer transition-transform group-active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Accessibility className={`w-4 h-4 ${editRoom.handicap ? 'text-blue-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${editRoom.handicap ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>Handicap</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Specially designed for access</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 group ${editRoom.nonRoom ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20 ring-2 ring-red-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={editRoom.nonRoom}
                    onChange={(e) => {
                      const isNonRoom = e.target.checked;
                      setEditRoom({
                        ...editRoom,
                        nonRoom: isNonRoom,
                        ...(isNonRoom ? { smoking: false, handicap: false, roomTypeId: '' } : {})
                      });
                    }}
                    className="w-5 h-5 accent-red-500 rounded-md cursor-pointer transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Ban className={`w-4 h-4 ${editRoom.nonRoom ? 'text-red-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${editRoom.nonRoom ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>Non-Room</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Internal service/utility space</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              DISCARD
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !editRoom.roomName}
              className={`flex-[2] py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${isDuplicate || !editRoom.roomName ? 'bg-slate-400 cursor-not-allowed shadow-none opacity-70' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 active:scale-95'}`}
            >
              {isDuplicate ? 'ROOM EXISTS' : 'UPDATE ROOM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
