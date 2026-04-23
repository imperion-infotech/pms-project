import { useState, useCallback } from 'react'
import { usePmsFloors } from '../../../../hooks/usePmsFloors'

/**
 * useFloorManagement - Centralized hook for Floor CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useFloorManagement = ({ toggleModal }) => {
  const { addFloor, updateFloor } = usePmsFloors()
  const [newFloor, setNewFloor] = useState({ name: '', description: '' })
  const [editFloor, setEditFloor] = useState(null)

  // Context: Get IDs from localStorage
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  console.log('activeHotelId', activeHotelId)
  const currentUserId = Number(localStorage.getItem('userId')) || 0
  console.log('currentUserId', currentUserId)

  const handleAddFloor = useCallback(async () => {
    if (!newFloor.name.trim()) return

    console.log('Sending Floor Create Request for Hotel:', activeHotelId)

    try {
      const timestamp = new Date().toISOString()

      // Perfect Payload for Admin/Super Admin
      const payload = {
        hotelId: Number(activeHotelId),
        isDeleted: false,
        isActive: true,
        createdBy: currentUserId,
        createdOn: timestamp,
        updatedBy: currentUserId,
        updatedOn: timestamp,
        deletedBy: 0,
        deletedOn: timestamp,
        id: 0,
        name: newFloor.name,
        description: newFloor.description,
        noOfRooms: 0,
      }

      console.log('Floor Create Payload:', payload)
      await addFloor(payload)

      setNewFloor({ name: '', description: '' })
      toggleModal('floor', false)
    } catch (err) {
      console.error('Failed to create floor:', err)
    }
  }, [newFloor, addFloor, toggleModal, activeHotelId, currentUserId])

  const handleUpdateFloor = useCallback(async () => {
    if (!editFloor || !editFloor.id || !editFloor.name.trim()) return

    try {
      const payload = {
        ...editFloor,
        updatedBy: currentUserId,
        updatedOn: new Date().toISOString(),
      }

      await updateFloor(editFloor.id, payload)
      setEditFloor(null)
      toggleModal('floorEdit', false)
    } catch (err) {
      console.error('Failed to update floor:', err)
    }
  }, [editFloor, updateFloor, toggleModal, currentUserId])

  const handleEditFloor = useCallback(
    (floor) => {
      // Store full floor object to prevent metadata loss
      setEditFloor({ ...floor })
      toggleModal('floorEdit', true)
    },
    [toggleModal],
  )

  return {
    newFloor,
    setNewFloor,
    editFloor,
    setEditFloor,
    handleAddFloor,
    handleUpdateFloor,
    handleEditFloor,
  }
}
