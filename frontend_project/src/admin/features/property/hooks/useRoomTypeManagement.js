import { useState, useCallback } from 'react'
import { usePmsRoomTypes } from '../../../../hooks/usePmsRoomTypes'

/**
 * useRoomTypeManagement - Centralized hook for Room Type CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useRoomTypeManagement = ({ toggleModal }) => {
  const { addRoomType, updateRoomType } = usePmsRoomTypes()
  const [newRoomType, setNewRoomType] = useState({ shortName: '', roomTypeName: '', price: '' })
  const [editRoomType, setEditRoomType] = useState(null)

  // Context: Get IDs from localStorage
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  const currentUserId = Number(localStorage.getItem('userId')) || 0

  const handleAddRoomType = useCallback(async () => {
    if (!newRoomType.roomTypeName.trim()) return
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
        shortName: newRoomType.shortName,
        roomTypeName: newRoomType.roomTypeName,
        price: Number(newRoomType.price) || 0,
      }

      console.log('Room Type Create Payload:', payload)
      await addRoomType(payload)
      
      setNewRoomType({ shortName: '', roomTypeName: '', price: '' })
      toggleModal('roomType', false)
    } catch (err) {
      console.error('Failed to create room type:', err)
    }
  }, [newRoomType, addRoomType, toggleModal, activeHotelId, currentUserId])

  const handleUpdateRoomType = useCallback(async () => {
    if (!editRoomType || !editRoomType.id || !editRoomType.roomTypeName.trim()) return
    try {
      const payload = {
        ...editRoomType,
        price: Number(editRoomType.price) || 0,
        updatedBy: currentUserId,
        updatedOn: new Date().toISOString(),
      }

      console.log('Room Type Update Payload:', payload)
      await updateRoomType(editRoomType.id, payload)
      setEditRoomType(null)
      toggleModal('roomTypeEdit', false)
    } catch (err) {
      console.error('Failed to update room type:', err)
    }
  }, [editRoomType, updateRoomType, toggleModal, currentUserId])

  const handleEditRoomType = useCallback(
    (roomType) => {
      setEditRoomType({ ...roomType })
      toggleModal('roomTypeEdit', true)
    },
    [toggleModal],
  )

  return {
    newRoomType,
    setNewRoomType,
    editRoomType,
    setEditRoomType,
    handleAddRoomType,
    handleUpdateRoomType,
    handleEditRoomType,
  }
}
