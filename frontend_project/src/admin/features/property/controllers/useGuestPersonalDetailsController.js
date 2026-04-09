import { useState, useMemo } from 'react'

/**
 * Controller: usePersonalDetailController
 * Logic for managing individual guest profiles.
 */
const useGuestPersonalDetailsController = ({
  details,
  documentDetails = [],
  stayDetails = [],
  guestDetails = [],
  documentTypes = [],
  onDelete,
  currentPage = 1,
  itemsPerPage = 8,
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const stats = useMemo(
    () => [
      { label: 'Total Guests', value: details.length },
      { label: 'Corporate Accounts', value: details.filter((d) => d.companyName).length },
      { label: 'Premium Users', value: Math.floor(details.length * 0.4) }, // Placeholder logic
      { label: 'Active Profiles', value: details.length },
    ],
    [details],
  )

  const processedDetails = useMemo(() => {
    let result = [...details]
    const startIndex = (currentPage - 1) * itemsPerPage
    return result.slice(startIndex, startIndex + itemsPerPage)
  }, [details, currentPage, itemsPerPage])

  const getIndex = (idx) => (currentPage - 1) * itemsPerPage + idx + 1

  const cleanImageUrl = (path) => {
    if (!path || path === 'photo' || path === 'sign') return null
    let cleanPath = String(path)
    if (cleanPath.includes(': ')) cleanPath = cleanPath.split(': ')[1].trim()
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1)
    const parts = cleanPath.split('/')
    return parts[parts.length - 1]
  }

  const handleDeleteClick = (guest) => {
    setDeleteTarget({ id: guest.id, name: `${guest.firstName} ${guest.lastName}` })
  }

  const handleConfirmDelete = () => {
    if (deleteTarget?.id) {
      onDelete(deleteTarget.id)
    }
    setDeleteTarget(null)
  }

  const handleCancelDelete = () => {
    setDeleteTarget(null)
  }

  const getGuestDocument = (personalDetailsId) => {
    return documentDetails.find(
      (doc) =>
        String(
          doc.personalDetails?.id ||
            doc.personalDetail?.id ||
            doc.personalDetailsId ||
            doc.personalDetailId,
        ) === String(personalDetailsId),
    )
  }

  const getGuestStay = (personalDetailId) => {
    return stayDetails.find(
      (stay) =>
        String(
          stay.personalDetails?.id ||
            stay.personalDetail?.id ||
            stay.personalDetailId ||
            stay.personalDetailsId,
        ) === String(personalDetailId),
    )
  }

  const getGuestDetail = (personalDetailsId) => {
    return guestDetails.find(
      (gd) =>
        String(
          gd.personalDetails?.id ||
            gd.personalDetail?.id ||
            gd.personalDetailsId ||
            gd.personalDetailId,
        ) === String(personalDetailsId),
    )
  }

  const getDocumentTypeName = (documentTypeId) => {
    if (!documentTypeId) return '—'
    const type = documentTypes.find((t) => String(t.id) === String(documentTypeId))
    return type ? type.documentTypeName : '—'
  }

  return {
    stats,
    processedDetails,
    getIndex,
    cleanImageUrl,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    getGuestDocument,
    getGuestStay,
    getGuestDetail,
    getDocumentTypeName,
  }
}

export default useGuestPersonalDetailsController
