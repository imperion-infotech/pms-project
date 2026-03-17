// "Property" feature ke components - RoomManagement
import React from 'react';
import { PlusCircle, Search, X, Cigarette, CigaretteOff, Accessibility, Check, Minus, Ban, Pencil, Trash2 } from 'lucide-react';

const RoomManagement = ({ rooms, setIsRoomModalOpen }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {/* Room Type Action Bar */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b4b] font-heading tracking-tight">Rooms</h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Manage and organize physical property rooms</p>
        </div>
        <button
          onClick={() => setIsRoomModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-emerald-500/10"
        >
          <PlusCircle className="w-5 h-5" />
          ADD NEW ROOM
        </button>
      </div>

      {/* Room Table */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead>
            <tr className="bg-[#f8fafc] text-[#64748b] text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-4 border-r border-slate-200 w-32">Room Name</th>
              <th className="px-6 py-4 border-r border-slate-200 w-32">Short Name</th>
              <th className="px-6 py-4 border-r border-slate-200 w-44">Room Type Name</th>
              <th className="px-6 py-4 border-r border-slate-200 w-40">Building Name</th>
              <th className="px-6 py-4 border-r border-slate-200 w-40">Floor Name</th>
              <th className="px-4 py-4 text-center border-r border-slate-200 w-28 text-orange-600">Smoking</th>
              <th className="px-4 py-4 text-center border-r border-slate-200 w-28 text-blue-600">Handicap</th>
              <th className="px-4 py-4 text-center border-r border-slate-200 w-28 text-red-600">Non-room</th>
              <th className="px-4 py-4 text-center w-32">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-slate-100">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-emerald-50/40 transition-all h-14 group">
                <td className="px-6 py-2 border-r border-slate-100 font-bold text-slate-800">{room.roomName}</td>
                <td className="px-6 py-2 border-r border-slate-100 font-medium text-slate-500 font-mono text-xs">{room.shortName}</td>
                <td className="px-6 py-2 border-r border-slate-100 text-slate-600">{room.roomTypeName}</td>
                <td className="px-6 py-2 border-r border-slate-100 text-slate-500">{room.buildingName}</td>
                <td className="px-6 py-2 border-r border-slate-100 text-slate-500">{room.floorName}</td>
                <td className="px-4 py-2 text-center border-r border-slate-100 bg-orange-50/10">
                  <div className="flex justify-center transition-transform hover:scale-110">
                    {room.smoking ? <Cigarette className="w-4.5 h-4.5 text-orange-500 drop-shadow-sm" /> : <Minus className="w-3 h-3 text-slate-300 opacity-30" />}
                  </div>
                </td>
                <td className="px-4 py-2 text-center border-r border-slate-100 bg-blue-50/10">
                  <div className="flex justify-center transition-transform hover:scale-110">
                    {room.handicap ? <Accessibility className="w-4.5 h-4.5 text-blue-500 drop-shadow-sm" /> : <Minus className="w-3 h-3 text-slate-300 opacity-30" />}
                  </div>
                </td>
                <td className="px-4 py-2 text-center border-r border-slate-100 bg-red-50/10">
                  <div className="flex justify-center transition-transform hover:scale-110">
                    {room.isNonRoom ? <Ban className="w-4.5 h-4.5 text-red-500 drop-shadow-sm" /> : <Minus className="w-3 h-3 text-slate-300 opacity-30" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomManagement;
