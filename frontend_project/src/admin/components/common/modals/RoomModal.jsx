/**
 * RoomModal - Naya Room banane ka form.
 *
 * Is file mein form layout hai jo 'Add New Room' par click karne pe khulta hai.
 */
import { DoorOpen, X, Cigarette, Accessibility, Ban } from 'lucide-react'

export const RoomModal = ({
  isRoomModalOpen,
  setIsRoomModalOpen,
  newRoom,
  setNewRoom,
  handleAddRoom,
  roomTypes,
  floors,
  buildings = [],
  roomStatuses = [],
  rooms = [],
}) => {
  if (!isRoomModalOpen) return null

  const isDuplicate = rooms.some((r) => String(r.roomName) === String(newRoom.roomName))

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleAddRoom(e)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsRoomModalOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-colors duration-300">
        <div className="bg-surface-100 dark:bg-surface-100 flex shrink-0 items-center justify-between p-5 text-white sm:p-6">
          <div className="flex items-center gap-3">
            <DoorOpen className="h-6 w-6 text-emerald-400" />
            <div>
              <h3 className="font-heading text-lg leading-tight font-bold tracking-tight">
                Add New Room
              </h3>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Physical Property Mapping
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRoomModalOpen(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="custom-scrollbar space-y-6 overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Building
              </label>
              <select
                required
                value={newRoom.buildingId}
                onChange={(e) => setNewRoom({ ...newRoom, buildingId: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
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
                value={newRoom.floorId}
                onChange={(e) => setNewRoom({ ...newRoom, floorId: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
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
                required={!newRoom.nonRoom}
                disabled={newRoom.nonRoom}
                value={newRoom.roomTypeId || ''}
                onChange={(e) => {
                  const newTypeId = e.target.value
                  // Jab room type update ho, tab agar status selected nahi hai
                  // toh pehla available status select kar lo (e.g. Available/Dirty)
                  const updateObj = { ...newRoom, roomTypeId: newTypeId }
                  if (!newRoom.roomStatusTableId && roomStatuses.length > 0) {
                    updateObj.roomStatusTableId = roomStatuses[0].id
                  }
                  setNewRoom(updateObj)
                }}
                className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 ${newRoom.nonRoom ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <option value="" disabled>
                  {newRoom.nonRoom ? 'N/A (Utility)' : 'Select Room Type'}
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
                required={!newRoom.nonRoom}
                disabled={newRoom.nonRoom}
                value={newRoom.roomStatusTableId || ''}
                onChange={(e) => setNewRoom({ ...newRoom, roomStatusTableId: e.target.value })}
                className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 ${newRoom.nonRoom ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <option value="" disabled>
                  {newRoom.nonRoom ? 'N/A' : 'Select Initial Status'}
                </option>
                {roomStatuses.map((rs) => (
                  <option key={rs.id} value={rs.id}>
                    {rs.roomStatusName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status & Type Preview Section */}
            {!newRoom.nonRoom && (
              <div className="animate-in fade-in slide-in-from-top-2 col-span-1 flex flex-wrap items-end gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 sm:col-span-2 dark:border-slate-800 dark:bg-slate-900/50">
                {newRoom.roomTypeId && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Type Summary
                    </span>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">
                        {roomTypes.find((rt) => String(rt.id) === String(newRoom.roomTypeId))
                          ?.roomTypeName || 'Selected Type'}
                      </span>
                      <div className="ml-1 h-4 w-px bg-slate-100 dark:bg-slate-700"></div>
                      <span className="text-[11px] font-black tracking-wider text-emerald-500">
                        ₹
                        {roomTypes.find((rt) => String(rt.id) === String(newRoom.roomTypeId))
                          ?.price || '0'}
                      </span>
                    </div>
                  </div>
                )}

                {newRoom.roomStatusTableId && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Selected Status
                    </span>
                    <div
                      className="inline-flex items-center rounded-xl border px-4 py-2 text-[10px] font-black tracking-widest uppercase shadow-sm transition-all duration-300"
                      style={{
                        backgroundColor: `${roomStatuses.find((rs) => String(rs.id) === String(newRoom.roomStatusTableId))?.roomStatusColor || '#64748b'}15`,
                        color:
                          roomStatuses.find(
                            (rs) => String(rs.id) === String(newRoom.roomStatusTableId),
                          )?.roomStatusColor || '#64748b',
                        borderColor: `${roomStatuses.find((rs) => String(rs.id) === String(newRoom.roomStatusTableId))?.roomStatusColor || '#64748b'}30`,
                      }}
                    >
                      {roomStatuses.find(
                        (rs) => String(rs.id) === String(newRoom.roomStatusTableId),
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
                value={newRoom.roomStatus || ''}
                onChange={(e) => setNewRoom({ ...newRoom, roomStatus: e.target.value })}
                placeholder="e.g. Booked"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Room Name
              </label>
              <input
                required
                type="text"
                value={newRoom.roomName || ''}
                onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
                placeholder="e.g. 101"
                className={`w-full border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'} rounded-xl text-sm transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${newRoom.smoking ? 'border-orange-200 bg-orange-50 ring-2 ring-orange-500/10 dark:border-orange-500/20 dark:bg-orange-500/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'}`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={newRoom.smoking}
                    onChange={(e) => setNewRoom({ ...newRoom, smoking: e.target.checked })}
                    className="h-5 w-5 cursor-pointer rounded-md accent-orange-500 transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Cigarette
                      className={`h-4 w-4 ${newRoom.smoking ? 'text-orange-500' : 'font-bold text-slate-400 dark:text-slate-500'}`}
                    />
                    <span
                      className={`text-sm font-bold ${newRoom.smoking ? 'text-orange-700 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}
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
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${newRoom.handicap ? 'border-blue-200 bg-blue-50 ring-2 ring-blue-500/10 dark:border-blue-500/20 dark:bg-blue-500/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'}`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={newRoom.handicap}
                    onChange={(e) => setNewRoom({ ...newRoom, handicap: e.target.checked })}
                    className="h-5 w-5 cursor-pointer rounded-md accent-blue-500 transition-transform group-active:scale-90"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Accessibility
                      className={`h-4 w-4 ${newRoom.handicap ? 'text-blue-500' : 'font-bold text-slate-400 dark:text-slate-500'}`}
                    />
                    <span
                      className={`text-sm font-bold ${newRoom.handicap ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
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
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${newRoom.nonRoom ? 'border-red-200 bg-red-50 ring-2 ring-red-500/10 dark:border-red-500/20 dark:bg-red-500/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'} sm:col-span-2`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={newRoom.nonRoom}
                    onChange={(e) => {
                      const isNonRoom = e.target.checked
                      setNewRoom({
                        ...newRoom,
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
                      className={`h-4 w-4 ${newRoom.nonRoom ? 'text-red-500' : 'font-bold text-slate-400 dark:text-slate-500'}`}
                    />
                    <span
                      className={`text-sm font-bold ${newRoom.nonRoom ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}
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

          <div className="flex shrink-0 flex-col gap-4 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsRoomModalOpen(false)}
              className="order-2 px-6 py-3 text-sm font-bold text-slate-400 transition-colors hover:text-slate-600 sm:order-1 dark:hover:text-slate-300"
            >
              DISCARD
            </button>
            <button
              type="submit"
              disabled={isDuplicate || !newRoom.roomName}
              className={`order-1 flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all sm:order-2 ${isDuplicate || !newRoom.roomName ? 'cursor-not-allowed bg-slate-400 opacity-70 shadow-none' : 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95'}`}
            >
              {isDuplicate ? 'ROOM EXISTS' : 'CREATE ROOM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
