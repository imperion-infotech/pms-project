import { useState, useCallback } from 'react'

/**
 * useBuildingManagement - Centralized hook for Building CRUD operations.
 */
export const useBuildingManagement = ({ 
  addBuilding, 
  updateBuilding, 
  toggleModal 
}) => {
  const [newBuilding, setNewBuilding] = useState({ name: '', description: '' })
  const [editBuilding, setEditBuilding] = useState({ id: null, name: '', description: '' })

  const handleAddBuilding = useCallback(async () => {
    if (!newBuilding.name.trim()) return
    try {
      await addBuilding(newBuilding)
      setNewBuilding({ name: '', description: '' })
      toggleModal('building', false)
    } catch (err) {
      console.error('Failed to create building:', err)
    }
  }, [newBuilding, addBuilding, toggleModal])

  const handleUpdateBuilding = useCallback(async () => {
    if (!editBuilding.id || !editBuilding.name.trim()) return
    try {
      await updateBuilding(editBuilding.id, {
        name: editBuilding.name,
        description: editBuilding.description,
      })
      setEditBuilding({ id: null, name: '', description: '' })
      toggleModal('buildingEdit', false)
    } catch (err) {
      console.error('Failed to update building:', err)
    }
  }, [editBuilding, updateBuilding, toggleModal])

  const handleEditBuilding = useCallback((building) => {
    setEditBuilding({
      id: building.id,
      name: building.name || '',
      description: building.description || '',
    })
    toggleModal('buildingEdit', true)
  }, [toggleModal])

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
