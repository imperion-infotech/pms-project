/**
 * Pagination.jsx (Admin Domain -> Common components)
 * 
 * A reusable pagination bar placed at the bottom of data tables to navigate between huge chunks of data.
 */
// Common UI elements - Pagination component
const Pagination = ({ activeItem, floors, buildings, roomTypes, rooms, roomStatuses, personalDetails, taxes, documentTypes, isLoading, currentPage, itemsPerPage, onPageChange }) => {
  const getDataLength = () => {
    switch (activeItem) {
      case 'Floor': return floors.length;
      case 'Building': return buildings ? buildings.length : 0;
      case 'Room Type': return roomTypes.length;
      case 'Room': return rooms.length;
      case 'Room Status': return roomStatuses.length;
      case 'Tax': return taxes ? taxes.length : 0;
      case 'Personal Detail': return personalDetails ? personalDetails.length : 0;
      case 'Document Type': return documentTypes ? documentTypes.length : 0;
      default: return 0;
    }
  };

  const totalRecords = getDataLength();
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="bg-white dark:bg-surface-100 text-slate-800 dark:text-white p-4 px-8 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md dark:shadow-xl mt-4 min-h-[72px] border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {isLoading ? (
        <div className="w-full flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-10 w-24 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#64748b] dark:text-slate-400">
              Showing {totalRecords} {activeItem} Records
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-tighter transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              PREVIOUS
            </button>
            <div className="flex items-center gap-1">
              <span className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-lg text-xs font-black shadow-lg shadow-emerald-500/20">{currentPage}</span>
              <span className="text-[10px] font-bold text-slate-400 px-2">OF {totalPages || 1}</span>
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-tighter transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              NEXT
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;
