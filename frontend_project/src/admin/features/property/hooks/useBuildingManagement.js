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

  // Get active hotel ID for payload
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0

  const handleAddBuilding = useCallback(async () => {
    if (!newBuilding.name.trim()) return

    // Debug log for 403 troubleshooting
    console.log('Sending Building Create Request for Hotel:', activeHotelId)

    try {
      const currentTimestamp = new Date().toISOString()
      const currentUserId = Number(localStorage.getItem('userId')) || 0

      // Exact alignment with requested JSON schema to avoid 403/400
      const payload = {
        hotelId: Number(activeHotelId),
        isDeleted: false, // Changed from user's 'true' example as creation should be active
        isActive: true,
        createdBy: currentUserId, // Matching user's JSON example
        createdOn: currentTimestamp,
        updatedBy: currentUserId,
        updatedOn: currentTimestamp,
        deletedBy: currentUserId,
        deletedOn: currentTimestamp,
        id: 0,
        name: newBuilding.name,
        description: newBuilding.description,
      }

      console.log('Building Payload:', payload)
      await addBuilding(payload)

      setNewBuilding({ name: '', description: '' })
      toggleModal('building', false)
    } catch (err) {
      console.error('Failed to create building:', err)
      // Throw error to be caught by mutation if needed or keep local logging
    }
  }, [newBuilding, addBuilding, toggleModal, activeHotelId])

  const handleUpdateBuilding = useCallback(async () => {
    if (!editBuilding || !editBuilding.id || !editBuilding.name.trim()) return
    try {
      // Preserve existing fields and update name/description/updatedOn
      const payload = {
        ...editBuilding,
        updatedBy: 1,
        updatedOn: new Date().toISOString(),
      }
      await updateBuilding(editBuilding.id, payload)
      setEditBuilding(null)
      toggleModal('buildingEdit', false)
    } catch (err) {
      console.error('Failed to update building:', err)
    }
  }, [editBuilding, updateBuilding, toggleModal])

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
