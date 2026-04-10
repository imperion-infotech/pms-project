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
  const [editRoomStatus, setEditRoomStatus] = useState({
    id: null,
    roomStatusName: '',
    roomStatusTitle: '',
    roomStatusColor: '#2798e8',
    roomStatusTextColor: '#ffffff',
  })

  const handleAddRoomStatus = useCallback(async () => {
    if (!newRoomStatus.roomStatusName.trim()) return
    try {
      await addRoomStatus({
        ...newRoomStatus,
        createdOn: new Date().toISOString(),
      })
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
  }, [newRoomStatus, addRoomStatus, toggleModal])

  const handleUpdateRoomStatus = useCallback(async () => {
    if (!editRoomStatus.id || !editRoomStatus.roomStatusName.trim()) return
    try {
      await updateRoomStatus(editRoomStatus.id, editRoomStatus)
      setEditRoomStatus({
        id: null,
        roomStatusName: '',
        roomStatusTitle: '',
        roomStatusColor: '#2798e8',
        roomStatusTextColor: '#ffffff',
      })
      toggleModal('roomStatusEdit', false)
    } catch (err) {
      console.error('Failed to update room status:', err)
    }
  }, [editRoomStatus, updateRoomStatus, toggleModal])

  const handleEditRoomStatus = useCallback(
    (status) => {
      setEditRoomStatus({
        id: status.id,
        roomStatusName: status.roomStatusName || '',
        roomStatusTitle: status.roomStatusTitle || '',
        roomStatusColor: status.roomStatusColor || '#2798e8',
        roomStatusTextColor: status.roomStatusTextColor || '#ffffff',
      })
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
