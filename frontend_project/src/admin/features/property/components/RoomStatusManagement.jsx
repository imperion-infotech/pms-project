import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusCircle,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
  Workflow,
  Calendar,
  Palette,
  Type,
} from 'lucide-react'
import useRoomStatusController from '../controllers/useRoomStatusController'

/**
 * View: RoomStatusManagement
 * Custom status management for room workflows using MVC architecture.
 */
const RoomStatusManagement = ({ roomStatuses, setIsRoomStatusModalOpen, onEdit, onDelete }) => {
  const {
    processedStatuses,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useRoomStatusController({
    roomStatuses,
    onDelete,
  })

  return (
    <div className="dark:bg-surface-100 rounded-xl border border-slate-200 bg-white shadow-md transition-colors duration-300 dark:border-slate-800">
      {/* Room Status Action Bar */}
      <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:p-6 dark:border-slate-800">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-lg font-bold tracking-tight text-[#1a2b4b] md:text-xl dark:text-slate-100">
            Room Status Management
          </h2>
          <p className="text-xs font-medium text-slate-400 md:text-sm">
            Manage and configure room operational states
          </p>
        </div>

        <button
          onClick={() => setIsRoomStatusModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-[11px] font-black tracking-wider text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95 sm:w-auto md:px-6 md:text-xs"
        >
          <PlusCircle className="h-5 w-5" />
          ADD NEW STATUS
        </button>
      </div>

      {/* Room Status Table */}
      <div className="custom-scrollbar max-h-[600px] w-full overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-200 bg-[#f8fafc] text-[11px] font-bold tracking-wider text-[#64748b] uppercase dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
              <th className="w-24 border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                No.
              </th>
              <th className="border-r border-slate-200 px-8 py-4 dark:border-slate-800">
                Status Name
              </th>
              <th className="border-r border-slate-200 px-8 py-4 dark:border-slate-800">
                Display Label
              </th>
              <th className="border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                BG Color
              </th>
              <th className="border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                Text Color
              </th>
              <th className="px-8 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-800">
            {processedStatuses.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-8 py-20 text-center text-slate-400 dark:text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="h-10 w-10 opacity-20" />
                    <p className="text-[10px] font-medium tracking-widest uppercase">
                      No statuses defined
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              processedStatuses.map((status, idx) => (
                <tr
                  key={status.id}
                  className="group h-14 transition-all hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5"
                >
                  <td className="border-r border-slate-100 px-8 py-2 text-center font-mono text-[11px] font-bold text-slate-300 group-hover:text-emerald-500 dark:border-slate-800 dark:text-slate-600">
                    {idx + 1}
                  </td>
                  <td className="border-r border-slate-100 px-8 py-2 font-bold tracking-tighter text-slate-800 uppercase dark:border-slate-800 dark:text-slate-200">
                    {status.roomStatusName}
                  </td>
                  <td className="border-r border-slate-100 px-8 py-2 dark:border-slate-800">
                    <span
                      className="rounded-lg border border-slate-100 px-3 py-1 text-xs font-bold tracking-wide shadow-sm dark:border-slate-700"
                      style={{
                        backgroundColor: status.roomStatusColor || '#e2e8f0',
                        color: status.roomStatusTextColor || '#1e293b',
                      }}
                    >
                      {status.roomStatusTitle || 'Untitled State'}
                    </span>
                  </td>
                  <td className="border-r border-slate-100 px-8 py-2 text-center dark:border-slate-800">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 dark:border-slate-700 dark:bg-slate-800">
                      <div
                        className="h-3 w-3 rounded-full shadow-sm"
                        style={{ backgroundColor: status.roomStatusColor }}
                      />
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                        {status.roomStatusColor || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-slate-100 px-8 py-2 text-center dark:border-slate-800">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 dark:border-slate-700 dark:bg-slate-800">
                      <div
                        className="h-3 w-3 rounded-full shadow-sm"
                        style={{ backgroundColor: status.roomStatusTextColor }}
                      />
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                        {status.roomStatusTextColor || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onEdit(status)}
                        className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        title="Edit Status"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(status)}
                        className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                        title="Delete Status"
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

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
          <div className="dark:bg-surface-100 relative z-10 w-full max-w-sm rounded-2xl border border-red-100 bg-white p-6 shadow-2xl dark:border-red-900/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Delete Status
                </h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button
                onClick={handleCancelDelete}
                className="ml-auto rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete status{' '}
              <span className="font-bold text-red-500">"{deleteTarget.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-2 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(RoomStatusManagement)
