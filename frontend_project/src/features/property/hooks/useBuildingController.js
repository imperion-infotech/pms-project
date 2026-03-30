import { useMemo, useState } from 'react';

/**
 * Controller: useBuildingController
 */
const useBuildingController = ({ buildings, searchTerm, onDelete, currentPage, itemsPerPage }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const processedBuildings = useMemo(() => {
    let result = [...buildings];
    if (searchTerm) {
      result = result.filter(b => 
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result.sort((a, b) => b.id - a.id);
  }, [buildings, searchTerm]);

  const getIndex = (idx) => ((currentPage - 1) * itemsPerPage) + idx + 1;

  const handleDeleteClick = (building) => {
    setDeleteTarget({ id: building.id, name: building.name });
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
    processedBuildings,
    getIndex,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default useBuildingController;
