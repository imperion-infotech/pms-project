import { useState, useCallback } from 'react'

/**
 * useRoomTypeManagement - Centralized hook for Room Type CRUD operations.
 */
export const useRoomTypeManagement = ({ 
  addRoomType, 
  updateRoomType, 
  toggleModal 
}) => {
  const [newRoomType, setNewRoomType] = useState({ shortName: '', roomTypeName: '', price: '' })
  const [editRoomType, setEditRoomType] = useState({
    id: null,
    shortName: '',
    roomTypeName: '',
    price: '',
  })

  const handleAddRoomType = useCallback(async () => {
    if (!newRoomType.roomTypeName.trim()) return
    try {
      await addRoomType(newRoomType)
      setNewRoomType({ shortName: '', roomTypeName: '', price: '' })
      toggleModal('RoomType', false)
    } catch (err) {
      console.error('Failed to create room type:', err)
    }
  }, [newRoomType, addRoomType, toggleModal])

  const handleUpdateRoomType = useCallback(async () => {
    if (!editRoomType.id || !editRoomType.roomTypeName.trim()) return
    try {
      await updateRoomType(editRoomType.id, {
        shortName: editRoomType.shortName,
        roomTypeName: editRoomType.roomTypeName,
        price: editRoomType.price,
      })
      setEditRoomType({ id: null, shortName: '', roomTypeName: '', price: '' })
      toggleModal('RoomTypeEdit', false)
    } catch (err) {
      console.error('Failed to update room type:', err)
    }
  }, [editRoomType, updateRoomType, toggleModal])

  const handleEditRoomType = useCallback((roomType) => {
    setEditRoomType({
      id: roomType.id,
      shortName: roomType.shortName || '',
      roomTypeName: roomType.roomTypeName || '',
      price: roomType.price || '',
    })
    toggleModal('RoomTypeEdit', true)
  }, [toggleModal])

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
