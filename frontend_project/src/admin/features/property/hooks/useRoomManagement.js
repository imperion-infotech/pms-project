import { useState } from 'react'
import { useToast } from '../../../../context/NotificationContext'

/**
 * useRoomManagement - Room se judi saari logic aur state ko handle karne ke liye.
 * 
 * Ye hook Room create karne, update karne aur form state manage karne ka kaam karta hai.
 * Isse PmsDashboard.jsx ki complexity kam ho jati hai.
 */
export const useRoomManagement = ({ 
  floors, 
  roomTypes = [],
  roomStatuses = [],
  addRoom, 
  updateRoom, 
  toggleModal 
}) => {
  const toast = useToast()

  // Naya Room banane ka state
  const [newRoom, setNewRoom] = useState({
    roomName: '',
    roomShortName: '',
    roomTypeId: '',
    floorId: '',
    buildingId: '',
    roomStatusTableId: '',
    roomStatus: '',
    smoking: false,
    handicap: false,
    nonRoom: false,
  })

  // Purana Room edit karne ka state
  const [editRoom, setEditRoom] = useState({
    id: null,
    roomName: '',
    roomShortName: '',
    roomTypeId: '',
    floorId: '',
    buildingId: '',
    roomStatusTableId: '',
    roomStatus: '',
    smoking: false,
    handicap: false,
    nonRoom: false,
  })

  /**
   * handleAddRoom - Naya room backend pe save karne ke liye.
   */
  const handleAddRoom = async (e) => {
    e.preventDefault()
    const isNonRoom = Boolean(newRoom.nonRoom)
    
    // Validation: Required fields check
    if (
      !newRoom.roomName ||
      !newRoom.floorId ||
      !newRoom.buildingId ||
      (!isNonRoom && (!newRoom.roomTypeId || !newRoom.roomStatusTableId))
    ) {
      toast.warn('Please fill all required fields.')
      return
    }

    const selectedFloor = floors.find((f) => String(f.id) === String(newRoom.floorId))

    // Find fallback IDs for Non-room utility spaces if none selected
    const nonRoomType = roomTypes.find(rt => (rt.roomTypeName || '').toLowerCase().includes('non-room') || (rt.roomTypeName || '').toLowerCase().includes('utility')) || roomTypes[0];
    const nonRoomStatus = roomStatuses.find(rs => (rs.roomStatusName || '').toLowerCase().includes('non-room') || (rs.roomStatusName || '').toLowerCase().includes('n/a')) || roomStatuses[0];

    // Prepare payload matching the backend schema
    const payload = {
      roomName: newRoom.roomName,
      roomShortName: newRoom.roomName,
      roomTypeId: isNonRoom ? (nonRoomType?.id || 0) : (Number(newRoom.roomTypeId) || 0),
      floorId: Number(newRoom.floorId),
      buildingId: Number(newRoom.buildingId),
      roomStatusId: isNonRoom ? (nonRoomStatus?.id || 0) : (Number(newRoom.roomStatusTableId) || 0),
      roomStatus: newRoom.roomStatus || (isNonRoom ? 'NON-ROOM' : (nonRoomStatus?.roomStatusName || 'Available')),
      name: selectedFloor ? selectedFloor.name : newRoom.roomName,
      smoking: Boolean(newRoom.smoking),
      handicap: Boolean(newRoom.handicap),
      nonRoom: isNonRoom,
    }

    try {
      await addRoom(payload)
      // Clear form after success
      setNewRoom({
        roomName: '',
        roomShortName: '',
        roomTypeId: '',
        floorId: '',
        buildingId: '',
        roomStatusTableId: '',
        smoking: false,
        handicap: false,
        nonRoom: false,
      })
      toggleModal('room', false)
    } catch (err) {
      console.error('Failed to create room:', err)
    }
  }

  /**
   * handleUpdateRoom - Existing room ko backend pe update karne ke liye.
   */
  const handleUpdateRoom = async (e) => {
    e.preventDefault()
    const isNonRoom = Boolean(editRoom.nonRoom)
    
    // Validation
    if (
      !editRoom.roomName ||
      !editRoom.floorId ||
      !editRoom.buildingId ||
      (!isNonRoom && (!editRoom.roomTypeId || !editRoom.roomStatusTableId))
    ) {
      toast.warn('Please ensure all required fields are filled.')
      return
    }

    const nonRoomType = roomTypes.find(rt => (rt.roomTypeName || '').toLowerCase().includes('non-room')) || roomTypes[0];
    const nonRoomStatus = roomStatuses.find(rs => (rs.roomStatusName || '').toLowerCase().includes('non-room')) || roomStatuses[0];

    const payload = {
      id: editRoom.id,
      roomName: editRoom.roomName,
      roomShortName: editRoom.roomName,
      roomTypeId: isNonRoom ? (nonRoomType?.id || 0) : (Number(editRoom.roomTypeId) || 0),
      floorId: Number(editRoom.floorId),
      buildingId: Number(editRoom.buildingId),
      roomStatusId: isNonRoom ? (nonRoomStatus?.id || 0) : (Number(editRoom.roomStatusTableId) || 0),
      roomStatus: editRoom.roomStatus || (isNonRoom ? 'NON-ROOM' : 'Available'),
      name: editRoom.name || editRoom.roomName,
      smoking: Boolean(editRoom.smoking),
      handicap: Boolean(editRoom.handicap),
      nonRoom: isNonRoom,
    }

    try {
      await updateRoom(editRoom.id, payload)
      toggleModal('roomEdit', false)
    } catch (err) {
      console.error('Failed to update room:', err)
    }
  }

  /**
   * handleEditRoom - Raw room data ko form-friendly format mein convert karke edit state mein save karta hai.
   */
  const handleEditRoom = (r, allRoomTypes, allRoomStatuses) => {
    // Robust lookup for IDs supporting multiple backend naming conventions
    const rTypeId = r.roomTypeId || r.room_type_id || r.roomType?.id || r.roomType
    const rStatusId =
      r.roomStatusTableId ||
      r.room_status_table_id ||
      r.roomStatusTable?.id ||
      r.room_status_table?.id

    // If IDs are missing, attempt lookup by name strings
    const finalTypeId =
      rTypeId ||
      allRoomTypes.find(
        (rt) =>
          (rt.roomTypeName || rt.shortName) === r.roomType ||
          (rt.roomTypeName || rt.shortName) === r.roomTypeName,
      )?.id
      
    const finalStatusId =
      rStatusId ||
      allRoomStatuses.find(
        (rs) =>
          (rs.roomStatusName || rs.roomStatusTitle) === r.roomStatus ||
          (rs.roomStatusName || rs.roomStatusTitle) === r.roomStatusName,
      )?.id

    setEditRoom({
      ...r,
      buildingId:
        r.buildingId || r.building_id || r.building?.id || r.building || r.buildings || '',
      floorId: r.floorId || r.floor_id || r.floor?.id || r.floor || '',
      roomTypeId: finalTypeId || '',
      roomStatusTableId: finalStatusId || '',
      smoking: Boolean(r.smoking || r.is_smoking || r.isSmoking),
      handicap: Boolean(r.handicap || r.is_handicap || r.isHandicap),
      nonRoom: Boolean(r.nonRoom || r.non_room || r.isNonRoom),
    })
    toggleModal('roomEdit', true)
  }

  return {
    newRoom,
    setNewRoom,
    editRoom,
    setEditRoom,
    handleAddRoom,
    handleUpdateRoom,
    handleEditRoom,
  }
}
