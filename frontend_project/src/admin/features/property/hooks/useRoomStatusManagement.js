import { useState, useCallback } from 'react'

/**
 * useRoomStatusManagement - Centralized hook for Room Status CRUD operations.
 */
export const useRoomStatusManagement = ({ 
  addRoomStatus, 
  updateRoomStatus, 
  toggleModal 
}) => {
  const [newRoomStatus, setNewRoomStatus] = useState({
    roomStatusName: '',
    roomStatusTitle: '',
    roomStatusColor: '#2798e8',
  })
  const [editRoomStatus, setEditRoomStatus] = useState({
    id: null,
    roomStatusName: '',
    roomStatusTitle: '',
    roomStatusColor: '#2798e8',
  })

  const handleAddRoomStatus = useCallback(async () => {
    if (!newRoomStatus.roomStatusName.trim()) return
    try {
      await addRoomStatus(newRoomStatus)
      setNewRoomStatus({
        roomStatusName: '',
        roomStatusTitle: '',
        roomStatusColor: '#2798e8',
      })
      toggleModal('RoomStatus', false)
    } catch (err) {
      console.error('Failed to create room status:', err)
    }
  }, [newRoomStatus, addRoomStatus, toggleModal])

  const handleUpdateRoomStatus = useCallback(async () => {
    if (!editRoomStatus.id || !editRoomStatus.roomStatusName.trim()) return
    try {
      await updateRoomStatus(editRoomStatus.id, {
        roomStatusName: editRoomStatus.roomStatusName,
        roomStatusTitle: editRoomStatus.roomStatusTitle,
        roomStatusColor: editRoomStatus.roomStatusColor,
      })
      setEditRoomStatus({
        id: null,
        roomStatusName: '',
        roomStatusTitle: '',
        roomStatusColor: '#2798e8',
      })
      toggleModal('RoomStatusEdit', false)
    } catch (err) {
      console.error('Failed to update room status:', err)
    }
  }, [editRoomStatus, updateRoomStatus, toggleModal])

  const handleEditRoomStatus = useCallback((status) => {
    setEditRoomStatus({
      id: status.id,
      roomStatusName: status.roomStatusName || '',
      roomStatusTitle: status.roomStatusTitle || '',
      roomStatusColor: status.roomStatusColor || '#2798e8',
    })
    toggleModal('RoomStatusEdit', true)
  }, [toggleModal])

  return {
    newRoomStatus,
    setNewRoomStatus,
    editRoomStatus,
    setEditRoomStatus,
    handleAddRoomStatus,
    handleUpdateRoomStatus,
    handleEditRoomStatus,
  }
}
