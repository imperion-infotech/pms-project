import { useState, useCallback } from 'react'

/**
 * useFloorManagement - Centralized hook for Floor CRUD operations.
 */
export const useFloorManagement = ({ 
  addFloor, 
  updateFloor, 
  toggleModal 
}) => {
  const [newFloor, setNewFloor] = useState({ name: '', description: '' })
  const [editFloor, setEditFloor] = useState({ id: null, name: '', description: '' })

  const handleAddFloor = useCallback(async () => {
    if (!newFloor.name.trim()) return
    try {
      await addFloor(newFloor)
      setNewFloor({ name: '', description: '' })
      toggleModal('Floor', false)
    } catch (err) {
      console.error('Failed to create floor:', err)
    }
  }, [newFloor, addFloor, toggleModal])

  const handleUpdateFloor = useCallback(async () => {
    if (!editFloor.id || !editFloor.name.trim()) return
    try {
      await updateFloor(editFloor.id, {
        name: editFloor.name,
        description: editFloor.description,
      })
      setEditFloor({ id: null, name: '', description: '' })
      toggleModal('FloorEdit', false)
    } catch (err) {
      console.error('Failed to update floor:', err)
    }
  }, [editFloor, updateFloor, toggleModal])

  const handleEditFloor = useCallback((floor) => {
    setEditFloor({
      id: floor.id,
      name: floor.name || '',
      description: floor.description || '',
    })
    toggleModal('FloorEdit', true)
  }, [toggleModal])

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
