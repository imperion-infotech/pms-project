import { useState, useMemo } from 'react';

/**
 * Controller: useRoomStatusController
 * Logic for managing room operational states.
 */
const useRoomStatusController = ({ roomStatuses, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const processedStatuses = useMemo(() => {
    return [...roomStatuses];
  }, [roomStatuses]);

  const handleDeleteClick = (status) => {
    setDeleteTarget({ 
      id: status.id, 
      name: status.roomStatusName || status.roomStatusTitle 
    });
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
    processedStatuses,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default useRoomStatusController;
