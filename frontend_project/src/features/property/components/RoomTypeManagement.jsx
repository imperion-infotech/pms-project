// "Property" feature ke components - RoomTypeManagement
import { PlusCircle, Search, CheckSquare, X, Plus, Pencil, Trash2 } from 'lucide-react';

const RoomTypeManagement = ({ roomTypes, setIsRoomTypeModalOpen }) => {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Room Type Action Bar */}
      <div className="p-6 flex flex-col lg:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a2b4b] dark:text-slate-100 font-heading tracking-tight">Room Types</h2>
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
            <tr className="bg-[#f8fafc] dark:bg-slate-800/50 text-[#64748b] dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-4 text-center border-r border-slate-200 dark:border-slate-800 w-20">ID</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-32">Short Name</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-48">Room Type Name</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-44">Room Type Color</th>
              <th className="px-4 py-4 text-center border-r border-slate-200 dark:border-slate-800 w-32">Over Booking</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-44">Bind With RT</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800">Description</th>
              <th className="px-4 py-4 text-center w-32">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-slate-100 dark:divide-slate-800">
            {roomTypes.map((room) => (
              <tr key={room.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all h-16 group">
                <td className="px-4 py-3 text-center border-r border-slate-100 dark:border-slate-800 font-bold text-slate-400 dark:text-slate-600 font-mono text-xs">{room.id}</td>
                <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400">{room.shortName}</td>
                <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 font-extrabold text-slate-800 dark:text-slate-200">{room.name}</td>
                <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div
                      className="w-8 h-5 rounded shadow-sm border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: room.color?.startsWith('#u') ? '#fff' : room.color }}
                    ></div>
                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 tracking-tighter">{room.color}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center border-r border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">{room.overBooking}</td>
                <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">{room.bindWith || "N/A"}</td>
                <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 italic text-xs leading-relaxed truncate max-w-[200px]">{room.description || "No info provided"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <button className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors" title="Delete">
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
