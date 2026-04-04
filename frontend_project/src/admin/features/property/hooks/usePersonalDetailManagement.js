import { useState, useCallback } from 'react'

/**
 * usePersonalDetailManagement - Centralized hook for Guest Personal Detail CRUD operations.
 */
export const usePersonalDetailManagement = ({
  addPersonalDetail,
  updatePersonalDetail,
  addDocumentDetail,
  updateDocumentDetail,
  addStayDetail,
  updateStayDetail,
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
    // Stay Details
    floorId: '',
    buildingId: '',
    roomTypeId: '',
    roomMasterId: '',
    comment: '',
    rateTypeEnum: 'RACK',
    noOfGuest: 1,
    stayStatusEnum: 'CONFIRMED',
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
    // Stay Details
    stayId: null,
    floorId: '',
    buildingId: '',
    roomTypeId: '',
    roomMasterId: '',
    comment: '',
    rateTypeEnum: 'RACK',
    noOfGuest: 1,
    stayStatusEnum: 'CONFIRMED',
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
          personalDetailsId: personalDetailsId, // Plural as per spec
          documentTypeId: personalFormData.documentTypeId ? Number(personalFormData.documentTypeId) : undefined,
          frontImagePath: personalFormData.frontImagePath,
          backImagePath: personalFormData.backImagePath,
        })
      }

      // 3. Create Stay Detail if info provided
      if (personalFormData.buildingId || personalFormData.roomMasterId) {
        const stayPayload = {
          floorId: personalFormData.floorId ? Number(personalFormData.floorId) : undefined,
          buildingId: personalFormData.buildingId ? Number(personalFormData.buildingId) : undefined,
          roomTypeId: personalFormData.roomTypeId ? Number(personalFormData.roomTypeId) : undefined,
          roomMasterId: personalFormData.roomMasterId ? Number(personalFormData.roomMasterId) : undefined,
          comment: personalFormData.comment,
          rateTypeEnum: personalFormData.rateTypeEnum,
          noOfGuest: personalFormData.noOfGuest ? Number(personalFormData.noOfGuest) : 1,
          stayStatusEnum: personalFormData.stayStatusEnum,
          personalDetailId: personalDetailsId,
        }
        await addStayDetail(stayPayload)
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
        floorId: '',
        buildingId: '',
        roomTypeId: '',
        roomMasterId: '',
        comment: '',
        rateTypeEnum: 'RACK',
        noOfGuest: 1,
        stayStatusEnum: 'CONFIRMED',
      })
      toggleModal('personalDetail', false)
    } catch (err) {
      console.error('Failed to create personal detail / document / stay:', err)
    }
  }, [personalFormData, addPersonalDetail, addDocumentDetail, addStayDetail, toggleModal])

  const handleUpdatePersonalDetail = useCallback(async () => {
    if (!editPersonalFormData?.id) return
    try {
      // 1. Update Personal Detail
      await updatePersonalDetail(editPersonalFormData.id, {
        id: editPersonalFormData.id,
        firstName: editPersonalFormData.firstName,
        lastName: editPersonalFormData.lastName,
        mobileNumber: editPersonalFormData.mobileNumber || editPersonalFormData.phone,
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
          personalDetailsId: editPersonalFormData.id, // Plural
          documentTypeId: editPersonalFormData.documentTypeId ? Number(editPersonalFormData.documentTypeId) : undefined,
          frontImagePath: editPersonalFormData.frontImagePath,
          backImagePath: editPersonalFormData.backImagePath,
        }

        if (editPersonalFormData.documentId) {
          await updateDocumentDetail(editPersonalFormData.documentId, docPayload)
        } else {
          await addDocumentDetail(docPayload)
        }
      }

      // 3. Update or Create Stay Detail
      if (editPersonalFormData.buildingId || editPersonalFormData.roomMasterId) {
        const stayPayload = {
          floorId: editPersonalFormData.floorId ? Number(editPersonalFormData.floorId) : undefined,
          buildingId: editPersonalFormData.buildingId ? Number(editPersonalFormData.buildingId) : undefined,
          roomTypeId: editPersonalFormData.roomTypeId ? Number(editPersonalFormData.roomTypeId) : undefined,
          roomMasterId: editPersonalFormData.roomMasterId ? Number(editPersonalFormData.roomMasterId) : undefined,
          comment: editPersonalFormData.comment,
          rateTypeEnum: editPersonalFormData.rateTypeEnum,
          noOfGuest: editPersonalFormData.noOfGuest ? Number(editPersonalFormData.noOfGuest) : 1,
          stayStatusEnum: editPersonalFormData.stayStatusEnum,
          personalDetailId: editPersonalFormData.id,
        }

        if (editPersonalFormData.stayId) {
          await updateStayDetail(editPersonalFormData.stayId, stayPayload)
        } else {
          await addStayDetail(stayPayload)
        }
      }

      setEditPersonalFormData({ id: null })
      toggleModal('personalDetailEdit', false)
    } catch (err) {
      console.error('Failed to update personal detail / document / stay:', err)
    }
  }, [
    editPersonalFormData,
    updatePersonalDetail,
    updateDocumentDetail,
    addDocumentDetail,
    updateStayDetail,
    addStayDetail,
    toggleModal,
  ])

  const handleEditPersonalDetail = useCallback(
    (detail, document = null, stay = null) => {
      setEditPersonalFormData({
        ...detail,
        documentId: document?.id || null,
        documentNumber: document?.documentNumber || '',
        validTill: document?.validTill || '',
        remark: document?.remark || '',
        documentTypeId: document?.documentTypeId || '',
        frontImagePath: document?.frontImagePath || '',
        backImagePath: document?.backImagePath || '',
        stayId: stay?.id || null,
        floorId: stay?.floorId || '',
        buildingId: stay?.buildingId || '',
        roomTypeId: stay?.roomTypeId || '',
        roomMasterId: stay?.roomMasterId || '',
        comment: stay?.comment || '',
        rateTypeEnum: stay?.rateTypeEnum || 'RACK',
        noOfGuest: stay?.noOfGuest || 1,
        stayStatusEnum: stay?.stayStatusEnum || 'CONFIRMED',
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
