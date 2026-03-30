import { useMemo, useState } from 'react';

/**
 * Controller: useRoomTypeController
 */
const useRoomTypeController = ({ roomTypes, onDelete, userRole }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isAdmin = useMemo(() => {
    return ['ROLE_ADMIN', 'ADMIN'].includes(userRole?.toUpperCase());
  }, [userRole]);

  const processedRoomTypes = useMemo(() => {
    return [...roomTypes].sort((a, b) => b.id - a.id);
  }, [roomTypes]);

  const handleDeleteClick = (roomType) => {
    setDeleteTarget({ id: roomType.id, name: roomType.roomTypeName });
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
    processedRoomTypes,
    isAdmin,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default useRoomTypeController;
