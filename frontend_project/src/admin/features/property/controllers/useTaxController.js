import { useState, useMemo } from 'react'

/**
 * Controller: useTaxController
 * Logic for managing tax master records.
 */
const useTaxController = ({ taxes, onDelete, currentPage = 1, itemsPerPage = 8 }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const processedTaxes = useMemo(() => {
    let result = [...taxes]
    const startIndex = (currentPage - 1) * itemsPerPage
    return result.slice(startIndex, startIndex + itemsPerPage)
  }, [taxes, currentPage, itemsPerPage])

  const getIndex = (idx) => (currentPage - 1) * itemsPerPage + idx + 1

  const handleDeleteClick = (tax) => {
    setDeleteTarget({ id: tax.id, name: tax.taxMasterName })
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
    processedTaxes,
    getIndex,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  }
}

export default useTaxController
