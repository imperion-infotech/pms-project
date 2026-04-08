import { useState, useMemo } from 'react'

/**
 * Controller: usePaymentTypeController
 * Logic for managing payment types.
 */
const usePaymentTypeController = ({
  paymentTypes,
  onDelete,
  currentPage = 1,
  itemsPerPage = 8,
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const processedPaymentTypes = useMemo(() => {
    let result = [...paymentTypes]
    const startIndex = (currentPage - 1) * itemsPerPage
    return result.slice(startIndex, startIndex + itemsPerPage)
  }, [paymentTypes, currentPage, itemsPerPage])

  const getIndex = (idx) => (currentPage - 1) * itemsPerPage + idx + 1

  const handleDeleteClick = (pt) => {
    setDeleteTarget({ id: pt.id, name: pt.paymentTypeName })
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
    processedPaymentTypes,
    getIndex,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  }
}

export default usePaymentTypeController
