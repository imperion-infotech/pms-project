import { useMemo } from 'react';

/**
 * Controller: useFloorController
 * Handles floor-specific business logic and data aggregation.
 */
const useFloorController = ({ floors, currentPage, itemsPerPage }) => {
  
  const processedFloors = useMemo(() => {
    return [...floors].sort((a, b) => b.id - a.id);
  }, [floors]);

  const getIndex = (idx) => ((currentPage - 1) * itemsPerPage) + idx + 1;

  return {
    processedFloors,
    getIndex,
    totalCount: floors.length
  };
};

export default useFloorController;
