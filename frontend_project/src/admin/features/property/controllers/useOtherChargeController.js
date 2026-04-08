import { useMemo } from 'react'

export const useOtherChargeController = ({ otherCharges, currentPage, itemsPerPage }) => {
  const processedOtherCharges = useMemo(() => {
    if (!otherCharges) return []
    const startIndex = (currentPage - 1) * itemsPerPage
    return otherCharges.slice(startIndex, startIndex + itemsPerPage)
  }, [otherCharges, currentPage, itemsPerPage])

  const getIndex = (idx) => {
    return (currentPage - 1) * itemsPerPage + idx + 1
  }

  return {
    processedOtherCharges,
    getIndex,
  }
}
