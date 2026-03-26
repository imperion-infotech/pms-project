// "Property" feature ke components - RoomManagement
/**
 * RoomManagement.jsx (Admin Domain -> Features: Property)
 * 
 * Feature component handling individual Rooms. 
 * Contains the table to view room attributes (smoking, handicap, type, etc.) and binds action icons for editing.
 */
import React, { useState } from 'react';
import { PlusCircle, Search, X, Cigarette, CigaretteOff, Accessibility, Check, Minus, Ban, Pencil, Trash2, AlertTriangle } from 'lucide-react';

const RoomManagement = ({ rooms = [], roomTypes = [], floors = [], searchTerm, setSearchTerm, setIsRoomModalOpen, onEdit, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteClick = (room) => {
    setDeleteTarget({ id: room.id, name: room.roomName });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget?.id) {
      onDelete(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Room Type Action Bar */}
      <div className="p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b4b] dark:text-slate-100 font-heading tracking-tight">Rooms</h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Manage and organize physical property rooms</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-slate-200"
            />
          </div>

          <button
            onClick={() => setIsRoomModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 md:px-6 py-2.5 rounded-xl text-[11px] md:text-xs font-black tracking-wider transition-all shadow-lg shadow-emerald-500/20"
          >
            <PlusCircle className="w-5 h-5" />
            ADD NEW ROOM
          </button>
        </div>
      </div>

      {/* Room Table */}
      <div className="w-full overflow-auto custom-scrollbar max-h-[600px]">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f8fafc] dark:bg-slate-800 text-[#64748b] dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-32">Room Name</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-44">Room Type Name</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-40">Floor Name</th>
              <th className="px-4 py-4 text-center border-r border-slate-200 dark:border-slate-800 w-28 text-orange-600">Smoking</th>
              <th className="px-4 py-4 text-center border-r border-slate-200 dark:border-slate-800 w-28 text-blue-600">Handicap</th>
              <th className="px-4 py-4 text-center border-r border-slate-200 dark:border-slate-800 w-28 text-red-600">Non-room</th>
              <th className="px-4 py-4 text-center w-32">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-slate-100 dark:divide-slate-800">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-10 text-center text-slate-400 dark:text-slate-500 italic">
                  {searchTerm ? 'No rooms match your search.' : 'No rooms available. Add your first room.'}
                </td>
              </tr>
            ) : rooms.map((room) => {
              const matchedType = roomTypes.find(rt => rt.id == room.roomTypeId);
              const matchedFloor = floors.find(f => f.id == room.floorId);
              const typeName = matchedType ? matchedType.roomTypeName : 'Unknown';
              const floorName = matchedFloor ? matchedFloor.name : 'Unknown';

              return (
                <tr key={room.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all h-14 group">
                  <td className="px-6 py-2 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">{room.roomName}</td>
                  <td className="px-6 py-2 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">{typeName}</td>
                  <td className="px-6 py-2 border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-500">{floorName}</td>
                  <td className="px-4 py-2 text-center border-r border-slate-100 dark:border-slate-800 bg-orange-50/10">
                    <div className="flex justify-center transition-transform hover:scale-110">
                      {room.smoking ? <Cigarette className="w-4.5 h-4.5 text-orange-500 drop-shadow-sm" /> : <Minus className="w-3 h-3 text-slate-300 dark:text-slate-700 opacity-30" />}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center border-r border-slate-100 dark:border-slate-800 bg-blue-50/10">
                    <div className="flex justify-center transition-transform hover:scale-110">
                      {room.handicap ? <Accessibility className="w-4.5 h-4.5 text-blue-500 drop-shadow-sm" /> : <Minus className="w-3 h-3 text-slate-300 dark:text-slate-700 opacity-30" />}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center border-r border-slate-100 dark:border-slate-800 bg-red-50/10">
                    <div className="flex justify-center transition-transform hover:scale-110">
                      {room.nonRoom ? <Ban className="w-4.5 h-4.5 text-red-500 drop-shadow-sm" /> : <Minus className="w-3 h-3 text-slate-300 dark:text-slate-700 opacity-30" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onEdit(room)}
                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors" title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(room)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors" title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="relative z-10 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Delete Room</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button onClick={handleCancelDelete} className="ml-auto p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete room{' '}
              <span className="font-bold text-red-500">"{deleteTarget.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-[2] py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(RoomManagement);
