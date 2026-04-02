/**
 * RoomEditModal - Puraane Room ko edit karne ka form.
 *
 * Jab aap 'Pencil Icon' par click karte hain, toh ye file
 * poore details ko edit mode mein load karti hai.
 */
import { Pencil, X, Cigarette, Accessibility, Ban } from 'lucide-react'

export const RoomEditModal = ({
  isOpen,
  setIsOpen,
  editRoom,
  setEditRoom,
  handleUpdateRoom,
  roomTypes,
  floors,
  buildings = [],
  roomStatuses = [],
  rooms = [],
}) => {
  if (!isOpen) return null

  const isDuplicate = rooms.some(
    (r) => String(r.roomName) === String(editRoom.roomName) && r.id !== editRoom.id,
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleUpdateRoom(e)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-colors duration-300">
        <div className="bg-surface-100 flex items-center justify-between p-6 text-white">
          <div className="flex items-center gap-3">
            <Pencil className="h-6 w-6 text-blue-400" />
            <div>
              <h3 className="font-heading text-lg font-bold tracking-tight">Edit Room</h3>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Update Property Mapping
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
        <form onSubmit={onSubmit} className="space-y-6 p-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Building
              </label>
              <select
                required
                value={editRoom.buildingId}
                onChange={(e) => setEditRoom({ ...editRoom, buildingId: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              >
                <option value="" disabled>
                  Select Building
                </option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Floor
              </label>
              <select
                required
                value={editRoom.floorId}
                onChange={(e) => setEditRoom({ ...editRoom, floorId: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              >
                <option value="" disabled>
                  Select Floor
                </option>
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Room Type
              </label>
              <select
                required={!editRoom.nonRoom}
                disabled={editRoom.nonRoom}
                value={editRoom.roomTypeId || ''}
                onChange={(e) => {
                  const newTypeId = e.target.value
                  // Jab room type update ho, tab agar status selected nahi hai
                  // toh pehla available status select kar lo (e.g. Available/Dirty)
                  const updateObj = { ...editRoom, roomTypeId: newTypeId }
                  if (!editRoom.roomStatusTableId && roomStatuses.length > 0) {
                    updateObj.roomStatusTableId = roomStatuses[0].id
                  }
                  setEditRoom(updateObj)
                }}
                className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 ${editRoom.nonRoom ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <option value="" disabled>
                  {editRoom.nonRoom ? 'N/A (Utility)' : 'Select Room Type'}
                </option>
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.roomTypeName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Operational Status
              </label>
              <select
                required={!editRoom.nonRoom}
                disabled={editRoom.nonRoom}
                value={editRoom.roomStatusTableId || ''}
                onChange={(e) => setEditRoom({ ...editRoom, roomStatusTableId: e.target.value })}
                className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 ${editRoom.nonRoom ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <option value="" disabled>
                  {editRoom.nonRoom ? 'N/A' : 'Select Status'}
                </option>
                {roomStatuses.map((rs) => (
                  <option key={rs.id} value={rs.id}>
                    {rs.roomStatusName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status & Type Preview Section */}
            {!editRoom.nonRoom && (
              <div className="animate-in fade-in slide-in-from-top-2 col-span-2 flex flex-wrap items-end gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                {editRoom.roomTypeId && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Type Summary
                    </span>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                      <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">
                        {roomTypes.find((rt) => String(rt.id) === String(editRoom.roomTypeId))
                          ?.roomTypeName || 'Selected Type'}
                      </span>
                      <div className="ml-1 h-4 w-px bg-slate-100 dark:bg-slate-700"></div>
                      <span className="text-[11px] font-black tracking-wider text-emerald-500">
                        ₹
                        {roomTypes.find((rt) => String(rt.id) === String(editRoom.roomTypeId))
                          ?.price || '0'}
                      </span>
                    </div>
                  </div>
                )}

                {editRoom.roomStatusTableId && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Current Status
                    </span>
                    <div
                      className="inline-flex items-center rounded-xl border px-4 py-2 text-[10px] font-black tracking-widest uppercase shadow-sm transition-all duration-300"
                      style={{
                        backgroundColor: `${roomStatuses.find((rs) => String(rs.id) === String(editRoom.roomStatusTableId))?.roomStatusColor || '#64748b'}15`,
                        color:
                          roomStatuses.find(
                            (rs) => String(rs.id) === String(editRoom.roomStatusTableId),
                          )?.roomStatusColor || '#64748b',
                        borderColor: `${roomStatuses.find((rs) => String(rs.id) === String(editRoom.roomStatusTableId))?.roomStatusColor || '#64748b'}30`,
                      }}
                    >
                      {roomStatuses.find(
                        (rs) => String(rs.id) === String(editRoom.roomStatusTableId),
                      )?.roomStatusName || 'Status'}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Room Status (Display)
              </label>
              <input
                type="text"
                value={editRoom.roomStatus || ''}
                onChange={(e) => setEditRoom({ ...editRoom, roomStatus: e.target.value })}
                placeholder="e.g. Booked"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Room Name
              </label>
              <input
                required
                type="text"
                value={editRoom.roomName || ''}
                onChange={(e) => setEditRoom({ ...editRoom, roomName: e.target.value })}
                placeholder="e.g. 101"
                className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
              />
              {isDuplicate && (
                <p className="animate-in slide-in-from-top-1 mt-1.5 text-[10px] font-bold text-red-500 sm:text-xs">
                  Room Name already exists!
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block border-b border-slate-100 pb-2 text-xs font-bold tracking-widest text-slate-400 uppercase dark:border-slate-800 dark:text-slate-500">
              Room Features
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${editRoom.smoking ? 'border-orange-200 bg-orange-50 ring-2 ring-orange-500/10 dark:border-orange-500/20 dark:bg-orange-500/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'}`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={editRoom.smoking}
                    onChange={(e) => setEditRoom({ ...editRoom, smoking: e.target.checked })}
                    className="h-5 w-5 cursor-pointer rounded-md accent-orange-500 transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Cigarette
                      className={`h-4 w-4 ${editRoom.smoking ? 'text-orange-500' : 'font-bold text-slate-400 dark:text-slate-500'}`}
                    />
                    <span
                      className={`text-sm font-bold ${editRoom.smoking ? 'text-orange-700 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Smoking
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    Guest can smoke in room
                  </span>
                </div>
              </label>

              <label
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${editRoom.handicap ? 'border-blue-200 bg-blue-50 ring-2 ring-blue-500/10 dark:border-blue-500/20 dark:bg-blue-500/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'}`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={editRoom.handicap}
                    onChange={(e) => setEditRoom({ ...editRoom, handicap: e.target.checked })}
                    className="h-5 w-5 cursor-pointer rounded-md accent-blue-500 transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Accessibility
                      className={`h-4 w-4 ${editRoom.handicap ? 'text-blue-500' : 'font-bold text-slate-400 dark:text-slate-500'}`}
                    />
                    <span
                      className={`text-sm font-bold ${editRoom.handicap ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Handicap
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    Specially designed for access
                  </span>
                </div>
              </label>

              <label
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${editRoom.nonRoom ? 'border-red-200 bg-red-50 ring-2 ring-red-500/10 dark:border-red-500/20 dark:bg-red-500/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'}`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={editRoom.nonRoom}
                    onChange={(e) => {
                      const isNonRoom = e.target.checked
                      setEditRoom({
                        ...editRoom,
                        nonRoom: isNonRoom,
                        ...(isNonRoom ? { roomTypeId: '', roomStatusTableId: '' } : {}),
                      })
                    }}
                    className="h-5 w-5 cursor-pointer rounded-md accent-red-500 transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Ban
                      className={`h-4 w-4 ${editRoom.nonRoom ? 'text-red-500' : 'font-bold text-slate-400 dark:text-slate-500'}`}
                    />
                    <span
                      className={`text-sm font-bold ${editRoom.nonRoom ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Non-Room
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    Internal service/utility space
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              DISCARD
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !editRoom.roomName}
              className={`flex-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${isDuplicate || !editRoom.roomName ? 'cursor-not-allowed bg-slate-400 opacity-70 shadow-none' : 'bg-blue-500 shadow-blue-500/20 hover:bg-blue-600 active:scale-95'}`}
            >
              {isDuplicate ? 'ROOM EXISTS' : 'UPDATE ROOM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
