import { useState } from 'react';

/**
 * Controller: useFloorController
 * Logic for managing building levels (floors).
 */
const useFloorController = ({ onDelete, currentPage = 1, itemsPerPage = 8 }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const getIndex = (idx) => ((currentPage - 1) * itemsPerPage) + idx + 1;

  const handleDeleteClick = (floor) => {
    setDeleteTarget({ id: floor.id, name: floor.name });
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
    getIndex,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default useFloorController;
