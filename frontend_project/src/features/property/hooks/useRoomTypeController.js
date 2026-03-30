import { useMemo, useState } from 'react';

/**
 * Controller: useRoomTypeController
 * Handles logic for room type management, specifically delete confirmation state.
 */
const useRoomTypeController = ({ roomTypes, onDelete, userRole }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isAdmin = useMemo(() => {
    // Check for both common role formats
    return ['ROLE_ADMIN', 'ADMIN'].includes(userRole?.toUpperCase());
  }, [userRole]);

  // Sort room types by ID descending to show newest first
  const processedRoomTypes = useMemo(() => {
    if (!roomTypes || !Array.isArray(roomTypes)) return [];
    return [...roomTypes].sort((a, b) => b.id - a.id);
  }, [roomTypes]);

  const handleDeleteClick = (roomType) => {
    setDeleteTarget({ 
      id: roomType.id, 
      name: roomType.roomTypeName || roomType.name || 'Untitled Room Type' 
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
    processedRoomTypes,
    isAdmin,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default useRoomTypeController;
