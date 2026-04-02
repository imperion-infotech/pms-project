import { useState, useCallback } from 'react'

/**
 * usePersonalDetailManagement - Centralized hook for Guest Personal Detail CRUD operations.
 */
export const usePersonalDetailManagement = ({ 
  addPersonalDetail, 
  updatePersonalDetail, 
  toggleModal 
}) => {
  const [personalFormData, setPersonalFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    companyName: '',
    documentTypeId: '',
    documentNumber: '',
  })
  const [editPersonalDetail, setEditPersonalDetail] = useState(null)

  const handleAddPersonalDetail = useCallback(async () => {
    if (!personalFormData.firstName.trim()) return
    try {
      await addPersonalDetail(personalFormData)
      setPersonalFormData({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        emailAddress: '',
        companyName: '',
        documentTypeId: '',
        documentNumber: '',
      })
      toggleModal('PersonalDetail', false)
    } catch (err) {
      console.error('Failed to create personal detail:', err)
    }
  }, [personalFormData, addPersonalDetail, toggleModal])

  const handleUpdatePersonalDetail = useCallback(async () => {
    if (!editPersonalDetail?.id) return
    try {
      await updatePersonalDetail(editPersonalDetail.id, editPersonalDetail)
      setEditPersonalDetail(null)
      toggleModal('PersonalDetailEdit', false)
    } catch (err) {
      console.error('Failed to update personal detail:', err)
    }
  }, [editPersonalDetail, updatePersonalDetail, toggleModal])

  const handleEditPersonalDetail = useCallback((detail) => {
    setEditPersonalDetail({ ...detail })
    toggleModal('PersonalDetailEdit', true)
  }, [toggleModal])

  return {
    personalFormData,
    setPersonalFormData,
    editPersonalDetail,
    setEditPersonalDetail,
    handleAddPersonalDetail,
    handleUpdatePersonalDetail,
    handleEditPersonalDetail,
  }
}
