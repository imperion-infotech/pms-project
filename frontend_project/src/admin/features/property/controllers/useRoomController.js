import { useState, useMemo } from 'react'

/**
 * Controller: useRoomController
 *
 * Logic for managing individual room table entries, searching results locally,
 * and handling UI states like deletion confirmation.
 */
export const useRoomController = ({ rooms, searchTerm, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Industrial Standard Optimization: Filter results locally for UI feedback while waiting for sync
  const processedRooms = useMemo(() => {
    let result = Array.isArray(rooms) ? [...rooms] : []

    // Local filter if searchTerm is provided
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(
        (r) =>
          (r.roomName && String(r.roomName).toLowerCase().includes(lowerSearch)) ||
          (r.roomStatus && String(r.roomStatus).toLowerCase().includes(lowerSearch)),
      )
    }

    return result
  }, [rooms, searchTerm])

  const handleDeleteClick = (room) => {
    setDeleteTarget({ id: room.id, name: room.roomName })
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
    processedRooms,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  }
}

export default useRoomController
