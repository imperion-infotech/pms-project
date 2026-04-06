import { LayoutDashboard, X } from 'lucide-react'

export const RoomTypeEditModal = ({
  isOpen,
  setIsOpen,
  editRoomType,
  setEditRoomType,
  handleUpdateRoomType,
  roomTypes = [],
}) => {
  if (!isOpen) return null

  const isDuplicate = roomTypes.some(
    (rt) =>
      String(rt.roomTypeName).toLowerCase() === String(editRoomType.roomTypeName).toLowerCase() &&
      rt.id !== editRoomType.id,
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleUpdateRoomType(e)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        <div className="bg-surface-100 dark:bg-surface-100 flex items-center justify-between p-6 text-white">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-blue-400" />
            <div>
              <h3 className="text-lg font-bold">Edit Room Type</h3>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                Update Room Type Details
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
          {/* Short Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
              Short Name
            </label>
            <input
              required
              type="text"
              value={editRoomType.shortName || ''}
              onChange={(e) => setEditRoomType({ ...editRoomType, shortName: e.target.value })}
              placeholder="e.g. DXL"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            />
          </div>
          {/* Room Type Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
              Room Type Name
            </label>
            <input
              required
              type="text"
              value={editRoomType.roomTypeName || ''}
              onChange={(e) => setEditRoomType({ ...editRoomType, roomTypeName: e.target.value })}
              placeholder="e.g. Deluxe Room"
              className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
            />
            {isDuplicate && (
              <p className="animate-in slide-in-from-top-1 mt-1.5 text-[10px] font-bold text-red-500 sm:text-xs">
                Room Type Name already exists!
              </p>
            )}
          </div>
          {/* Price */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
              Base Price (Per Night)
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-slate-400">
                $
              </span>
              <input
                type="number"
                value={editRoomType.price || ''}
                onChange={(e) => setEditRoomType({ ...editRoomType, price: e.target.value })}
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-8 font-mono text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
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
              disabled={isDuplicate || !editRoomType.roomTypeName}
              className={`flex-2 rounded-xl py-2.5 text-sm font-bold text-white shadow-lg transition-all ${isDuplicate || !editRoomType.roomTypeName ? 'cursor-not-allowed bg-slate-400 opacity-70 shadow-none' : 'bg-blue-500 shadow-blue-500/10 hover:bg-blue-600 active:scale-95'}`}
            >
              {isDuplicate ? 'TYPE EXISTS' : 'UPDATE ROOM TYPE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
