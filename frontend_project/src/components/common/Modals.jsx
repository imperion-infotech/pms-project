// Common UI elements - Saare modals ab yaha hain
import { PlusCircle, X, LayoutDashboard, DoorOpen, Cigarette, Accessibility, Ban, CheckCircle2, User, Building, Phone, Mail, MapPin, Camera, Image as ImageIcon, Pen as SignatureIcon, Loader2, Save } from 'lucide-react';

export const FloorModal = ({ isFloorModalOpen, setIsFloorModalOpen, newFloor, setNewFloor, handleAddFloor }) => {
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
        <form onSubmit={handleAddFloor} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Floor Name</label>
            <input
              autoFocus
              required
              type="text"
              value={newFloor.name}
              onChange={(e) => setNewFloor({ ...newFloor, name: e.target.value })}
              placeholder="e.g. 6th Floor"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows="3"
              value={newFloor.description}
              onChange={(e) => setNewFloor({ ...newFloor, description: e.target.value })}
              placeholder="Enter details about this floor..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner resize-none"
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
              className="flex-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              ADD FLOOR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RoomTypeModal = ({ isRoomTypeModalOpen, setIsRoomTypeModalOpen, newRoomType, setNewRoomType, handleAddRoomType }) => {
  if (!isRoomTypeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsRoomTypeModalOpen(false)}
      ></div>
      <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 transition-colors duration-300">
        <div className="p-6 bg-[#1a2b4b] dark:bg-surface-50 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg">New Room Type</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Configuration Center</p>
            </div>
          </div>
          <button
            onClick={() => setIsRoomTypeModalOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleAddRoomType} className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Short Name</label>
            <input
              required
              type="text"
              value={newRoomType.shortName}
              onChange={(e) => setNewRoomType({ ...newRoomType, shortName: e.target.value })}
              placeholder="e.g. DXL"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-slate-200 focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Full Name</label>
            <input
              required
              type="text"
              value={newRoomType.name}
              onChange={(e) => setNewRoomType({ ...newRoomType, name: e.target.value })}
              placeholder="e.g. Deluxe Room"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-slate-200 focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Color Preference</label>
            <input
              type="color"
              value={newRoomType.color}
              onChange={(e) => setNewRoomType({ ...newRoomType, color: e.target.value })}
              className="w-full h-9 p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
            />
          </div>
          <div className="col-span-1 flex items-end">
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors w-full border border-slate-100 dark:border-slate-700">
              <input
                type="checkbox"
                checked={newRoomType.allowed}
                onChange={(e) => setNewRoomType({ ...newRoomType, allowed: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">Allowed In-Occupancy</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Description</label>
            <textarea
              rows="2"
              value={newRoomType.description}
              onChange={(e) => setNewRoomType({ ...newRoomType, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-slate-200 focus:border-emerald-500 outline-none resize-none"
            ></textarea>
          </div>
          <div className="col-span-2 flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsRoomTypeModalOpen(false)}
              className="flex-1 py-2.5 text-sm font-bold text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
              DISCARD
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
            >
              SAVE ROOM TYPE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RoomModal = ({ isRoomModalOpen, setIsRoomModalOpen, newRoom, setNewRoom, handleAddRoom, roomTypes, floors }) => {
  if (!isRoomModalOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsRoomModalOpen(false)}
      ></div>
      <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 transition-colors duration-300">
        <div className="p-6 bg-[#1a2b4b] dark:bg-surface-50 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <DoorOpen className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg font-heading tracking-tight">Add New Room</h3>
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
        <form onSubmit={handleAddRoom} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Room Name</label>
              <input
                required
                type="text"
                value={newRoom.roomName}
                onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
                placeholder="e.g. 101"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Short Name</label>
              <input
                required
                type="text"
                value={newRoom.shortName}
                onChange={(e) => setNewRoom({ ...newRoom, shortName: e.target.value })}
                placeholder="e.g. 101"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Room Type</label>
              <select
                value={newRoom.roomType}
                onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
              >
                {roomTypes.map(rt => <option key={rt.shortName} value={rt.name}>{rt.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Floor</label>
              <select
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
              >
                {floors.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Room Features</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 group ${newRoom.isSmoking ? 'bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20 ring-2 ring-orange-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={newRoom.isSmoking}
                    onChange={(e) => setNewRoom({ ...newRoom, isSmoking: e.target.checked })}
                    className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Cigarette className={`w-4 h-4 ${newRoom.isSmoking ? 'text-orange-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${newRoom.isSmoking ? 'text-orange-700 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>Smoking</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Guest can smoke in room</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 group ${newRoom.isHandicap ? 'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 ring-2 ring-blue-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={newRoom.isHandicap}
                    onChange={(e) => setNewRoom({ ...newRoom, isHandicap: e.target.checked })}
                    className="w-5 h-5 accent-blue-500 rounded-md cursor-pointer transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Accessibility className={`w-4 h-4 ${newRoom.isHandicap ? 'text-blue-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${newRoom.isHandicap ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>Handicap</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Specially designed for access</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 group ${newRoom.isNonRoom ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20 ring-2 ring-red-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={newRoom.isNonRoom}
                    onChange={(e) => setNewRoom({ ...newRoom, isNonRoom: e.target.checked })}
                    className="w-5 h-5 accent-red-500 rounded-md cursor-pointer transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Ban className={`w-4 h-4 ${newRoom.isNonRoom ? 'text-red-500' : 'text-slate-400 font-bold dark:text-slate-500'}`} />
                    <span className={`text-sm font-bold ${newRoom.isNonRoom ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>Non-Room</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Internal service/utility space</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsRoomModalOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              DISCARD
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              CREATE ROOM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



