import { useMemo, useState } from 'react'

/**
 * Controller: useTaxController
 */
const useTaxController = ({ taxes, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const processedTaxes = useMemo(() => {
    if (!Array.isArray(taxes)) return [];
    return [...taxes].sort((a, b) => {
      const idA = Number(a.id);
      const idB = Number(b.id);
      return idB - idA;
    });
  }, [taxes])

  const handleDeleteClick = (tax) => {
    if (tax && tax.id) {
      setDeleteTarget({ id: tax.id, name: tax.taxMasterName })
    }
  }

  const handleConfirmDelete = async () => {
    if (deleteTarget?.id) {
      try {
        await onDelete(deleteTarget.id)
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
    setDeleteTarget(null)
  }

  const handleCancelDelete = () => {
    setDeleteTarget(null)
  }

  return {
    processedTaxes,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  }
}

export default useTaxController
