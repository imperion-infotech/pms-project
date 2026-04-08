import { useState, useMemo } from 'react'

/**
 * Controller: useDocumentTypeController
 * Logic for managing document types.
 */
const useDocumentTypeController = ({
  documentTypes,
  onDelete,
  currentPage = 1,
  itemsPerPage = 8,
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const processedDocumentTypes = useMemo(() => {
    let result = [...documentTypes]
    const startIndex = (currentPage - 1) * itemsPerPage
    return result.slice(startIndex, startIndex + itemsPerPage)
  }, [documentTypes, currentPage, itemsPerPage])

  const getIndex = (idx) => (currentPage - 1) * itemsPerPage + idx + 1

  const handleDeleteClick = (dt) => {
    setDeleteTarget({ id: dt.id, name: dt.documentTypeName })
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
    processedDocumentTypes,
    getIndex,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  }
}

export default useDocumentTypeController
