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
    rateTypeEnum: 'RACK',
    noOfGuest: 1,
    stayStatusEnum: 'Confirmed',
    deleted: false,
    // Guest Details
    checkInDate: defaults.checkInDate,
    checkOutDate: defaults.checkOutDate,
    checkInTime: defaults.checkInTime,
    checkOutTime: defaults.checkOutTime,
    guestDetailsStatus: 'Reservation',
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
    rateTypeEnum: 'RACK',
    stayStatusEnum: 'Confirmed',
    noOfGuest: 1,
    deleted: false,
    // Guest Details
    guestDetailId: null,
    checkInDate: defaults.checkInDate,
    checkOutDate: defaults.checkOutDate,
    checkInTime: defaults.checkInTime,
    checkOutTime: defaults.checkOutTime,
    guestDetailsStatus: 'Reservation',
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
      const personalPayload = {
        firstName: personalFormData.firstName,
        lastName: personalFormData.lastName,
        companyName: personalFormData.companyName,
        phone: personalFormData.phone || personalFormData.mobileNumber,
        mobileNumber: personalFormData.mobileNumber || personalFormData.phone,
        email: personalFormData.email,
        address: personalFormData.address,
        profilePhoto: personalFormData.profilePhoto || null,
        signature: personalFormData.signature || null,
        isDeleted: false,
      }
      console.log('---------------Personal Payload---------------', personalPayload)

      const res = await addPersonalDetail(personalPayload)

      console.log('---------------Personal Details---------------', res)

      const personalDetailsId = res.data.id || res.data
      let documentDetailsId = null
      let stayDetailsId = null
      let rentDetailsId = null

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
        console.log('---------------Document Details---------------', docRes)
        documentDetailsId = docRes.data.id || docRes.data
      }

      // 3. Create Stay Detail if info provided
      if (personalFormData.buildingId || personalFormData.roomMasterId) {
        const stayPayload = {
          floorId: Number(personalFormData.floorId) || 1,
          buildingId: Number(personalFormData.buildingId) || 1,
          roomTypeId: Number(personalFormData.roomTypeId) || 1,
          roomMasterId: Number(personalFormData.roomMasterId) || 1,
          comment: personalFormData.comment || '',
          color: '#3B82F6',
          rateTypeEnum: personalFormData.rateTypeEnum || 'RACK',
          stayStatusEnum: personalFormData.stayStatusEnum || 'Confirmed',
          noOfGuest: Number(personalFormData.noOfGuest) || 1,
          deleted: false,
          personalDetailsId: personalDetailsId,
        }
        const stayRes = await addStayDetail(stayPayload)
        stayDetailsId = stayRes.data.id || stayRes.data
      }

      // 4. Create Rent Details
      if (personalFormData.rent !== '' || personalFormData.basic !== '') {
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
          deleted: false,
        }
        console.log('---------------Rent Payload---------------', rentPayload)
        const rentRes = await addRentDetail(rentPayload)
        rentDetailsId = rentRes.data.id || rentRes.data
      }

      // 5. Create Guest Detail (Integration)
      await addGuestDetail({
        roomMasterId: personalFormData.roomMasterId
          ? Number(personalFormData.roomMasterId)
          : undefined,
        personalDetailsId: personalDetailsId,
        documentDetailsId: documentDetailsId,
        rentDetailsId: rentDetailsId,
        stayDetailsId: stayDetailsId,
        checkInDate: `${personalFormData.checkInDate}T${personalFormData.checkInTime || '00:00'}:00`,
        checkOutDate: `${personalFormData.checkOutDate}T${personalFormData.checkOutTime || '00:00'}:00`,
        noOfDays: personalFormData.noOfDays ? Number(personalFormData.noOfDays) : 1,
        guestDetailsStatus: personalFormData.guestDetailsStatus || 'Reservation',
      })

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
        rateTypeEnum: 'RACK',
        noOfGuest: 1,
        stayStatusEnum: 'Confirmed',
        deleted: false,
        checkInDate: defaults.checkInDate,
        checkOutDate: defaults.checkOutDate,
        checkInTime: defaults.checkInTime,
        checkOutTime: defaults.checkOutTime,
        guestDetailsStatus: 'Reservation',
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
      console.error('Failed to create guest package:', err)
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
      const updatePayload = {
        id: editPersonalFormData.id,
        firstName: editPersonalFormData.firstName,
        lastName: editPersonalFormData.lastName,
        companyName: editPersonalFormData.companyName,
        phone: editPersonalFormData.phone || editPersonalFormData.mobileNumber,
        mobileNumber: editPersonalFormData.mobileNumber || editPersonalFormData.phone,
        email: editPersonalFormData.email,
        address: editPersonalFormData.address,
        profilePhoto: editPersonalFormData.profilePhoto || null,
        signature: editPersonalFormData.signature || null,
        isDeleted: editPersonalFormData.isDeleted || false,
      }
      await updatePersonalDetail(editPersonalFormData.id, updatePayload)

      // 2. Update or Create Document Detail
      let docId = editPersonalFormData.documentId
      if (editPersonalFormData.documentNumber || editPersonalFormData.documentTypeId) {
        const docPayload = {
          documentNumber: editPersonalFormData.documentNumber,
          validTill: editPersonalFormData.validTill,
          frontImagePath: editPersonalFormData.frontImagePath,
          backImagePath: editPersonalFormData.backImagePath,
          remark: editPersonalFormData.remark,
          personalDetails: { id: editPersonalFormData.id },
          documentType: editPersonalFormData.documentTypeId
            ? { id: Number(editPersonalFormData.documentTypeId) }
            : undefined,
          deleted: false,
        }

        if (editPersonalFormData.documentId) {
          await updateDocumentDetail(editPersonalFormData.documentId, docPayload)
        } else {
          const docRes = await addDocumentDetail(docPayload)
          docId = docRes.data.id || docRes.data
        }
      }

      // 3. Update or Create Stay Detail
      let stayId = editPersonalFormData.stayId
      console.log('Stay ID', stayId)
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
          color: '#3B82F6',
          rateTypeEnum: editPersonalFormData.rateTypeEnum,
          stayStatusEnum: editPersonalFormData.stayStatusEnum,
          noOfGuest: editPersonalFormData.noOfGuest ? Number(editPersonalFormData.noOfGuest) : 1,
          deleted: editPersonalFormData.deleted || false,
          personalDetailsId: editPersonalFormData.id,
        }

        if (editPersonalFormData.stayId) {
          await updateStayDetail(editPersonalFormData.stayId, stayPayload)
        } else {
          const stayRes = await addStayDetail(stayPayload)
          stayId = stayRes.data.id || stayRes.data
        }
      }

      // 4. Update or Create Rent Details
      let rentId = editPersonalFormData.rentId
      console.log('Rent ID', rentId)
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
          deleted: false,
        }
        if (rentId) {
          await updateRentDetail(rentId, rentPayload)
        } else {
          const rentRes = await addRentDetail(rentPayload)
          rentId = rentRes.data.id || rentRes.data
        }
      }

      // 5. Update or Create Guest Detail
      const guestPayload = {
        roomMasterId: Number(editPersonalFormData.roomMasterId),
        personalDetailsId: editPersonalFormData.id,
        documentDetailsId: docId,
        stayDetailsId: stayId,
        rentDetailsId: rentId,
        checkInDate: `${editPersonalFormData.checkInDate}T${editPersonalFormData.checkInTime || '00:00'}:00`,
        checkOutDate: `${editPersonalFormData.checkOutDate}T${editPersonalFormData.checkOutTime || '00:00'}:00`,
        noOfDays: Number(editPersonalFormData.noOfDays),
        guestDetailsStatus: editPersonalFormData.guestDetailsStatus || 'Reservation',
      }

      console.log('---------------guestPayload---------------', guestPayload)
      if (editPersonalFormData.guestDetailId) {
        await updateGuestDetail(editPersonalFormData.guestDetailId, guestPayload)
      } else {
        await addGuestDetail(guestPayload)
      }

      setEditPersonalFormData({ id: null, isDeleted: false })
      toggleModal('personalDetailEdit', false)
    } catch (err) {
      console.error('Failed to update guest package:', err)
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
        rateTypeEnum: stay?.rateTypeEnum || 'RACK',
        noOfGuest: stay?.noOfGuest || 1,
        stayStatusEnum: stay?.stayStatusEnum || 'Confirmed',
        deleted: stay?.deleted || false,
        guestDetailId: guest?.id || null,
        checkInDate: guest?.checkInDate || defaults.checkInDate,
        checkOutDate: guest?.checkOutDate || defaults.checkOutDate,
        checkInTime: guest?.checkInTime || defaults.checkInTime,
        checkOutTime: guest?.checkOutTime || defaults.checkOutTime,
        guestDetailsStatus: guest?.guestDetailsStatus || 'Reservation',
        noOfDays: guest?.noOfDays || defaults.noOfDays,
        rentId: guest?.rentDetailsId || guest?.rentId || '',
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
      rateTypeEnum: 'RACK',
      noOfGuest: 1,
      stayStatusEnum: 'Confirmed',
      deleted: false,
      // Dynamic Defaults
      checkInDate: newDefaults.checkInDate,
      checkOutDate: newDefaults.checkOutDate,
      checkInTime: newDefaults.checkInTime,
      checkOutTime: newDefaults.checkOutTime,
      guestDetailsStatus: 'Reservation',
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
