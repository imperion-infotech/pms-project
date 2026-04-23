import { useState, useCallback } from 'react'
import { usePmsBuildings } from '../../../../hooks/usePmsBuildings'

/**
 * useBuildingManagement - Centralized hook for Building CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useBuildingManagement = ({ toggleModal }) => {
  const { addBuilding, updateBuilding } = usePmsBuildings()
  const [newBuilding, setNewBuilding] = useState({ name: '', description: '' })
  const [editBuilding, setEditBuilding] = useState(null)

  // Get active hotel ID and current user ID for payload
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  console.log('activeHotelId', activeHotelId)

  const storedUserId = localStorage.getItem('userId')
  const currentUserId = storedUserId && !isNaN(Number(storedUserId)) ? Number(storedUserId) : 1 // Default to 1 instead of 0 if NaN
  console.log('currentUserId', currentUserId)
  console.log('Stored User ID', storedUserId)

  const handleAddBuilding = useCallback(async () => {
    if (!newBuilding.name.trim()) return

    // Debug log for 403 troubleshooting
    console.log('Sending Building Create Request for Hotel:', activeHotelId)

    try {
      const currentTimestamp = new Date().toISOString()

      // Perfect Payload for Admin/Super Admin
      const payload = {
        hotelId: Number(activeHotelId),
        isDeleted: false,
        isActive: true,
        createdBy: currentUserId,
        createdOn: currentTimestamp,
        updatedBy: currentUserId,
        updatedOn: currentTimestamp,
        deletedBy: 0,
        deletedOn: currentTimestamp,
        id: 0,
        name: newBuilding.name,
        description: newBuilding.description,
      }

      console.log('Building Create Payload:', payload)
      await addBuilding(payload)

      setNewBuilding({ name: '', description: '' })
      toggleModal('building', false)
    } catch (err) {
      console.error('Failed to create building:', err)
      // Throw error to be caught by mutation if needed or keep local logging
    }
  }, [newBuilding, addBuilding, toggleModal, activeHotelId, currentUserId])

  const handleUpdateBuilding = useCallback(async () => {
    if (!editBuilding || !editBuilding.id || !editBuilding.name.trim()) return
    try {
      // Preserve existing fields and update name/description/updatedOn/updatedBy
      const payload = {
        ...editBuilding,
        updatedBy: currentUserId,
        updatedOn: new Date().toISOString(),
      }

      console.log('Updating Building:', payload)
      await updateBuilding(editBuilding.id, payload)
      setEditBuilding(null)
      toggleModal('buildingEdit', false)
    } catch (err) {
      console.error('Failed to update building:', err)
    }
  }, [editBuilding, updateBuilding, toggleModal, currentUserId])

  const handleEditBuilding = useCallback(
    (building) => {
      // Store full building object to avoid losing metadata
      setEditBuilding({ ...building })
      toggleModal('buildingEdit', true)
    },
    [toggleModal],
  )

  return {
    newBuilding,
    setNewBuilding,
    editBuilding,
    setEditBuilding,
    handleAddBuilding,
    handleUpdateBuilding,
    handleEditBuilding,
  }
}
