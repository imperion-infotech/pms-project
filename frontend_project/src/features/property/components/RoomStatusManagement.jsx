// RoomStatusManagement.jsx
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

const RoomStatusManagement = ({ roomStatuses = [], setIsRoomStatusModalOpen, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b4b] dark:text-slate-100 font-heading tracking-tight">Room Status Management</h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Configure room availability and state labels</p>
        </div>
        <button
          onClick={() => setIsRoomStatusModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          ADD STATUS
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] border-b border-slate-200 dark:border-slate-800">
              <th className="px-8 py-4 w-20 text-center border-r border-slate-100 dark:border-slate-800">No.</th>
              <th className="px-8 py-4 border-r border-slate-100 dark:border-slate-800">Status Name</th>
              <th className="px-8 py-4 border-r border-slate-100 dark:border-slate-800">Title</th>
              <th className="px-8 py-4 border-r border-slate-100 dark:border-slate-800">Color</th>
              <th className="px-8 py-4 w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
            {roomStatuses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic text-xs">
                  No room statuses found. Add one using the button above.
                </td>
              </tr>
            ) : (
              roomStatuses.map((status, idx) => (
                <tr key={status.id || idx} className="group hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all duration-200">
                  <td className="px-8 py-5 text-center font-bold text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 font-mono text-xs border-r border-slate-50 dark:border-slate-800/50">{idx + 1}</td>
                  <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-50 dark:border-slate-800/50">
                    {status.roomStatusName || status.name || '—'}
                  </td>
                  <td className="px-8 py-5 text-slate-500 dark:text-slate-400 border-r border-slate-50 dark:border-slate-800/50">
                    {status.roomStatusTitle || status.title || '—'}
                  </td>
                  <td className="px-8 py-5 border-r border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-5 rounded shadow-sm border border-slate-300 dark:border-slate-600"
                        style={{ backgroundColor: status.roomStatusColor || status.color || '#ccc' }}
                      />
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        {status.roomStatusColor || status.color || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit && onEdit(status)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(status.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomStatusManagement;
