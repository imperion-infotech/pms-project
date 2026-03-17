// "Property" feature ke components - RoomTypeManagement
import React from 'react';
import { PlusCircle, Search, CheckSquare, X, Plus, Pencil, Trash2 } from 'lucide-react';

const RoomTypeManagement = ({ roomTypes, setIsRoomTypeModalOpen }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {/* Room Type Action Bar */}
      <div className="p-6 flex flex-col lg:flex-row justify-between items-center border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a2b4b] font-heading tracking-tight">Room Types</h2>
          <p className="text-sm text-slate-400 font-medium">Manage and categorize room configurations</p>
        </div>
        <button
          onClick={() => setIsRoomTypeModalOpen(true)}
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/10"
        >
          <PlusCircle className="w-5 h-5" />
          ADD NEW ROOM TYPE
        </button>
      </div>

      {/* Room Type Table */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-[#f8fafc] text-[#64748b] text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="px-4 py-4 text-center border-r border-slate-200 w-20">ID</th>
              <th className="px-6 py-4 border-r border-slate-200 w-32">Short Name</th>
              <th className="px-6 py-4 border-r border-slate-200 w-48">Room Type Name</th>
              <th className="px-6 py-4 border-r border-slate-200 w-44">Room Type Color</th>
              <th className="px-4 py-4 text-center border-r border-slate-200 w-32">Over Booking</th>
              <th className="px-6 py-4 border-r border-slate-200 w-44">Bind With RT</th>
              <th className="px-6 py-4 border-r border-slate-200">Description</th>
              {/* <th className="px-4 py-4 text-center border-r border-slate-200 w-44">Allowed Occupancy</th> */}
              <th className="px-4 py-4 text-center w-32">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-slate-100">
            {roomTypes.map((room) => (
              <tr key={room.id} className="hover:bg-emerald-50/40 transition-all h-16 group">
                <td className="px-4 py-3 text-center border-r border-slate-100 font-bold text-slate-400 font-mono text-xs">{room.id}</td>
                <td className="px-6 py-3 border-r border-slate-100 font-bold text-slate-600">{room.shortName}</td>
                <td className="px-6 py-3 border-r border-slate-100 font-extrabold text-slate-800">{room.name}</td>
                <td className="px-6 py-3 border-r border-slate-100">
                  <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <div
                      className="w-8 h-5 rounded shadow-sm border border-slate-300"
                      style={{ backgroundColor: room.color?.startsWith('#u') ? '#fff' : room.color }}
                    ></div>
                    <span className="font-mono text-[10px] text-slate-400 tracking-tighter">{room.color}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center border-r border-slate-100 font-bold text-slate-700">{room.overBooking}</td>
                <td className="px-6 py-3 border-r border-slate-100 text-slate-500 font-medium">{room.bindWith || "N/A"}</td>
                <td className="px-6 py-3 border-r border-slate-100 text-slate-400 italic text-xs leading-relaxed truncate max-w-[200px]">{room.description || "No info provided"}</td>
                {/* <td className="px-4 py-3 border-r border-slate-100">
                  <div className="flex justify-center">
                    {room.allowed ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                        <Plus className="w-3.5 h-3.5 text-emerald-600 rotate-45 transform" strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center opacity-50">
                        <X className="w-3.5 h-3.5 text-red-400" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </td> */}
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

export default RoomTypeManagement;
