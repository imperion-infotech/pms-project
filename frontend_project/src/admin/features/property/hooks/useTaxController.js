import { useState, useMemo } from 'react';

/**
 * Controller: useTaxController
 * Logic for managing tax master records.
 */
const useTaxController = ({ taxes, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const processedTaxes = useMemo(() => {
    return [...taxes];
  }, [taxes]);

  const handleDeleteClick = (tax) => {
    setDeleteTarget({ id: tax.id, name: tax.taxMasterName });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget?.id) {
      onDelete(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return {
    processedTaxes,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default useTaxController;
