import React from 'react'
import { Building } from 'lucide-react'

/**
 * StaySpecifications component
 * A reusable section for booking and room placement details.
 */
const StaySpecifications = ({
  formData,
  handleChange,
  buildings = [],
  floors = [],
  roomTypes = [],
  rooms = [],
  roomStatuses = [],
  isDark = false,
}) => {
  // Shared UI classes
  const labelClass = 'text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block'
  const inputContainerClass = `flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
    isDark
      ? 'bg-slate-900/50 border-slate-700/50 focus-within:border-amber-500/50'
      : 'bg-white border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 shadow-xs'
  }`
  const inputClass =
    'bg-transparent border-none outline-none w-full text-[11px] font-bold text-slate-700 dark:text-white placeholder:text-slate-300'
  const selectClass =
    'bg-transparent border-none outline-none w-full text-[11px] font-bold text-slate-700 dark:text-white cursor-pointer'

  return (
    <div className="mt-0 space-y-3 text-left">

      {/* Row 1: Building & Floor */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Building <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <Building size={14} className="text-slate-300" />
            <select
              required
              name="buildingId"
              value={formData.buildingId}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Select Building</option>
              {buildings?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || b.buildingName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Floor <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <Building size={14} className="text-slate-300" />
            <select
              required
              name="floorId"
              value={formData.floorId}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Select Floor</option>
              {floors
                ?.filter((f) => {
                  if (!formData.buildingId) return true
                  // If floor doesn't have buildingId, show it as fallback, otherwise match
                  const fBuildingId = f.buildingId || f.building?.id || f.building_id
                  return !fBuildingId || String(fBuildingId) === String(formData.buildingId)
                })
                .map((f) => {
                  const roomCount =
                    rooms?.filter((r) => String(r.floorId || r.floor_id) === String(f.id)).length ||
                    0
                  return (
                    <option key={f.id} value={f.id}>
                      {f.name} {roomCount > 0 ? `(${roomCount} Rooms)` : '(No Rooms)'}
                    </option>
                  )
                })}
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Room Type & Room */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Room Type <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <select
              required
              name="roomTypeId"
              value={formData.roomTypeId}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Room Type</option>
              {roomTypes
                ?.filter((rt) => {
                  if (!formData.floorId) return true
                  return rooms?.some(
                    (r) =>
                      String(r.floorId) === String(formData.floorId) &&
                      String(r.roomTypeId) === String(rt.id),
                  )
                })
                .map((rt) => {
                  const typeCount =
                    rooms?.filter(
                      (r) =>
                        (!formData.floorId || String(r.floorId) === String(formData.floorId)) &&
                        String(r.roomTypeId) === String(rt.id),
                    ).length || 0
                  return (
                    <option key={rt.id} value={rt.id}>
                      {rt.roomTypeName} ({typeCount})
                    </option>
                  )
                })}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Room (Unit) <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <select
              required
              name="roomMasterId"
              value={formData.roomMasterId}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Room</option>
              {rooms
                ?.filter((r) => {
                  const isMatchingLocation =
                    (!formData.floorId || String(r.floorId) === String(formData.floorId)) &&
                    (!formData.roomTypeId || String(r.roomTypeId) === String(formData.roomTypeId))

                  if (!isMatchingLocation) return false

                  // Status Check: Only show 'Available' rooms
                  // But ALWAYS show the currently selected room (for Edit mode)
                  const rStatus =
                    r.roomStatus || r.roomStatusTable?.roomStatusName || r.room_status || ''
                  const isAvailable = String(rStatus).toUpperCase() === 'AVAILABLE'
                  const isCurrentRoom = String(r.id) === String(formData.roomMasterId)

                  return isAvailable || isCurrentRoom
                })
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roomName}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Special Comments</label>
        <div className={inputContainerClass}>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className={`${inputClass} min-h-[60px] resize-none`}
            placeholder="Housekeeping notes, preferences, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClass}>Room Status <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <select
              required
              name="roomStatusId"
              value={formData.roomStatusId}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Select Status</option>
              {roomStatuses?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.roomStatusName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Required Booking Attributes */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Rate Type <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <select
              required
              name="rateTypeEnum"
              value={formData.rateTypeEnum || 'RACK'}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="RACK">RACK</option>
              <option value="WEEKLY_RATE_TEST">Weekly Rate Test</option>
              <option value="YEARLY_RATE">Yearly Rate</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>No. Of Guests <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <input
              required
              type="number"
              name="noOfGuest"
              value={formData.noOfGuest || 1}
              onChange={handleChange}
              min="1"
              className={inputClass}
            />
          </div>
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Stay Status <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <select
              required
              name="stayStatusEnum"
              value={formData.stayStatusEnum || 'Confirmed'}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="UnConfirmed">UnConfirmed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaySpecifications
