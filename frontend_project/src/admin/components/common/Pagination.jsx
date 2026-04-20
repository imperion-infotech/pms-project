/**
 * Pagination.jsx (Admin Domain -> Common components)
 *
 * A reusable pagination bar placed at the bottom of data tables to navigate between huge chunks of data.
 */
// Common UI elements - Pagination component
const Pagination = ({
  activeItem,
  floors,
  buildings,
  roomTypes,
  rooms,
  roomStatuses,
  personalDetails,
  taxes,
  documentTypes,
  paymentTypes,
  otherCharges,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  const getDataLength = () => {
    switch (activeItem) {
      case 'Floor':
        return floors.length
      case 'Building':
        return buildings ? buildings.length : 0
      case 'Room Type':
        return roomTypes.length
      case 'Room':
        return rooms.length
      case 'Room Status':
        return roomStatuses.length
      case 'Tax':
        return taxes ? taxes.length : 0
      case 'Personal Detail':
        return personalDetails ? personalDetails.length : 0
      case 'Document Type':
        return documentTypes ? documentTypes.length : 0
      case 'Payment Type':
        return paymentTypes ? paymentTypes.length : 0
      case 'Other Charge':
        return otherCharges ? otherCharges.length : 0
      default:
        return 0
    }
  }

  const totalRecords = getDataLength()
  const totalPages = Math.ceil(totalRecords / itemsPerPage)

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  return (
    <div className="dark:bg-surface-100 mt-4 flex min-h-[72px] flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 px-8 text-slate-800 shadow-md transition-colors duration-300 sm:flex-row dark:border-slate-800 dark:text-white dark:shadow-xl">
      {isLoading ? (
        <div className="flex w-full animate-pulse items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
            <div className="h-10 w-24 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold tracking-widest text-[#64748b] uppercase dark:text-slate-400">
              Showing {totalRecords} {activeItem} Records
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="rounded-lg bg-slate-100 px-5 py-2 text-pms-tiny font-black tracking-tighter text-slate-500 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              PREVIOUS
            </button>
            <div className="flex items-center gap-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-xs font-black text-white shadow-lg shadow-emerald-500/20">
                {currentPage}
              </span>
              <span className="px-2 text-pms-tiny font-bold text-slate-400">
                OF {totalPages || 1}
              </span>
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="rounded-lg bg-slate-100 px-5 py-2 text-pms-tiny font-black tracking-tighter text-slate-500 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              NEXT
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Pagination
