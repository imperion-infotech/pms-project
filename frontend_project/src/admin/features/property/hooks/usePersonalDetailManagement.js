import { useState, useCallback, useMemo } from 'react'

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
  addGuestDetail,
  updateGuestDetail,
  addRentDetail,
  updateRentDetail,
  toggleModal,
}) => {
  // --- Standardized Industrial Stay Defaults ---
  const getIndustrialStayDefaults = useCallback(() => {
    const now = new Date()
    // Extract YYYY-MM-DD
    const checkInDate = now.toISOString().split('T')[0]
    // Extract HH:mm
    const checkInTime = now.toTimeString().slice(0, 5)

    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    const checkOutDate = tomorrow.toISOString().split('T')[0]

    return {
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime: checkInTime,
      noOfDays: 1,
    }
  }, [])

  const defaults = useMemo(() => getIndustrialStayDefaults(), [getIndustrialStayDefaults])

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
    isDeleted: false,
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
    color: '#3B82F6',
    rateTypeEnum: 'RACK',
    noOfGuest: 1,
    stayStatusEnum: 'CONFIRMED',
    // Guest Details (New)
    checkInDate: defaults.checkInDate,
    checkOutDate: defaults.checkOutDate,
    checkInTime: defaults.checkInTime,
    checkOutTime: defaults.checkOutTime,
    guestDetailsStats: 'Reservation',
    noOfDays: defaults.noOfDays,
    rentId: '',
    roomStatusId: '',
    // Rent Details
    rent: '',
    basic: '',
    taxId: '',
    totalRental: '',
    otherChanrges: '',
    discount: '',
    totalCharges: '',
    payments: '',
    ccAuthorized: '',
    deposite: '',
    balance: '',
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
    isDeleted: false,
    // Document Details
    documentId: null,
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
    color: '#3B82F6',
    rateTypeEnum: 'RACK',
    stayStatusEnum: 'Confirmed',
    noOfGuest: 1,
    // Guest Details (New)
    guestDetailId: null,
    checkInDate: defaults.checkInDate,
    checkOutDate: defaults.checkOutDate,
    checkInTime: defaults.checkInTime,
    checkOutTime: defaults.checkOutTime,
    guestDetailsStats: 'Reservation',
    noOfDays: defaults.noOfDays,
    rentId: '',
    roomStatusId: '',
    // Rent Details
    rent: '',
    basic: '',
    taxId: '',
    totalRental: '',
    otherChanrges: '',
    discount: '',
    totalCharges: '',
    payments: '',
    ccAuthorized: '',
    deposite: '',
    balance: '',
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
        isDeleted: personalFormData.isDeleted || false,
      })

      const personalDetailsId = res.data.id || res.data
      let documentId = null

      // 2. Create Document Detail if info provided
      if (personalFormData.documentNumber || personalFormData.documentTypeId) {
        const docRes = await addDocumentDetail({
          documentNumber: personalFormData.documentNumber,
          validTill: personalFormData.validTill,
          frontImagePath: personalFormData.frontImagePath,
          backImagePath: personalFormData.backImagePath,
          remark: personalFormData.remark,
          personalDetails: { id: personalDetailsId },
          documentType: personalFormData.documentTypeId
            ? { id: Number(personalFormData.documentTypeId) }
            : undefined,
          deleted: false,
        })
        documentId = docRes.data.id || docRes.data
      }

      // 3. Create Stay Detail if info provided
      if (personalFormData.buildingId || personalFormData.roomMasterId) {
        const stayPayload = {
          floorId: personalFormData.floorId ? Number(personalFormData.floorId) : undefined,
          buildingId: personalFormData.buildingId ? Number(personalFormData.buildingId) : undefined,
          roomTypeId: personalFormData.roomTypeId ? Number(personalFormData.roomTypeId) : undefined,
          roomMasterId: personalFormData.roomMasterId
            ? Number(personalFormData.roomMasterId)
            : undefined,
          comment: personalFormData.comment,
          color: personalFormData.color || '#3B82F6',
          rateTypeEnum: personalFormData.rateTypeEnum,
          noOfGuest: personalFormData.noOfGuest ? Number(personalFormData.noOfGuest) : 1,
          stayStatusEnum:
            personalFormData.stayStatusEnum === 'CONFIRMED'
              ? 'Confirmed'
              : personalFormData.stayStatusEnum,
          deleted: false,
        }
        await addStayDetail(stayPayload)
      }

      // 4. Create Rent Details & Guest Detail (Integration)
      if (personalFormData.roomMasterId) {
        let finalRentId = null

        // If financial info is passed, create RentDetail
        if (personalFormData.rent || personalFormData.basic || personalFormData.totalCharges) {
          const rentPayload = {
            rent: personalFormData.rent ? Number(personalFormData.rent) : 0,
            basic: personalFormData.basic ? Number(personalFormData.basic) : 0,
            taxId: personalFormData.taxId ? Number(personalFormData.taxId) : undefined,
            totalRental: personalFormData.totalRental ? Number(personalFormData.totalRental) : 0,
            otherChanrges: personalFormData.otherChanrges
              ? Number(personalFormData.otherChanrges)
              : 0,
            discount: personalFormData.discount ? Number(personalFormData.discount) : 0,
            totalCharges: personalFormData.totalCharges ? Number(personalFormData.totalCharges) : 0,
            payments: personalFormData.payments ? Number(personalFormData.payments) : 0,
            ccAuthorized: personalFormData.ccAuthorized ? Number(personalFormData.ccAuthorized) : 0,
            deposite: personalFormData.deposite ? Number(personalFormData.deposite) : 0,
            balance: personalFormData.balance ? Number(personalFormData.balance) : 0,
          }
          const rentRes = await addRentDetail(rentPayload)
          finalRentId = rentRes.data.id || rentRes.data
        }

        await addGuestDetail({
          roomMasterId: personalFormData.roomMasterId
            ? Number(personalFormData.roomMasterId)
            : undefined,
          personalDetailsId: personalDetailsId,
          documentId: documentId,
          roomStatusId: personalFormData.roomStatusId
            ? Number(personalFormData.roomStatusId)
            : undefined,
          checkInDate: personalFormData.checkInDate,
          checkOutDate: personalFormData.checkOutDate,
          checkInTime: personalFormData.checkInTime,
          checkOutTime: personalFormData.checkOutTime,
          guestDetailsStats: personalFormData.guestDetailsStats,
          noOfDays: personalFormData.noOfDays ? Number(personalFormData.noOfDays) : 1,
          rentId: finalRentId,
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
        isDeleted: false,
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
        color: '#3B82F6',
        rateTypeEnum: 'RACK',
        noOfGuest: 1,
        stayStatusEnum: 'Confirmed',
        checkInDate: defaults.checkInDate,
        checkOutDate: defaults.checkOutDate,
        checkInTime: defaults.checkInTime,
        checkOutTime: defaults.checkOutTime,
        guestDetailsStats: 'Reservation',
        noOfDays: defaults.noOfDays,
        rentId: '',
        roomStatusId: '',
        rent: '',
        basic: '',
        taxId: '',
        totalRental: '',
        otherChanrges: '',
        discount: '',
        totalCharges: '',
        payments: '',
        ccAuthorized: '',
        deposite: '',
        balance: '',
      })
      toggleModal('personalDetail', false)
    } catch (err) {
      console.error('Failed to create personal detail / document / stay / guest detail:', err)
    }
  }, [
    personalFormData,
    addPersonalDetail,
    addDocumentDetail,
    addStayDetail,
    addGuestDetail,
    addRentDetail,
    toggleModal,
    defaults,
  ])

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
        isDeleted: editPersonalFormData.isDeleted || false,
      })

      // 2. Update or Create Document Detail
      let docId = editPersonalFormData.documentId
      if (editPersonalFormData.documentNumber || editPersonalFormData.documentTypeId) {
        const docPayload = {
          documentNumber: editPersonalFormData.documentNumber,
          validTill: editPersonalFormData.validTill,
          remark: editPersonalFormData.remark,
          personalDetails: { id: editPersonalFormData.id },
          documentType: editPersonalFormData.documentTypeId
            ? { id: Number(editPersonalFormData.documentTypeId) }
            : undefined,
          frontImagePath: editPersonalFormData.frontImagePath,
          backImagePath: editPersonalFormData.backImagePath,
          deleted: editPersonalFormData.deleted || false,
        }

        if (editPersonalFormData.documentId) {
          await updateDocumentDetail(editPersonalFormData.documentId, docPayload)
        } else {
          const docRes = await addDocumentDetail(docPayload)
          docId = docRes.data.id || docRes.data
        }
      }

      // 3. Update or Create Stay Detail
      if (editPersonalFormData.buildingId || editPersonalFormData.roomMasterId) {
        const stayPayload = {
          floorId: editPersonalFormData.floorId ? Number(editPersonalFormData.floorId) : undefined,
          buildingId: editPersonalFormData.buildingId
            ? Number(editPersonalFormData.buildingId)
            : undefined,
          roomTypeId: editPersonalFormData.roomTypeId
            ? Number(editPersonalFormData.roomTypeId)
            : undefined,
          roomMasterId: editPersonalFormData.roomMasterId
            ? Number(editPersonalFormData.roomMasterId)
            : undefined,
          comment: editPersonalFormData.comment,
          color: editPersonalFormData.color || '#3B82F6',
          rateTypeEnum: editPersonalFormData.rateTypeEnum,
          noOfGuest: editPersonalFormData.noOfGuest ? Number(editPersonalFormData.noOfGuest) : 1,
          stayStatusEnum:
            editPersonalFormData.stayStatusEnum === 'CONFIRMED'
              ? 'Confirmed'
              : editPersonalFormData.stayStatusEnum,
          deleted: editPersonalFormData.deleted || false,
        }

        if (editPersonalFormData.stayId) {
          await updateStayDetail(editPersonalFormData.stayId, stayPayload)
        } else {
          await addStayDetail(stayPayload)
        }
      }

      // 4. Update or Create Rent Details & Guest Detail
      if (editPersonalFormData.roomMasterId) {
        let finalRentId = editPersonalFormData.rentId

        if (editPersonalFormData.rent !== '' || editPersonalFormData.basic !== '') {
          const rentPayload = {
            rent: editPersonalFormData.rent ? Number(editPersonalFormData.rent) : 0,
            basic: editPersonalFormData.basic ? Number(editPersonalFormData.basic) : 0,
            taxId: editPersonalFormData.taxId ? Number(editPersonalFormData.taxId) : undefined,
            totalRental: editPersonalFormData.totalRental
              ? Number(editPersonalFormData.totalRental)
              : 0,
            otherChanrges: editPersonalFormData.otherChanrges
              ? Number(editPersonalFormData.otherChanrges)
              : 0,
            discount: editPersonalFormData.discount ? Number(editPersonalFormData.discount) : 0,
            totalCharges: editPersonalFormData.totalCharges
              ? Number(editPersonalFormData.totalCharges)
              : 0,
            payments: editPersonalFormData.payments ? Number(editPersonalFormData.payments) : 0,
            ccAuthorized: editPersonalFormData.ccAuthorized
              ? Number(editPersonalFormData.ccAuthorized)
              : 0,
            deposite: editPersonalFormData.deposite ? Number(editPersonalFormData.deposite) : 0,
            balance: editPersonalFormData.balance ? Number(editPersonalFormData.balance) : 0,
          }
          if (finalRentId) {
            await updateRentDetail(finalRentId, rentPayload)
          } else {
            const rentRes = await addRentDetail(rentPayload)
            finalRentId = rentRes.data.id || rentRes.data
          }
        }

        const guestPayload = {
          roomMasterId: Number(editPersonalFormData.roomMasterId),
          personalDetailsId: editPersonalFormData.id,
          documentId: docId,
          roomStatusId: editPersonalFormData.roomStatusId
            ? Number(editPersonalFormData.roomStatusId)
            : undefined,
          checkInDate: editPersonalFormData.checkInDate,
          checkOutDate: editPersonalFormData.checkOutDate,
          checkInTime: editPersonalFormData.checkInTime,
          checkOutTime: editPersonalFormData.checkOutTime,
          guestDetailsStats: editPersonalFormData.guestDetailsStats,
          noOfDays: Number(editPersonalFormData.noOfDays),
          rentId: finalRentId ? Number(finalRentId) : undefined,
        }

        if (editPersonalFormData.guestDetailId) {
          await updateGuestDetail(editPersonalFormData.guestDetailId, guestPayload)
        } else {
          await addGuestDetail(guestPayload)
        }
      }

      setEditPersonalFormData({ id: null, isDeleted: false })
      toggleModal('personalDetailEdit', false)
    } catch (err) {
      console.error('Failed to update personal detail / document / stay / guest detail:', err)
    }
  }, [
    editPersonalFormData,
    updatePersonalDetail,
    updateDocumentDetail,
    addDocumentDetail,
    updateStayDetail,
    addStayDetail,
    updateGuestDetail,
    addGuestDetail,
    addRentDetail,
    updateRentDetail,
    toggleModal,
  ])

  const handleEditPersonalDetail = useCallback(
    (detail, document = null, stay = null, guest = null, rentDetailObj = null) => {
      setEditPersonalFormData({
        ...detail,
        documentId: document?.id || null,
        documentNumber: document?.documentNumber || '',
        validTill: document?.validTill || '',
        remark: document?.remark || '',
        documentTypeId: document?.documentType?.id || document?.documentTypeId || '',
        frontImagePath: document?.frontImagePath || '',
        backImagePath: document?.backImagePath || '',
        stayId: stay?.id || null,
        floorId: stay?.floorId || '',
        buildingId: stay?.buildingId || '',
        roomTypeId: stay?.roomTypeId || '',
        roomMasterId: stay?.roomMasterId || '',
        comment: stay?.comment || '',
        color: stay?.color || '#3B82F6',
        rateTypeEnum: stay?.rateTypeEnum || 'RACK',
        noOfGuest: stay?.noOfGuest || 1,
        stayStatusEnum: stay?.stayStatusEnum || 'Confirmed',
        guestDetailId: guest?.id || null,
        checkInDate: guest?.checkInDate || defaults.checkInDate,
        checkOutDate: guest?.checkOutDate || defaults.checkOutDate,
        checkInTime: guest?.checkInTime || defaults.checkInTime,
        checkOutTime: guest?.checkOutTime || defaults.checkOutTime,
        guestDetailsStats: guest?.guestDetailsStats || 'Reservation',
        noOfDays: guest?.noOfDays || defaults.noOfDays,
        rentId: guest?.rentId || '',
        roomStatusId: guest?.roomStatusId || '',
        // Rent Detail Populate
        rent: rentDetailObj?.rent || '',
        basic: rentDetailObj?.basic || '',
        taxId: rentDetailObj?.taxId || '',
        totalRental: rentDetailObj?.totalRental || '',
        otherChanrges: rentDetailObj?.otherChanrges || '',
        discount: rentDetailObj?.discount || '',
        totalCharges: rentDetailObj?.totalCharges || '',
        payments: rentDetailObj?.payments || '',
        ccAuthorized: rentDetailObj?.ccAuthorized || '',
        deposite: rentDetailObj?.deposite || '',
        balance: rentDetailObj?.balance || '',
      })
      toggleModal('personalDetailEdit', true)
    },
    [toggleModal, defaults],
  )

  /**
   * handleAddNewPersonalDetail - Resets the form with industrial defaults for a new guest.
   */
  const handleAddNewPersonalDetail = useCallback(() => {
    const newDefaults = getIndustrialStayDefaults()

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
      isDeleted: false,
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
      color: '#3B82F6',
      rateTypeEnum: 'RACK',
      noOfGuest: 1,
      stayStatusEnum: 'Confirmed',
      // Dynamic Defaults
      checkInDate: newDefaults.checkInDate,
      checkOutDate: newDefaults.checkOutDate,
      checkInTime: newDefaults.checkInTime,
      checkOutTime: newDefaults.checkOutTime,
      guestDetailsStats: 'Reservation',
      noOfDays: 1,
      rentId: '',
      roomStatusId: '',
      rent: '',
      basic: '',
      taxId: '',
      totalRental: '',
      otherChanrges: '',
      discount: '',
      totalCharges: '',
      payments: '',
      ccAuthorized: '',
      deposite: '',
      balance: '',
    })
    toggleModal('personalDetail', true)
  }, [toggleModal, getIndustrialStayDefaults])

  return {
    personalFormData,
    setPersonalFormData,
    editPersonalFormData,
    setEditPersonalFormData,
    handleAddPersonalDetail,
    handleUpdatePersonalDetail,
    handleEditPersonalDetail,
    handleAddNewPersonalDetail,
  }
}
