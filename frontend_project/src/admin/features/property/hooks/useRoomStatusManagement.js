import { useState, useCallback } from 'react'
import { usePmsRoomStatus } from '../../../../hooks/usePmsRoomStatus'

/**
 * useRoomStatusManagement - Centralized hook for Room Status CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useRoomStatusManagement = ({ toggleModal }) => {
  const { addRoomStatus, updateRoomStatus } = usePmsRoomStatus()
  const [newRoomStatus, setNewRoomStatus] = useState({
    roomStatusName: '',
    roomStatusTitle: '',
    roomStatusColor: '#2798e8',
    roomStatusTextColor: '#ffffff',
  })
  const [editRoomStatus, setEditRoomStatus] = useState(null)

  // Context: Get IDs from localStorage
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  const currentUserId = Number(localStorage.getItem('userId')) || 0

  const handleAddRoomStatus = useCallback(async () => {
    if (!newRoomStatus.roomStatusName.trim()) return
    try {
      const timestamp = new Date().toISOString()

      // Exact alignment with provided JSON schema
      const payload = {
        hotelId: activeHotelId,
        isDeleted: false,
        isActive: true,
        createdBy: currentUserId,
        createdOn: timestamp,
        updatedBy: currentUserId,
        updatedOn: timestamp,
        deletedBy: 0,
        deletedOn: timestamp,
        id: 0,
        roomStatusName: newRoomStatus.roomStatusName,
        roomStatusTitle: newRoomStatus.roomStatusTitle,
        roomStatusColor: newRoomStatus.roomStatusColor,
        roomStatusTextColor: newRoomStatus.roomStatusTextColor,
      }

      console.log('Room Status Create Payload:', payload)
      await addRoomStatus(payload)

      setNewRoomStatus({
        roomStatusName: '',
        roomStatusTitle: '',
        roomStatusColor: '#2798e8',
        roomStatusTextColor: '#ffffff',
      })
      toggleModal('roomStatus', false)
    } catch (err) {
      console.error('Failed to create room status:', err)
    }
  }, [newRoomStatus, addRoomStatus, toggleModal, activeHotelId, currentUserId])

  const handleUpdateRoomStatus = useCallback(async () => {
    if (!editRoomStatus || !editRoomStatus.id || !editRoomStatus.roomStatusName.trim()) return
    try {
      const payload = {
        ...editRoomStatus,
        updatedBy: currentUserId,
        updatedOn: new Date().toISOString(),
      }

      console.log('Room Status Update Payload:', payload)
      await updateRoomStatus(editRoomStatus.id, payload)
      setEditRoomStatus(null)
      toggleModal('roomStatusEdit', false)
    } catch (err) {
      console.error('Failed to update room status:', err)
    }
  }, [editRoomStatus, updateRoomStatus, toggleModal, currentUserId])

  const handleEditRoomStatus = useCallback(
    (status) => {
      setEditRoomStatus({ ...status })
      toggleModal('roomStatusEdit', true)
    },
    [toggleModal],
  )

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
