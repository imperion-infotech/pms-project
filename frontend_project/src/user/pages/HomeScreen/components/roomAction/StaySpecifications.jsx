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
  isDark = false,
}) => {
  // Shared UI classes
  const labelClass =
    'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1'
  const inputContainerClass = `flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50'
      : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
  }`
  const inputClass =
    'bg-transparent border-none outline-none w-full text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300'
  const selectClass =
    'bg-transparent border-none outline-none w-full text-xs font-bold text-slate-800 dark:text-slate-100'

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3">
        <div>
          <h3
            className={`text-[11px] font-black tracking-widest uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
          >
            Stay Specifications
          </h3>
          <p className="mt-0.5 text-[8px] font-bold tracking-widest text-slate-400 uppercase">
            Booking & Placement
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
              <option value="">Select Building</option>
              {buildings.map((b) => (
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
              <option value="">Select Floor</option>
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
              <option value="">Type</option>
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
              <option value="">Select Room</option>
              {rooms
                .filter(
                  (r) =>
                    (!formData.floorId || String(r.floorId) === String(formData.floorId)) &&
                    (!formData.roomTypeId || String(r.roomTypeId) === String(formData.roomTypeId)),
                )
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roomName}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Row 3: Rate Type & Guests */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Rate Type</label>
          <div className={inputContainerClass}>
            <select
              name="rateTypeEnum"
              value={formData.rateTypeEnum}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="RACK">RACK</option>
              <option value="WEEKLY_RATE_TEST">WEEKLY</option>
              <option value="YEARLY_RATE">YEARLY</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Guests</label>
          <div className={inputContainerClass}>
            <input
              type="number"
              name="noOfGuest"
              value={formData.noOfGuest}
              onChange={handleChange}
              className={inputClass}
              min="1"
            />
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
            className={`${inputClass} min-h-[50px] resize-none`}
            placeholder="Housekeeping notes, preferences, etc."
          />
        </div>
      </div>
    </div>
  )
}

export default StaySpecifications
