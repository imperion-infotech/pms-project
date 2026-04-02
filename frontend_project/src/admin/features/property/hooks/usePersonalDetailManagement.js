import { useState, useCallback } from 'react'

/**
 * usePersonalDetailManagement - Centralized hook for Guest Personal Detail CRUD operations.
 */
export const usePersonalDetailManagement = ({
  addPersonalDetail,
  updatePersonalDetail,
  toggleModal,
}) => {
  const [personalFormData, setPersonalFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    phone: '',
    address: '',
    companyName: '',
    documentTypeId: '',
    documentNumber: '',
    profilePhoto: '',
    signature: '',
  })
  const [editPersonalFormData, setEditPersonalFormData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    phone: '',
    address: '',
    companyName: '',
    documentTypeId: '',
    documentNumber: '',
    profilePhoto: '',
    signature: '',
  })

  const handleAddPersonalDetail = useCallback(async () => {
    if (!personalFormData.firstName.trim()) return
    try {
      await addPersonalDetail(personalFormData)
      setPersonalFormData({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        phone: '',
        address: '',
        companyName: '',
        documentTypeId: '',
        documentNumber: '',
        profilePhoto: '',
        signature: '',
      })
      toggleModal('personalDetail', false)
    } catch (err) {
      console.error('Failed to create personal detail:', err)
    }
  }, [personalFormData, addPersonalDetail, toggleModal])

  const handleUpdatePersonalDetail = useCallback(async () => {
    if (!editPersonalFormData?.id) return
    try {
      await updatePersonalDetail(editPersonalFormData.id, editPersonalFormData)
      setEditPersonalFormData({ id: null })
      toggleModal('personalDetailEdit', false)
    } catch (err) {
      console.error('Failed to update personal detail:', err)
    }
  }, [editPersonalFormData, updatePersonalDetail, toggleModal])

  const handleEditPersonalDetail = useCallback(
    (detail) => {
      setEditPersonalFormData({ ...detail })
      toggleModal('personalDetailEdit', true)
    },
    [toggleModal],
  )

  return {
    personalFormData,
    setPersonalFormData,
    editPersonalFormData,
    setEditPersonalFormData,
    handleAddPersonalDetail,
    handleUpdatePersonalDetail,
    handleEditPersonalDetail,
  }
}
