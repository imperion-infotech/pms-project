import { Pencil, X, Building } from 'lucide-react'

export const BuildingEditModal = ({
  isOpen,
  setIsOpen,
  editBuilding,
  setEditBuilding,
  handleUpdateBuilding,
  buildings = [],
}) => {
  if (!isOpen) return null

  const isDuplicate = buildings.some(
    (b) =>
      String(b.name).toLowerCase() === String(editBuilding.name).toLowerCase() &&
      String(b.id) !== String(editBuilding.id),
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleUpdateBuilding(e)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-colors duration-300">
        <div className="bg-surface-100 flex items-center justify-between p-6 text-white">
          <div className="flex items-center gap-3">
            <Pencil className="h-6 w-6 text-blue-400" />
            <div>
              <h3 className="text-lg font-bold">Edit Building</h3>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                Update Building Details
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
        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Building Name
            </label>
            <input
              autoFocus
              required
              type="text"
              value={editBuilding.name}
              onChange={(e) => setEditBuilding({ ...editBuilding, name: e.target.value })}
              placeholder="e.g. Tower B"
              className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm shadow-inner transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
            />
            {isDuplicate && (
              <p className="animate-in slide-in-from-top-1 mt-1.5 text-[10px] font-bold text-red-500 sm:text-xs">
                Building Name already exists!
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Description
            </label>
            <textarea
              rows="3"
              value={editBuilding.description || ''}
              onChange={(e) => setEditBuilding({ ...editBuilding, description: e.target.value })}
              placeholder="Building details (address, wing, etc.)"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 shadow-inner transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800 dark:hover:text-slate-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !editBuilding.name}
              className={`flex-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${isDuplicate || !editBuilding.name ? 'cursor-not-allowed bg-slate-400 opacity-70 shadow-none' : 'bg-blue-500 shadow-blue-500/20 hover:bg-blue-600 active:scale-95'}`}
            >
              {isDuplicate ? 'BUILDING EXISTS' : 'UPDATE BUILDING'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
