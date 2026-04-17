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

  // Helper: Safely extract a numeric/string ID from multiple possible field paths
  const extractId = (...sources) => {
    for (const src of sources) {
      if (src !== null && src !== undefined && src !== '') return String(src)
    }
    return null
  }

  const getGuestDetail = (personalDetailsId) => {
    const targetId = String(personalDetailsId)
    const found = guestDetails.find((gd) => {
      const gdPersonalId = extractId(
        gd.personalDetails?.id,
        gd.personalDetail?.id,
        gd.personalDetailsId,
        gd.personalDetailId,
      )
      return gdPersonalId === targetId
    })
    return found
  }

  const getGuestDocument = (personalDetailsId, guestDetail) => {
    const targetId = String(personalDetailsId)
    const found = documentDetails.find((doc) => {
      // Match 1: document's personalDetails reference matches
      const docPersonalId = extractId(
        doc.personalDetails?.id,
        doc.personalDetail?.id,
        doc.personalDetailsId,
        doc.personalDetailId,
      )
      if (docPersonalId === targetId) return true

      // Match 2: guestDetail's documentDetails reference matches this doc
      const gdDocId = extractId(
        guestDetail?.documentDetails?.id,
        guestDetail?.documentDetailsId,
        guestDetail?.documentDetailId,
        guestDetail?.document_details_id,
      )
      if (gdDocId && String(doc.id) === gdDocId) return true

      return false
    })
    return found
  }

  const getGuestStay = (personalDetailId, guestDetail) => {
    const targetId = String(personalDetailId)
    const found = stayDetails.find((stay) => {
      // Match 1: stay's personalDetails reference matches
      const stayPersonalId = extractId(
        stay.personalDetails?.id,
        stay.personalDetail?.id,
        stay.personalDetailId,
        stay.personalDetailsId,
      )
      if (stayPersonalId === targetId) return true

      // Match 2: guestDetail's stayDetails reference matches this stay
      const gdStayId = extractId(
        guestDetail?.stayDetails?.id,
        guestDetail?.stayDetailsId,
        guestDetail?.stayDetailId,
        guestDetail?.stay_details_id,
      )
      if (gdStayId && String(stay.id) === gdStayId) return true

      return false
    })
    return found
  }

  const getRentDetail = (guestDetail) => {
    if (!guestDetail) return null
    const rentId = extractId(
      guestDetail.rentDetails?.id,
      guestDetail.rentDetailsId,
      guestDetail.rentDetailId,
      guestDetail.rent_details_id,
      guestDetail.rentId,
    )
    if (!rentId) return null
    // Note: rentDetails array not passed to controller - lookup done in component
    return rentId
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
    getRentDetail,
    getDocumentTypeName,
  }
}

export default useGuestPersonalDetailsController
