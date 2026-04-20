import { LayoutDashboard, X } from 'lucide-react'

export const RoomStatusEditModal = ({
  isOpen,
  setIsOpen,
  editRoomStatus,
  setEditRoomStatus,
  handleUpdateRoomStatus,
  roomStatuses = [],
}) => {
  if (!isOpen) return null

  const isDuplicate = roomStatuses.some(
    (rs) =>
      String(rs.roomStatusName).toLowerCase() ===
        String(editRoomStatus.roomStatusName).toLowerCase() && rs.id !== editRoomStatus.id,
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleUpdateRoomStatus(e)
  }
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        <div className="dark:bg-surface-50 flex items-center justify-between bg-[#1a2b4b] p-6 text-white">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-blue-400" />
            <div>
              <h3 className="text-lg font-bold">Edit Room Status</h3>
              <p className="text-pms-tiny tracking-widest text-slate-400 uppercase">
                Update Status Workflows
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
              Status Name
            </label>
            <input
              required
              type="text"
              value={editRoomStatus.roomStatusName}
              onChange={(e) =>
                setEditRoomStatus({ ...editRoomStatus, roomStatusName: e.target.value })
              }
              placeholder="e.g. Vacant Ready"
              className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
            />
            {isDuplicate && (
              <p className="animate-in slide-in-from-top-1 mt-1.5 text-pms-tiny font-bold text-red-500 sm:text-xs">
                Status Name already exists!
              </p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
              Status Title
            </label>
            <input
              required
              type="text"
              value={editRoomStatus.roomStatusTitle}
              onChange={(e) =>
                setEditRoomStatus({ ...editRoomStatus, roomStatusTitle: e.target.value })
              }
              placeholder="e.g. V/Ready"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
              Status Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={editRoomStatus.roomStatusColor}
                onChange={(e) =>
                  setEditRoomStatus({ ...editRoomStatus, roomStatusColor: e.target.value })
                }
                className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/50"
              />
              <input
                type="text"
                value={editRoomStatus.roomStatusColor}
                onChange={(e) =>
                  setEditRoomStatus({ ...editRoomStatus, roomStatusColor: e.target.value })
                }
                placeholder="#000000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
              Status Text Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={editRoomStatus.roomStatusTextColor}
                onChange={(e) =>
                  setEditRoomStatus({ ...editRoomStatus, roomStatusTextColor: e.target.value })
                }
                className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/50"
              />
              <input
                type="text"
                value={editRoomStatus.roomStatusTextColor}
                onChange={(e) =>
                  setEditRoomStatus({ ...editRoomStatus, roomStatusTextColor: e.target.value })
                }
                placeholder="#ffffff"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !editRoomStatus.roomStatusName}
              className={`flex-2 rounded-xl py-2.5 text-sm font-bold text-white shadow-lg transition-all ${isDuplicate || !editRoomStatus.roomStatusName ? 'cursor-not-allowed bg-slate-400 opacity-70 shadow-none' : 'bg-blue-500 shadow-blue-500/10 hover:bg-blue-600 active:scale-95'}`}
            >
              {isDuplicate ? 'STATUS EXISTS' : 'UPDATE STATUS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
