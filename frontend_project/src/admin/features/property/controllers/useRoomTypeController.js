import { useState, useMemo } from 'react'

/**
 * Controller: useRoomTypeController
 * Logic for managing room categories.
 */
const useRoomTypeController = ({ roomTypes, onDelete, currentPage = 1, itemsPerPage = 8 }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const processedRoomTypes = useMemo(() => {
    let result = [...roomTypes]
    const startIndex = (currentPage - 1) * itemsPerPage
    return result.slice(startIndex, startIndex + itemsPerPage)
  }, [roomTypes, currentPage, itemsPerPage])

  const getIndex = (idx) => (currentPage - 1) * itemsPerPage + idx + 1

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
    getIndex,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  }
}

export default useRoomTypeController
