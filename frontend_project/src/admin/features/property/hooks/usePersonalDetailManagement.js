import { useState, useCallback } from 'react'

/**
 * usePersonalDetailManagement - Centralized hook for Guest Personal Detail CRUD operations.
 */
export const usePersonalDetailManagement = ({
  addPersonalDetail,
  updatePersonalDetail,
  addDocumentDetail,
  updateDocumentDetail,
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
    profilePhoto: '',
    signature: '',
    // Document Details
    documentNumber: '',
    validTill: '',
    remark: '',
    documentTypeId: '',
    frontImagePath: '',
    backImagePath: '',
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
    profilePhoto: '',
    signature: '',
    // Document Details
    documentId: null, // To track existing document
    documentNumber: '',
    validTill: '',
    remark: '',
    documentTypeId: '',
    frontImagePath: '',
    backImagePath: '',
  })

  const handleAddPersonalDetail = useCallback(async () => {
    if (!personalFormData.firstName.trim()) return
    try {
      // 1. Create Personal Detail
      const res = await addPersonalDetail({
        firstName: personalFormData.firstName,
        lastName: personalFormData.lastName,
        mobileNumber: personalFormData.mobileNumber,
        email: personalFormData.email,
        phone: personalFormData.phone,
        address: personalFormData.address,
        companyName: personalFormData.companyName,
        profilePhoto: personalFormData.profilePhoto,
        signature: personalFormData.signature,
      })

      const personalDetailsId = res.data.id || res.data

      // 2. Create Document Detail if info provided
      if (personalFormData.documentNumber || personalFormData.documentTypeId) {
        await addDocumentDetail({
          documentNumber: personalFormData.documentNumber,
          validTill: personalFormData.validTill,
          remark: personalFormData.remark,
          personalDetailsId: personalDetailsId,
          documentTypeId: personalFormData.documentTypeId,
          frontImagePath: personalFormData.frontImagePath,
          backImagePath: personalFormData.backImagePath,
        })
      }

      setPersonalFormData({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        phone: '',
        address: '',
        companyName: '',
        profilePhoto: '',
        signature: '',
        documentNumber: '',
        validTill: '',
        remark: '',
        documentTypeId: '',
        frontImagePath: '',
        backImagePath: '',
      })
      toggleModal('personalDetail', false)
    } catch (err) {
      console.error('Failed to create personal detail / document:', err)
    }
  }, [personalFormData, addPersonalDetail, addDocumentDetail, toggleModal])

  const handleUpdatePersonalDetail = useCallback(async () => {
    if (!editPersonalFormData?.id) return
    try {
      // 1. Update Personal Detail
      await updatePersonalDetail(editPersonalFormData.id, {
        firstName: editPersonalFormData.firstName,
        lastName: editPersonalFormData.lastName,
        mobileNumber: editPersonalFormData.mobileNumber,
        email: editPersonalFormData.email,
        phone: editPersonalFormData.phone,
        address: editPersonalFormData.address,
        companyName: editPersonalFormData.companyName,
        profilePhoto: editPersonalFormData.profilePhoto,
        signature: editPersonalFormData.signature,
      })

      // 2. Update or Create Document Detail
      if (editPersonalFormData.documentNumber || editPersonalFormData.documentTypeId) {
        const docPayload = {
          documentNumber: editPersonalFormData.documentNumber,
          validTill: editPersonalFormData.validTill,
          remark: editPersonalFormData.remark,
          personalDetailsId: editPersonalFormData.id,
          documentTypeId: editPersonalFormData.documentTypeId,
          frontImagePath: editPersonalFormData.frontImagePath,
          backImagePath: editPersonalFormData.backImagePath,
        }

        if (editPersonalFormData.documentId) {
          await updateDocumentDetail(editPersonalFormData.documentId, docPayload)
        } else {
          await addDocumentDetail(docPayload)
        }
      }

      setEditPersonalFormData({ id: null })
      toggleModal('personalDetailEdit', false)
    } catch (err) {
      console.error('Failed to update personal detail / document:', err)
    }
  }, [
    editPersonalFormData,
    updatePersonalDetail,
    updateDocumentDetail,
    addDocumentDetail,
    toggleModal,
  ])

  const handleEditPersonalDetail = useCallback(
    (detail, document = null) => {
      setEditPersonalFormData({
        ...detail,
        documentId: document?.id || null,
        documentNumber: document?.documentNumber || '',
        validTill: document?.validTill || '',
        remark: document?.remark || '',
        documentTypeId: document?.documentTypeId || '',
        frontImagePath: document?.frontImagePath || '',
        backImagePath: document?.backImagePath || '',
      })
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
