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
    <div className="dark:bg-surface-100 rounded-xl border border-slate-200 bg-white shadow-md transition-colors duration-300 dark:border-slate-800">
      {/* Room Type Action Bar */}
      <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 p-4 sm:p-6 lg:flex-row dark:border-slate-800">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-lg font-bold tracking-tight text-[#1a2b4b] md:text-xl dark:text-slate-100">
            Rooms
          </h2>
          <p className="text-xs font-medium text-slate-400 md:text-sm">
            Manage and organize physical property rooms
          </p>
        </div>

        <button
          onClick={() => setIsRoomModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-[11px] font-black tracking-wider text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95 sm:w-auto md:px-6 md:text-xs"
        >
          <PlusCircle className="h-5 w-5" />
          ADD NEW ROOM
        </button>
      </div>

      {/* Room Table */}
      <div className="custom-scrollbar max-h-[600px] w-full overflow-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-200 bg-[#f8fafc] text-[11px] font-bold tracking-wider text-[#64748b] uppercase dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
              <th className="w-16 border-r border-slate-200 px-6 py-4 text-center dark:border-slate-800">
                No.
              </th>
              <th className="w-32 border-r border-slate-200 px-6 py-4 dark:border-slate-800">
                Room Name
              </th>
              <th className="w-36 border-r border-slate-200 px-6 py-4 dark:border-slate-800">
                Building Name
              </th>
              <th className="w-36 border-r border-slate-200 px-6 py-4 dark:border-slate-800">
                Room Type Name
              </th>
              <th className="w-36 border-r border-slate-200 px-6 py-4 dark:border-slate-800">
                Floor Name
              </th>
              <th className="w-32 border-r border-slate-200 px-6 py-4 text-center dark:border-slate-800">
                Status
              </th>
              <th className="w-36 border-r border-slate-200 px-6 py-4 text-center dark:border-slate-800">
                Operational Status
              </th>
              <th className="w-24 border-r border-slate-200 px-4 py-4 text-center text-orange-600 dark:border-slate-800">
                Smoking
              </th>
              <th className="w-24 border-r border-slate-200 px-4 py-4 text-center text-blue-600 dark:border-slate-800">
                Handicap
              </th>
              <th className="w-24 border-r border-slate-200 px-4 py-4 text-center text-red-600 dark:border-slate-800">
                Non-room
              </th>
              <th className="w-28 px-4 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-800">
            {processedRooms.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-10 text-center text-slate-400 italic dark:text-slate-500"
                >
                  {searchTerm
                    ? 'No rooms match your search.'
                    : 'No rooms available. Add your first room.'}
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
                    <td className="border-r border-slate-100 px-6 py-2 text-center font-mono text-[11px] font-bold text-slate-300 group-hover:text-emerald-500 dark:border-slate-800 dark:text-slate-600">
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
                        className="inline-block min-w-[90px] rounded-full border px-3 py-1.5 text-[10px] font-black tracking-widest uppercase shadow-sm transition-all duration-300"
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
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => onEdit(room)}
                          className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(room)}
                          className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                          title="Delete"
                        >
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

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
          <div className="dark:bg-surface-100 relative z-10 w-full max-w-sm rounded-2xl border border-red-100 bg-white p-6 shadow-2xl dark:border-red-900/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Delete Room
                </h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button
                onClick={handleCancelDelete}
                className="ml-auto rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete room{' '}
              <span className="font-bold text-red-500">"{deleteTarget.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-2 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(RoomManagement)
