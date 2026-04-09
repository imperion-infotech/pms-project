import { useState, useCallback, useMemo } from 'react'

/**
 * usePersonalDetailManagement - Centralized hook for Guest Personal Detail CRUD operations.
 */
export const useGuestPersonalDetailsManagement = ({
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

  const parseTimeStringToObj = useCallback((timeStr) => {
    if (!timeStr) return { hour: 0, minute: 0, second: 0, nano: 0 }
    const parts = timeStr.split(':').map(Number)
    return {
      hour: parts[0] || 0,
      minute: parts[1] || 0,
      second: parts[2] || 0,
      nano: 0,
    }
  }, [])

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
    stayStatusEnum: 'CONFIRMED',
    deleted: false,
    // Guest Details
    checkInDate: defaults.checkInDate,
    checkOutDate: defaults.checkOutDate,
    checkInTime: defaults.checkInTime,
    checkOutTime: defaults.checkOutTime,
    guestDetailsStatus: 'RESERVATION',
    noOfDays: defaults.noOfDays,
    rentId: '',
    roomStatusId: '',
    // Rent Details
    rent: '',
    basic: '',
    taxId: '',
    totalRental: '',
    otherCharges: '',
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
    checkInId: null,
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
    otherCharges: '',
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
        email: personalFormData.email,
        address: personalFormData.address,
        profilePhoto: personalFormData.profilePhoto || null,
        signature: personalFormData.signature || null,
        isDeleted: false,
      }
      console.log('1. Personal Payload:', JSON.stringify(personalPayload, null, 2))
      const res = await addPersonalDetail(personalPayload)
      console.log('---------------Personal Details API Response---------------', res)

      const personalDetailsId = res.data.id || res.data
      let documentDetailsId = null
      let stayDetailsId = null
      let rentDetailsId = null

      // 2. Create Document Detail if info provided
      if (personalFormData.documentNumber || personalFormData.documentTypeId) {
        const docPayload = {
          documentNumber: personalFormData.documentNumber,
          validTill: personalFormData.validTill
            ? `${personalFormData.validTill}T00:00:00.000Z`
            : null,
          frontImagePath: personalFormData.frontImagePath,
          backImagePath: personalFormData.backImagePath,
          remark: personalFormData.remark,
          personalDetails: { id: personalDetailsId },
          documentType: personalFormData.documentTypeId
            ? { id: Number(personalFormData.documentTypeId) }
            : undefined,
          deleted: false,
        }
        console.log('2. Document Payload:', JSON.stringify(docPayload, null, 2))
        const docRes = await addDocumentDetail(docPayload)
        console.log('---------------Document Details API Response---------------', docRes)
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
          rateTypeEnum: personalFormData.rateTypeEnum || 'RACK',
          stayStatusEnum: personalFormData.stayStatusEnum || 'Confirmed',
          noOfGuest: Number(personalFormData.noOfGuest) || 1,
          personalDetailsId: personalDetailsId,
          deleted: false,
        }
        console.log('3. Stay Payload:', JSON.stringify(stayPayload, null, 2))
        const stayRes = await addStayDetail(stayPayload)
        console.log('---------------Stay Payload (Create)---------------')
        console.log('floor id:', stayPayload.floorId)
        console.log('building id:', stayPayload.buildingId)
        console.log('room type id:', stayPayload.roomTypeId)
        console.log('room master id:', stayPayload.roomMasterId)
        console.log('rate type:', stayPayload.rateTypeEnum)
        console.log('stay status:', stayPayload.stayStatusEnum)
        console.log('no of guest:', stayPayload.noOfGuest)
        console.log('comment:', stayPayload.comment)
        console.log('---------------Stay Details API Response---------------', stayRes)
        stayDetailsId = stayRes.data.id || stayRes.data
      }

      // 4. Create Rent Details
      if (personalFormData.rent !== '' || personalFormData.basic !== '') {
        const rentPayload = {
          rent: personalFormData.rent ? Number(personalFormData.rent) : 0,
          basic: personalFormData.basic ? Number(personalFormData.basic) : 0,
          taxId: personalFormData.taxId ? Number(personalFormData.taxId) : undefined,
          totalRental: personalFormData.totalRental ? Number(personalFormData.totalRental) : 0,
          otherCharges: personalFormData.otherCharges ? Number(personalFormData.otherCharges) : 0,
          discount: personalFormData.discount ? Number(personalFormData.discount) : 0,
          totalCharges: personalFormData.totalCharges ? Number(personalFormData.totalCharges) : 0,
          payments: personalFormData.payments ? Number(personalFormData.payments) : 0,
          ccAuthorized: personalFormData.ccAuthorized ? Number(personalFormData.ccAuthorized) : 0,
          deposite: personalFormData.deposite ? Number(personalFormData.deposite) : 0,
          balance: personalFormData.balance ? Number(personalFormData.balance) : 0,
          deleted: false,
        }
        console.log('4. Rent Payload:', JSON.stringify(rentPayload, null, 2))
        const rentRes = await addRentDetail(rentPayload)
        console.log('---------------Rent Details API Response---------------', rentRes)
        rentDetailsId = rentRes.data.id || rentRes.data
      }

      // 5. Create Guest Detail (Integration)
      const guestPayload = {
        roomMasterId: personalFormData.roomMasterId
          ? Number(personalFormData.roomMasterId)
          : undefined,
        personalDetailsId: personalDetailsId,
        documentDetailsId: documentDetailsId,
        rentDetailsId: rentDetailsId,
        stayDetailsId: stayDetailsId,
        checkInDate: personalFormData.checkInDate
          ? `${personalFormData.checkInDate}T${personalFormData.checkInTime || '00:00'}:00.000Z`
          : null,
        checkOutDate: personalFormData.checkOutDate
          ? `${personalFormData.checkOutDate}T${personalFormData.checkOutTime || '00:00'}:00.000Z`
          : null,
        checkInTime: parseTimeStringToObj(personalFormData.checkInTime),
        checkOutTime: parseTimeStringToObj(personalFormData.checkOutTime),
        noOfDays: personalFormData.noOfDays ? Number(personalFormData.noOfDays) : 1,
        guestDetailsStatus: personalFormData.guestDetailsStatus || 'Reservation',
      }
      console.log('5. Guest Payload:', JSON.stringify(guestPayload, null, 2))
      await addGuestDetail(guestPayload)
      console.log('---------------Guest Payload (Create)---------------')
      console.log('room master id:', guestPayload.roomMasterId)
      console.log('personal id:', guestPayload.personalDetailsId)
      console.log('doc id:', guestPayload.documentDetailsId)
      console.log('rent id:', guestPayload.rentDetailsId)
      console.log('stay id:', guestPayload.stayDetailsId)
      console.log('checkin date:', guestPayload.checkInDate)
      console.log('checkout date:', guestPayload.checkOutDate)
      console.log('checkin time:', guestPayload.checkInTime)
      console.log('checkout time:', guestPayload.checkOutTime)
      console.log('status:', guestPayload.guestDetailsStatus)
      console.log('no of days:', guestPayload.noOfDays)
      await addGuestDetail(guestPayload)

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
        otherCharges: '',
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
    parseTimeStringToObj,
  ])

  const handleUpdatePersonalDetail = useCallback(async () => {
    if (!editPersonalFormData?.id) return
    try {
      // 1. Update Personal Detail
      const updatePayload = {
        firstName: editPersonalFormData.firstName,
        lastName: editPersonalFormData.lastName,
        companyName: editPersonalFormData.companyName,
        phone: editPersonalFormData.phone || editPersonalFormData.mobileNumber,
        email: editPersonalFormData.email,
        address: editPersonalFormData.address,
        profilePhoto: editPersonalFormData.profilePhoto || null,
        signature: editPersonalFormData.signature || null,
        isDeleted: editPersonalFormData.isDeleted || false,
      }
      console.log(
        '---------------Personal Payload (Update)---------------',
        updatePayload.firstName,
      )
      console.log('---------------Personal Payload (Update)---------------', updatePayload.lastName)

      console.log(
        '---------------Personal Payload (Update)---------------',
        updatePayload.companyName,
      )
      console.log('---------------Personal Payload (Update)---------------', updatePayload.phone)

      console.log('---------------Personal Payload (Update)---------------', updatePayload.email)
      console.log('---------------Personal Payload (Update)---------------', updatePayload.address)

      console.log(
        '---------------Personal Payload (Update)---------------',
        updatePayload.profilePhoto,
      )
      console.log(
        '---------------Personal Payload (Update)---------------',
        updatePayload.signature,
      )
      console.log(
        '---------------Personal Payload (Update)---------------',
        updatePayload.isDeleted,
      )

      await updatePersonalDetail(editPersonalFormData.id, updatePayload)

      // 2. Update or Create Document Detail
      let docId = editPersonalFormData.documentId
      if (editPersonalFormData.documentNumber || editPersonalFormData.documentTypeId) {
        const docPayload = {
          documentNumber: editPersonalFormData.documentNumber,
          validTill: editPersonalFormData.validTill
            ? editPersonalFormData.validTill.includes('T')
              ? editPersonalFormData.validTill
              : `${editPersonalFormData.validTill}T00:00:00.000Z`
            : null,
          frontImagePath: editPersonalFormData.frontImagePath,
          backImagePath: editPersonalFormData.backImagePath,
          remark: editPersonalFormData.remark,
          personalDetails: { id: editPersonalFormData.id },
          documentType: editPersonalFormData.documentTypeId
            ? { id: Number(editPersonalFormData.documentTypeId) }
            : undefined,
          deleted: false,
        }
        console.log(
          '---------------Document Payload (Update/Create)---------------',
          docPayload.documentNumber,
        )
        console.log(
          '---------------Document Payload (Update/Create)---------------',
          docPayload.validTill,
        )
        console.log(
          '---------------Document Payload (Update/Create)---------------',
          docPayload.frontImagePath,
        )
        console.log(
          '---------------Document Payload (Update/Create)---------------',
          docPayload.backImagePath,
        )
        console.log(
          '---------------Document Payload (Update/Create)---------------',
          docPayload.remark,
        )
        console.log(
          '---------------Document Payload (Update/Create)---------------',
          docPayload.personalDetails,
        )
        console.log(
          '---------------Document Payload (Update/Create)---------------',
          docPayload.documentType,
        )
        console.log(
          '---------------Document Payload (Update/Create)---------------',
          docPayload.deleted,
        )

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
          rateTypeEnum: editPersonalFormData.rateTypeEnum,
          stayStatusEnum: editPersonalFormData.stayStatusEnum,
          noOfGuest: editPersonalFormData.noOfGuest ? Number(editPersonalFormData.noOfGuest) : 1,
          deleted: editPersonalFormData.deleted || false,
        }
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.floorId,
        )
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.buildingId,
        )
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.roomTypeId,
        )
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.roomMasterId,
        )
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.comment,
        )
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.rateTypeEnum,
        )
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.stayStatusEnum,
        )
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.noOfGuest,
        )
        console.log(
          '---------------Stay Payload (Update/Create)---------------',
          stayPayload.deleted,
        )

        if (editPersonalFormData.stayId) {
          await updateStayDetail(editPersonalFormData.stayId, stayPayload)
        } else {
          const stayRes = await addStayDetail(stayPayload)
          stayId = stayRes.data.id || stayRes.data
        }
      }

      // 4. Update or Create Rent Details
      let rentId = editPersonalFormData.rentId
      console.log('--------------------Rent ID-----------------', rentId)
      if (editPersonalFormData.rent !== '' || editPersonalFormData.basic !== '') {
        const rentPayload = {
          rent: editPersonalFormData.rent ? Number(editPersonalFormData.rent) : 0,
          basic: editPersonalFormData.basic ? Number(editPersonalFormData.basic) : 0,
          taxId: editPersonalFormData.taxId ? Number(editPersonalFormData.taxId) : undefined,
          totalRental: editPersonalFormData.totalRental
            ? Number(editPersonalFormData.totalRental)
            : 0,
          otherCharges: editPersonalFormData.otherCharges
            ? Number(editPersonalFormData.otherCharges)
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
        console.log('---------------Rent Payload (Update/Create)---------------', rentPayload.rent)
        console.log('---------------Rent Payload (Update/Create)---------------', rentPayload.basic)
        console.log('---------------Rent Payload (Update/Create)---------------', rentPayload.taxId)
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.totalRental,
        )
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.otherCharges,
        )
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.discount,
        )
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.totalCharges,
        )
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.payments,
        )
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.ccAuthorized,
        )
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.deposite,
        )
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.balance,
        )
        console.log(
          '---------------Rent Payload (Update/Create)---------------',
          rentPayload.deleted,
        )

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
        checkInDate: editPersonalFormData.checkInDate
          ? `${editPersonalFormData.checkInDate}T${editPersonalFormData.checkInTime || '00:00'}:00.000Z`
          : null,
        checkOutDate: editPersonalFormData.checkOutDate
          ? `${editPersonalFormData.checkOutDate}T${editPersonalFormData.checkOutTime || '00:00'}:00.000Z`
          : null,
        checkInTime: parseTimeStringToObj(editPersonalFormData.checkInTime),
        checkOutTime: parseTimeStringToObj(editPersonalFormData.checkOutTime),
        noOfDays: Number(editPersonalFormData.noOfDays),
        guestDetailsStatus: editPersonalFormData.guestDetailsStatus || 'RESERVATION',
      }

      console.log('---------------Guest Payload (Update)---------------', guestPayload)
      console.log('---------------Guest Payload (Update)---------------', guestPayload.roomMasterId)
      console.log(
        '---------------Guest Payload (Update)---------------',
        guestPayload.personalDetailsId,
      )
      console.log(
        '---------------Guest Payload (Update)---------------',
        guestPayload.documentDetailsId,
      )
      console.log(
        '---------------Guest Payload (Update)---------------',
        guestPayload.stayDetailsId,
      )
      console.log(
        '---------------Guest Payload (Update)---------------',
        guestPayload.rentDetailsId,
      )
      console.log('---------------Guest Payload (Update)---------------', guestPayload.checkInDate)
      console.log('---------------Guest Payload (Update)---------------', guestPayload.checkOutDate)
      console.log('---------------Guest Payload (Update)---------------', guestPayload.checkInTime)
      console.log('---------------Guest Payload (Update)---------------', guestPayload.checkOutTime)
      console.log('---------------Guest Payload (Update)---------------', guestPayload.noOfDays)
      console.log(
        '---------------Guest Payload (Update)---------------',
        guestPayload.guestDetailsStatus,
      )

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
    parseTimeStringToObj,
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
        stayStatusEnum: stay?.stayStatusEnum || 'CONFIRMED',
        deleted: stay?.deleted || false,
        guestDetailId: guest?.id || null,
        checkInDate: guest?.checkInDate || defaults.checkInDate,
        checkOutDate: guest?.checkOutDate || defaults.checkOutDate,
        checkInTime: guest?.checkInTime || defaults.checkInTime,
        checkOutTime: guest?.checkOutTime || defaults.checkOutTime,
        guestDetailsStatus: guest?.guestDetailsStatus || 'RESERVATION',
        noOfDays: guest?.noOfDays || defaults.noOfDays,
        rentId: guest?.rentDetailsId || guest?.rentId || '',
        roomStatusId: guest?.roomStatusId || '',
        // Rent Detail Populate
        rent: rentDetailObj?.rent || '',
        basic: rentDetailObj?.basic || '',
        taxId: rentDetailObj?.taxId || rentDetailObj?.taxMaster?.id || '',
        totalRental: rentDetailObj?.totalRental || '',
        otherCharges: rentDetailObj?.otherCharges || '',
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
      otherCharges: '',
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
