import { useState, useCallback } from 'react'
import { usePmsRoomTypes } from '../../../../hooks/usePmsRoomTypes'

/**
 * useRoomTypeManagement - Centralized hook for Room Type CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useRoomTypeManagement = ({ toggleModal }) => {
  const { addRoomType, updateRoomType } = usePmsRoomTypes()
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
      toggleModal('roomType', false)
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
      toggleModal('roomTypeEdit', false)
    } catch (err) {
      console.error('Failed to update room type:', err)
    }
  }, [editRoomType, updateRoomType, toggleModal])

  const handleEditRoomType = useCallback(
    (roomType) => {
      setEditRoomType({
        id: roomType.id,
        shortName: roomType.shortName || '',
        roomTypeName: roomType.roomTypeName || '',
        price: roomType.price || '',
      })
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
