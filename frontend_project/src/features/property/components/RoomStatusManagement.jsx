// RoomStatusManagement.jsx
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'

const RoomStatusManagement = ({
  roomStatuses = [],
  setIsRoomStatusModalOpen,
  onEdit,
  onDelete,
  currentPage = 1,
  itemsPerPage = 8,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-colors duration-300 dark:border-slate-800 dark:bg-surface-100">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:p-6 dark:border-slate-800">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-lg font-bold tracking-tight text-[#1a2b4b] md:text-xl dark:text-slate-100">
            Room Status Management
          </h2>
          <p className="text-xs font-medium text-slate-400 md:text-sm">
            Configure room availability and state labels
          </p>
        </div>
        <button
          onClick={() => setIsRoomStatusModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95 sm:w-auto md:px-6 md:py-2.5 md:text-sm"
        >
          <PlusCircle className="h-5 w-5" />
          ADD STATUS
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <th className="w-20 border-r border-slate-100 px-8 py-4 text-center dark:border-slate-800">
                No.
              </th>
              <th className="border-r border-slate-100 px-8 py-4 dark:border-slate-800">
                Status Name
              </th>
              <th className="border-r border-slate-100 px-8 py-4 dark:border-slate-800">Title</th>
              <th className="border-r border-slate-100 px-8 py-4 dark:border-slate-800">Color</th>
              <th className="w-32 px-8 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {roomStatuses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-xs text-slate-400 italic">
                  No room statuses found. Add one using the button above.
                </td>
              </tr>
            ) : (
              roomStatuses.map((status, idx) => (
                <tr
                  key={status.id || idx}
                  className="group transition-all duration-200 hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5"
                >
                  <td className="border-r border-slate-50 px-8 py-5 text-center font-mono text-xs font-bold text-slate-300 group-hover:text-emerald-500 dark:border-slate-800/50 dark:text-slate-600">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="border-r border-slate-50 px-8 py-5 font-bold text-slate-700 dark:border-slate-800/50 dark:text-slate-300">
                    {status.roomStatusName || status.name || '—'}
                  </td>
                  <td className="border-r border-slate-50 px-8 py-5 text-slate-500 dark:border-slate-800/50 dark:text-slate-400">
                    {status.roomStatusTitle || status.title || '—'}
                  </td>
                  <td className="border-r border-slate-50 px-8 py-5 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-5 w-8 rounded border border-slate-300 shadow-sm dark:border-slate-600"
                        style={{
                          backgroundColor: status.roomStatusColor || status.color || '#ccc',
                        }}
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
                        className="rounded-lg p-2 text-blue-500 transition-all hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(status.id)}
                        className="rounded-lg p-2 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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
  )
}

export default RoomStatusManagement
