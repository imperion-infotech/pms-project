import { PlusCircle, X, Building } from 'lucide-react'

export const BuildingModal = ({
  isBuildingModalOpen,
  setIsBuildingModalOpen,
  newBuilding,
  setNewBuilding,
  handleAddBuilding,
  buildings = [],
}) => {
  if (!isBuildingModalOpen) return null

  const isDuplicate = buildings.some(
    (b) => String(b.name).toLowerCase() === String(newBuilding.name).toLowerCase(),
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleAddBuilding(e)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsBuildingModalOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-colors duration-300">
        <div className="bg-surface-100 dark:bg-surface-50 flex items-center justify-between p-6 text-white">
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold">Add New Building</h3>
              <p className="text-pms-tiny tracking-widest text-slate-400 uppercase">
                Master Data Entry
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBuildingModalOpen(false)}
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
              value={newBuilding.name}
              onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
              placeholder="e.g. Tower A"
              className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm shadow-inner transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
            />
            {isDuplicate && (
              <p className="animate-in slide-in-from-top-1 mt-1.5 text-pms-tiny font-bold text-red-500 sm:text-xs">
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
              value={newBuilding.description || ''}
              onChange={(e) => setNewBuilding({ ...newBuilding, description: e.target.value })}
              placeholder="Building details (address, wing, etc.)"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 shadow-inner transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsBuildingModalOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800 dark:hover:text-slate-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newBuilding.name}
              className={`flex-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${isDuplicate || !newBuilding.name ? 'cursor-not-allowed bg-slate-400 opacity-70 shadow-none' : 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95'}`}
            >
              {isDuplicate ? 'BUILDING EXISTS' : 'ADD BUILDING'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
