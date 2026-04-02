import { useState, useMemo } from 'react';

/**
 * Controller: useDocumentTypeController
 * Logic for managing document types.
 */
const useDocumentTypeController = ({ documentTypes, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const processedDocumentTypes = useMemo(() => {
    return [...documentTypes];
  }, [documentTypes]);

  const handleDeleteClick = (dt) => {
    setDeleteTarget({ id: dt.id, name: dt.documentTypeName });
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
    processedDocumentTypes,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default useDocumentTypeController;
