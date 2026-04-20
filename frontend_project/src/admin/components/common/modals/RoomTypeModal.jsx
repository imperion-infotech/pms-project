import { LayoutDashboard, X } from 'lucide-react'

export const RoomTypeModal = ({
  isRoomTypeModalOpen,
  setIsRoomTypeModalOpen,
  newRoomType,
  setNewRoomType,
  handleAddRoomType,
  roomTypes = [],
}) => {
  if (!isRoomTypeModalOpen) return null

  const isDuplicate = roomTypes.some(
    (rt) =>
      String(rt.roomTypeName).toLowerCase() === String(newRoomType.roomTypeName).toLowerCase(),
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleAddRoomType(e)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsRoomTypeModalOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        <div className="bg-surface-100 dark:bg-surface-100 flex items-center justify-between p-6 text-white">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold">New Room Type</h3>
              <p className="text-pms-tiny tracking-widest text-slate-400 uppercase">Add Room Type</p>
            </div>
          </div>
          <button
            onClick={() => setIsRoomTypeModalOpen(false)}
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
              value={newRoomType.shortName}
              onChange={(e) => setNewRoomType({ ...newRoomType, shortName: e.target.value })}
              placeholder="Short Name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
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
              value={newRoomType.roomTypeName}
              onChange={(e) => setNewRoomType({ ...newRoomType, roomTypeName: e.target.value })}
              placeholder="Room Type Name"
              className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
            />
            {isDuplicate && (
              <p className="animate-in slide-in-from-top-1 mt-1.5 text-pms-tiny font-bold text-red-500 sm:text-xs">
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
                value={newRoomType.price || ''}
                onChange={(e) => setNewRoomType({ ...newRoomType, price: e.target.value })}
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-8 font-mono text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRoomTypeModalOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newRoomType.roomTypeName}
              className={`flex-2 rounded-xl py-2.5 text-sm font-bold text-white shadow-lg transition-all ${isDuplicate || !newRoomType.roomTypeName ? 'cursor-not-allowed bg-slate-400 opacity-70 shadow-none' : 'bg-emerald-500 shadow-emerald-500/10 hover:bg-emerald-600 active:scale-95'}`}
            >
              {isDuplicate ? 'TYPE EXISTS' : 'SAVE ROOM TYPE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
