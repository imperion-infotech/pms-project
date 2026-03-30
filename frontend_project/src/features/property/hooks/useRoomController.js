import { useMemo } from 'react'

/**
 * Controller: useRoomController
 * This serves as the 'Controller' in our MVC architecture.
 * It manages the business logic, data transformation, and interaction between Model and View.
 */

/**
 * useRoomController - Ye file logical processing sambhalti hai.
 *
 * Iska kaam hai view (UI) ke liye data 'Prepare' karna.
 * Jaise IDs se unke names nikalna, statuses calculate karna,
 * aur listing ko optimize karna. Ye Controller ka kaam karti hai.
 */
const useRoomController = ({
  rooms,
  roomTypes,
  floors,
  buildings,
  roomStatuses = [],
  currentPage,
  itemsPerPage,
}) => {
  // Model-to-View mapping logic (Data Enrichment)
  const enrichedRooms = useMemo(() => {
    return rooms.map((room) => {
      // Find Room Type
      const roomTypeId = room.roomTypeId || room.roomType?.id || room.roomType
      const roomType = roomTypes.find((rt) => String(rt.id) === String(roomTypeId))

      // Find Floor
      const floorId = room.floorId || room.floor?.id || room.floor
      const floor = floors.find((f) => String(f.id) === String(floorId))

      // Find Building
      const buildingId = room.buildingId || room.building?.id || room.building
      const building = buildings.find((b) => String(b.id) === String(buildingId))

      // Find Room Status
      const roomStatusId =
        room.roomStatusTableId || room.room_status_table_id || room.roomStatusTable?.id
      const matchedStatus = roomStatuses.find((rs) => String(rs.id) === String(roomStatusId))
      console.log('------------------Room Controller--------------------', matchedStatus)
      console.log('----------------------Room Status ID-----------------', roomStatusId)

      return {
        ...room,
        displayRoomType:
          room.roomTypeName || room.roomType?.roomTypeName || roomType?.roomTypeName || 'Standard',
        displayFloor: room.floorName || room.floor?.name || floor?.name || 'N/A',
        displayBuilding: room.buildingName || room.building?.name || building?.name || 'Unknown',
        displayStatus:
          room.nonRoom || room.non_room || room.isNonRoom
            ? '-'
            : matchedStatus?.roomStatusName ||
              room.roomStatus ||
              room.roomStatusTable?.roomStatusName ||
              'Unknown',
        // Standardizing flag fields (Snake Case vs Camel Case)
        isSmoking: !!(room.smoking || room.is_smoking || room.isSmoking),
        isHandicap: !!(room.handicap || room.is_handicap || room.isHandicap),
        isNonRoom: !!(room.nonRoom || room.non_room || room.isNonRoom),
      }
    })
  }, [rooms, roomTypes, floors, buildings, roomStatuses])

  // Handle Pagination indexing
  const getIndex = (idx) => (currentPage - 1) * itemsPerPage + idx + 1

  // We could also add sorting/filtering logic here
  const sortedRooms = useMemo(() => {
    return [...enrichedRooms].sort((a, b) => b.id - a.id) // Default: Latest first
  }, [enrichedRooms])

  return {
    processedRooms: sortedRooms,
    getIndex,
    totalCount: rooms.length,
  }
}

export default useRoomController
