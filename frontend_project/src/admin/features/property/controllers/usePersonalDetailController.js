import { useState, useMemo } from 'react';

/**
 * Controller: usePersonalDetailController
 * Logic for managing individual guest profiles.
 */
const usePersonalDetailController = ({ 
  details, 
  documentDetails = [], 
  stayDetails = [], 
  guestDetails = [],
  documentTypes = [], 
  onDelete 
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
    return documentDetails.find((doc) => String(doc.personalDetailsId) === String(personalDetailsId))
  }

  const getGuestStay = (personalDetailId) => {
    return stayDetails.find((stay) => String(stay.personalDetailId) === String(personalDetailId))
  }

  const getGuestDetail = (personalDetailsId) => {
    return guestDetails.find((gd) => String(gd.personalDetailsId) === String(personalDetailsId))
  }

  const getDocumentTypeName = (documentTypeId) => {
    if (!documentTypeId) return '—'
    const type = documentTypes.find((t) => String(t.id) === String(documentTypeId))
    return type ? type.documentTypeName : '—'
  }

  return {
    stats,
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

export default usePersonalDetailController;
