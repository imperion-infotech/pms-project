import { useState, useCallback } from 'react'
import { usePmsFloors } from '../../../../hooks/usePmsFloors'

/**
 * useFloorManagement - Centralized hook for Floor CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useFloorManagement = ({ toggleModal }) => {
  const { addFloor, updateFloor } = usePmsFloors()
  const [newFloor, setNewFloor] = useState({ name: '', description: '' })
  const [editFloor, setEditFloor] = useState({ id: null, name: '', description: '' })

  const handleAddFloor = useCallback(async () => {
    if (!newFloor.name.trim()) return
    try {
      await addFloor(newFloor)
      setNewFloor({ name: '', description: '' })
      toggleModal('floor', false)
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
      toggleModal('floorEdit', false)
    } catch (err) {
      console.error('Failed to update floor:', err)
    }
  }, [editFloor, updateFloor, toggleModal])

  const handleEditFloor = useCallback(
    (floor) => {
      setEditFloor({
        id: floor.id,
        name: floor.name || '',
        description: floor.description || '',
      })
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
