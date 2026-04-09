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
  const labelClass = 'text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block'
  const inputContainerClass = `flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-blue-500/50'
      : 'bg-white border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 shadow-sm'
  }`
  const inputClass =
    'bg-transparent border-none outline-none w-full text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400'
  const selectClass =
    'bg-transparent border-none outline-none w-full text-xs font-semibold text-slate-800 dark:text-slate-100'

  return (
    <div className="mt-4 space-y-4 text-left">
      <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4">
        <div>
          <h3
            className={`text-xs font-black tracking-[0.2em] uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
          >
            Stay Details
          </h3>
          <p className="mt-0.5 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
            Booking & Unit Allocation
          </p>
        </div>
      </div>

      {/* Row 1: Building & Floor */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Building</label>
          <div className={inputContainerClass}>
            <Building size={14} className="text-slate-300" />
            <select
              name="buildingId"
              value={formData.buildingId}
              onChange={handleChange}
              className={selectClass}
            >
              {/* <option value="1">Main</option> */}
              {buildings?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Floor</label>
          <div className={inputContainerClass}>
            <Building size={14} className="text-slate-300" />
            <select
              name="floorId"
              value={formData.floorId}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Floor</option>
              {floors
                ?.filter(
                  (f) =>
                    !formData.buildingId || String(f.buildingId) === String(formData.buildingId),
                )
                .map((f) => {
                  const roomCount =
                    rooms?.filter((r) => String(r.floorId) === String(f.id)).length || 0
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
          <label className={labelClass}>Room Type</label>
          <div className={inputContainerClass}>
            <select
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
          <label className={labelClass}>Room (Unit)</label>
          <div className={inputContainerClass}>
            <select
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
          <label className={labelClass}>Room Status</label>
          <div className={inputContainerClass}>
            <select
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
          <label className={labelClass}>Rate Type*</label>
          <div className={inputContainerClass}>
            <select
              name="rateTypeEnum"
              value={formData.rateTypeEnum || 'RACK'}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="RACK">RACK</option>
              <option value="WEEKLY_RATE_TEST">Weekly Rate Test</option>
              <option value="YEARLY_RATE">Yearly Rate</option>
              {/* <option value="COMPLIMENTARY">Complimentary</option> */}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>No. Of Guests*</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="noOfGuest"
              value={formData.noOfGuest || 1}
              onChange={handleChange}
              min="1"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Stay Status*</label>
          <div className={inputContainerClass}>
            <select
              name="stayStatusEnum"
              value={formData.stayStatusEnum || 'Confirmed'}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Unconfirmed">Unconfirmed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaySpecifications
