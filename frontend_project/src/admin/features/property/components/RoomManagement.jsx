/**
 * RoomManagement.jsx (Admin Domain)
 *
 * Ye file Rooms ko table format mein dikhati hai.
 * Iska kaam hai Room ka inventory dikhana, details populate karna,
 * aur edit/delete buttons ko actions se connect karna.
 */
import React from 'react'
import {
  PlusCircle,
  X,
  Cigarette,
  CigaretteOff,
  Accessibility,
  Check,
  Minus,
  Ban,
  Pencil,
  Trash2,
  AlertTriangle,
  CloudCog,
} from 'lucide-react'
import useRoomController from '../controllers/useRoomController'

const RoomManagement = ({
  rooms = [],
  roomTypes = [],
  floors = [],
  buildings = [],
  roomStatuses = [],
  searchTerm,
  setIsRoomModalOpen,
  onEdit,
  onDelete,
  currentPage = 1,
  itemsPerPage = 8,
}) => {
  const {
    processedRooms,
    getIndex,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useRoomController({ rooms, searchTerm, onDelete, currentPage, itemsPerPage })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
      {/* Header & Action Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm transition-all hover:scale-110">
            <CloudCog className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Rooms
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Manage and organize physical property rooms
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRoomModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Main Table Layer */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-2xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:shadow-slate-300/50 dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">No.</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Room Name</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Building</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Room Type</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Floor</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Operational</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-orange-500 uppercase">Smoking</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-blue-500 uppercase">Handicap</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-red-500 uppercase">Non-room</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {processedRooms.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/20">
                        <CloudCog className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        {searchTerm ? 'No rooms match your search.' : 'No rooms available.'}
                      </p>
                      <button onClick={() => setIsRoomModalOpen(true)} className="text-xs font-bold text-emerald-500 hover:underline">
                        Add your first room
                      </button>
                    </div>
                  </td>
                </tr>
            ) : (
              processedRooms.map((room, index) => {
                // Extract fields from room object
                const {
                  roomName,
                  roomStatus,
                  roomStatusTable,
                  smoking: roomSmoking,
                  handicap: roomHandicap,
                  nonRoom: roomNonRoom,
                } = room
                const roomTypeId =
                  room.roomTypeId || room.room_type_id || room.roomType?.id || room.roomType
                const floorId = room.floorId || room.floor_id || room.floor?.id || room.floor
                const buildingId =
                  room.buildingId ||
                  room.building_id ||
                  room.building?.id ||
                  room.building ||
                  room.buildings

                const matchedType = roomTypes.find((rt) => String(rt.id) === String(roomTypeId))
                const matchedFloor = floors.find((f) => String(f.id) === String(floorId))
                const matchedBuilding = buildings.find((b) => String(b.id) === String(buildingId))

                const roomStatusValue = (roomStatus || '').toLowerCase()
                const rStatusId =
                  room.roomStatusId ||
                  room.room_status_id ||
                  room.roomStatusTableId ||
                  room.room_status_table_id ||
                  roomStatusTable?.id ||
                  roomStatuses.find(
                    (rs) =>
                      (rs.roomStatusName || '').toLowerCase() === roomStatusValue ||
                      (rs.roomStatusTitle || '').toLowerCase() === roomStatusValue,
                  )?.id
                const matchedStatus = roomStatuses.find((rs) => String(rs.id) === String(rStatusId))

                const smoking = roomSmoking || room.is_smoking || room.isSmoking
                const handicap = roomHandicap || room.is_handicap || room.isHandicap
                const isNonRoomFlag = roomNonRoom || room.non_room || room.isNonRoom

                // Support direct name fields if backend provides them, or fallback to lookup result
                const typeName = matchedType
                  ? matchedType.roomTypeName
                  : room.roomTypeName ||
                    room.room_type?.roomTypeName ||
                    (isNonRoomFlag ? 'Non-Room Utility' : 'Unknown')
                const floorName = matchedFloor
                  ? matchedFloor.name
                  : room.floorName || room.floor?.name || 'Unknown'
                const buildingName = matchedBuilding
                  ? matchedBuilding.name
                  : room.buildingName || room.building?.name || 'Unknown'

                let statusName = isNonRoomFlag
                  ? '-'
                  : roomStatus ||
                    (matchedStatus
                      ? matchedStatus.roomStatusTitle || matchedStatus.roomStatusName
                      : 'Unknown')
                const internalStatus = isNonRoomFlag
                  ? '-'
                  : roomStatusTable?.roomStatusName || matchedStatus?.roomStatusName || '-'

                // Case: If status is 'Available' but operational status is 'Reserved', show 'RESERVATION'
                if (
                  statusName.toUpperCase() === 'AVAILABLE' &&
                  internalStatus.toLowerCase().includes('reserved')
                ) {
                  statusName = 'RESERVATION'
                }

                const statusColor =
                  roomStatusTable?.roomStatusColor || matchedStatus?.roomStatusColor || '#64748b'

                return (
                  <tr
                    key={room.id}
                    className="group h-14 transition-all hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5"
                  >
                    <td className="border-r border-slate-100 px-6 py-2 text-center font-mono text-pms-mini font-bold text-slate-300 group-hover:text-emerald-500 dark:border-slate-800 dark:text-slate-600">
                      {getIndex(index)}
                    </td>
                    <td className="border-r border-slate-100 px-6 py-2 font-bold text-slate-800 dark:border-slate-800 dark:text-slate-200">
                      {roomName}
                    </td>
                    <td className="border-r border-slate-100 px-6 py-2 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                      {buildingName}
                    </td>
                    <td className="border-r border-slate-100 px-6 py-2 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                      {typeName}
                    </td>
                    <td className="border-r border-slate-100 px-6 py-2 text-slate-500 dark:border-slate-800 dark:text-slate-500">
                      {floorName}
                    </td>
                    <td className="border-r border-slate-100 px-6 py-2 text-center dark:border-slate-800">
                      <span
                        className="inline-block min-w-[90px] rounded-full border px-3 py-1.5 text-pms-tiny font-black tracking-widest uppercase shadow-sm transition-all duration-300"
                        style={{
                          backgroundColor: `${statusColor}15`,
                          color: statusColor,
                          borderColor: `${statusColor}30`,
                        }}
                      >
                        {statusName}
                      </span>
                    </td>
                    <td className="border-r border-slate-100 px-6 py-2 text-center font-medium text-slate-500 italic dark:border-slate-800">
                      {internalStatus}
                    </td>
                    <td className="border-r border-slate-100 bg-orange-50/10 px-4 py-2 text-center dark:border-slate-800">
                      <div className="flex justify-center transition-transform hover:scale-110">
                        {smoking ? (
                          <Cigarette className="h-4.5 w-4.5 text-orange-500 drop-shadow-sm" />
                        ) : (
                          <Minus className="h-3 w-3 text-slate-300 opacity-30 dark:text-slate-700" />
                        )}
                      </div>
                    </td>
                    <td className="border-r border-slate-100 bg-blue-50/10 px-4 py-2 text-center dark:border-slate-800">
                      <div className="flex justify-center transition-transform hover:scale-110">
                        {handicap ? (
                          <Accessibility className="h-4.5 w-4.5 text-blue-500 drop-shadow-sm" />
                        ) : (
                          <Minus className="h-3 w-3 text-slate-300 opacity-30 dark:text-slate-700" />
                        )}
                      </div>
                    </td>
                    <td className="border-r border-slate-100 bg-red-50/10 px-4 py-2 text-center dark:border-slate-800">
                      <div className="flex justify-center transition-transform hover:scale-110">
                        {isNonRoomFlag ? (
                          <Ban className="h-4.5 w-4.5 text-red-500 drop-shadow-sm" />
                        ) : (
                          <Minus className="h-3 w-3 text-slate-300 opacity-30 dark:text-slate-700" />
                        )}
                      </div>
                    </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => onEdit(room)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-emerald-200 hover:text-emerald-500 hover:shadow-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900 dark:hover:shadow-none" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(room)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-red-200 hover:text-red-500 hover:shadow-red-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900 dark:hover:shadow-none" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="animate-in zoom-in-95 relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-red-100 bg-white p-6 shadow-2xl transition-all dark:border-red-900/30 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Delete Room</h3>
                <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">Permanent Action</p>
              </div>
              <button onClick={handleCancelDelete} className="ml-auto rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="mb-8 text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              Are you sure you want to delete room{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">"{deleteTarget.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleCancelDelete} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800">Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95">Delete Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(RoomManagement)
