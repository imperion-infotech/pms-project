import { useState, useMemo } from 'react'

/**
 * Controller: useRoomTypeController
 * Logic for managing room categories.
 */
const useRoomTypeController = ({ roomTypes, onDelete, userRole }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const processedRoomTypes = useMemo(() => {
    return [...roomTypes]
  }, [roomTypes])

  const isAdmin = useMemo(() => {
    return userRole === 'ROLE_ADMIN' || userRole === 'ADMIN'
  }, [userRole])

  const handleDeleteClick = (room) => {
    setDeleteTarget({ id: room.id, name: room.roomTypeName })
  }

  const handleConfirmDelete = () => {
    if (deleteTarget?.id) {
      onDelete(deleteTarget.id)
    }
    setDeleteTarget(null)
  }

  const handleCancelDelete = () => {
    setDeleteTarget(null)
  }

  return {
    processedRoomTypes,
    isAdmin,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  }
}

export default useRoomTypeController
