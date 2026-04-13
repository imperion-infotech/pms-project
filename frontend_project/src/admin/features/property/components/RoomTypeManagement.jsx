import React from 'react'
import { PlusCircle, Pencil, Trash2, AlertTriangle, X, LayoutDashboard } from 'lucide-react'
import useRoomTypeController from '../controllers/useRoomTypeController'

/**
 * View: RoomTypeManagement
 * Visual representation of room types with premium glass card UI and MVC controller.
 */
const RoomTypeManagement = ({
  roomTypes,
  setIsRoomTypeModalOpen,
  onEdit,
  onDelete,
  userRole,
  currentPage = 1,
  itemsPerPage = 8,
}) => {
  const {
    processedRoomTypes,
    getIndex,
    isAdmin,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useRoomTypeController({ roomTypes, onDelete, userRole, currentPage, itemsPerPage })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
      {/* Header & Action Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm transition-all hover:scale-110">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Room Type Management
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Manage and organize property room categories
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsRoomTypeModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New Category</span>
          </button>
        )}
      </div>

      {/* Main Table Layer */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-2xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:shadow-slate-300/50 dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  No.
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Category Name
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Per Day
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {processedRoomTypes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/20">
                        <LayoutDashboard className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">No categories defined</p>
                      {isAdmin && (
                        <button
                          onClick={() => setIsRoomTypeModalOpen(true)}
                          className="text-xs font-bold text-emerald-500 hover:underline"
                        >
                          Add your first category
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                processedRoomTypes.map((room, index) => (
                  <tr
                    key={room.id ?? index}
                    className="group transition-all hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10"
                  >
                    <td className="px-6 py-5 text-center font-mono text-xs font-bold text-slate-300 group-hover:text-emerald-500 dark:text-slate-600">
                      {getIndex(index)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {room.shortName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <LayoutDashboard className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {room.roomTypeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {room.price || '0.00'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => onEdit(room)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-emerald-200 hover:text-emerald-500 hover:shadow-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900 dark:hover:shadow-none"
                          title="Edit Category"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(room)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-red-200 hover:text-red-500 hover:shadow-red-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900 dark:hover:shadow-none"
                          title="Delete Category"
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
          <div className="animate-in zoom-in-95 relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-red-100 bg-white p-6 shadow-2xl transition-all dark:border-red-900/30 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  Delete Category
                </h3>
                <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
                  Permanent Action
                </p>
              </div>
              <button
                onClick={handleCancelDelete}
                className="ml-auto rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="mb-8 text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">
                "{deleteTarget.name}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(RoomTypeManagement)
