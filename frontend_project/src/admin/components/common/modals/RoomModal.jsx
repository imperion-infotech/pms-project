import { DoorOpen, X, Cigarette, Accessibility, Ban } from 'lucide-react';

export const RoomModal = ({ isRoomModalOpen, setIsRoomModalOpen, newRoom, setNewRoom, handleAddRoom, roomTypes, floors, buildings = [], rooms = [] }) => {
  if (!isRoomModalOpen) return null;

  const isDuplicate = rooms.some(r => String(r.roomName) === String(newRoom.roomName));

  const onSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) return;
    handleAddRoom(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsRoomModalOpen(false)}
      ></div>
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 transition-colors duration-300 flex flex-col max-h-[90vh]">
        <div className="p-5 sm:p-6 bg-[#1e293b] dark:bg-[#1e293b] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <DoorOpen className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg font-heading tracking-tight leading-tight">Add New Room</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Physical Property Mapping</p>
            </div>
          </div>
          <button
            onClick={() => setIsRoomModalOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Building</label>
              <select
                required
                value={newRoom.buildingId}
                onChange={(e) => setNewRoom({ ...newRoom, buildingId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
              >
                <option value="" disabled>Select Building</option>
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Floor</label>
              <select
                required
                value={newRoom.floorId}
                onChange={(e) => setNewRoom({ ...newRoom, floorId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
              >
                <option value="" disabled>Select Floor</option>
                {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${newRoom.nonRoom ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>Room Type</label>
              <select
                required={!newRoom.nonRoom}
                disabled={newRoom.nonRoom}
                value={newRoom.roomTypeId || ''}
                onChange={(e) => setNewRoom({ ...newRoom, roomTypeId: e.target.value })}
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none ${newRoom.nonRoom ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
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
                value={newRoom.roomName}
                onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
                placeholder="e.g. 101"
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${isDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'} rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all`}
              />
              {isDuplicate && <p className="text-red-500 text-[10px] sm:text-xs mt-1.5 font-bold animate-in slide-in-from-top-1">Room Name already exists!</p>}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Room Features</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl transition-all border-2 group ${newRoom.smoking ? 'bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20 ring-2 ring-orange-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'} ${newRoom.nonRoom ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale' : 'cursor-pointer'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    disabled={newRoom.nonRoom}
                    checked={newRoom.smoking}
                    onChange={(e) => setNewRoom({ ...newRoom, smoking: e.target.checked })}
                    className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer transition-transform group-active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Cigarette className={`w-4 h-4 ${newRoom.smoking ? 'text-orange-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${newRoom.smoking ? 'text-orange-700 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>Smoking</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Guest can smoke in room</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl transition-all border-2 group ${newRoom.handicap ? 'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 ring-2 ring-blue-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'} ${newRoom.nonRoom ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale' : 'cursor-pointer'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    disabled={newRoom.nonRoom}
                    checked={newRoom.handicap}
                    onChange={(e) => setNewRoom({ ...newRoom, handicap: e.target.checked })}
                    className="w-5 h-5 accent-blue-500 rounded-md cursor-pointer transition-transform group-active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Accessibility className={`w-4 h-4 ${newRoom.handicap ? 'text-blue-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${newRoom.handicap ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>Handicap</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Specially designed for access</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 group ${newRoom.nonRoom ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20 ring-2 ring-red-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'} sm:col-span-2`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={newRoom.nonRoom}
                    onChange={(e) => {
                      const isNonRoom = e.target.checked;
                      setNewRoom({
                        ...newRoom,
                        nonRoom: isNonRoom,
                        ...(isNonRoom ? { smoking: false, handicap: false, roomTypeId: '' } : {})
                      });
                    }}
                    className="w-5 h-5 accent-red-500 rounded-md cursor-pointer transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Ban className={`w-4 h-4 ${newRoom.nonRoom ? 'text-red-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${newRoom.nonRoom ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>Non-Room</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Internal service/utility space</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsRoomModalOpen(false)}
              className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors order-2 sm:order-1"
            >
              DISCARD
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newRoom.roomName}
              className={`flex-1 py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all order-1 sm:order-2 ${isDuplicate || !newRoom.roomName ? 'bg-slate-400 cursor-not-allowed shadow-none opacity-70' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'}`}
            >
              {isDuplicate ? 'ROOM EXISTS' : 'CREATE ROOM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
