import { useMemo, useState } from 'react';

/**
 * Controller: useRoomStatusController
 */
const useRoomStatusController = ({ roomStatuses, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const processedStatuses = useMemo(() => {
    return [...roomStatuses].sort((a, b) => b.id - a.id);
  }, [roomStatuses]);

  const handleDeleteClick = (status) => {
    setDeleteTarget({ id: status.id, name: status.roomStatusName });
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
