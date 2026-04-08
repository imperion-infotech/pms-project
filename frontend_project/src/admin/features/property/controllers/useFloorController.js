import { useState, useMemo } from 'react'

/**
 * Controller: useFloorController
 * Logic for managing building levels (floors).
 */
const useFloorController = ({ floors = [], onDelete, currentPage = 1, itemsPerPage = 8 }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const processedFloors = useMemo(() => {
    let result = [...floors]
    const startIndex = (currentPage - 1) * itemsPerPage
    return result.slice(startIndex, startIndex + itemsPerPage)
  }, [floors, currentPage, itemsPerPage])

  const getIndex = (idx) => (currentPage - 1) * itemsPerPage + idx + 1

  const handleDeleteClick = (floor) => {
    setDeleteTarget({ id: floor.id, name: floor.name })
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
    processedFloors,
    getIndex,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  }
}

export default useFloorController
