import { useState, useCallback, useMemo } from 'react'
import { useToast } from '../../../../context/NotificationContext'
import { usePmsGuests } from '../../../../hooks/usePmsGuests'
import { usePmsDocumentDetails } from '../../../../hooks/usePmsDocumentDetails'
import { usePmsStayDetails } from '../../../../hooks/usePmsStayDetails'
import { usePmsGuestDetails } from '../../../../hooks/usePmsGuestDetails'
import { usePmsRentDetails } from '../../../../hooks/usePmsRentDetails'
import { usePmsRooms } from '../../../../hooks/usePmsRooms'

/**
 * useGuestPersonalDetailsManagement - Centralized hook for Guest Personal Detail CRUD operations.
 * Ported to TanStack Query for industrial stability and orchestration.
 */
export const useGuestPersonalDetailsManagement = ({ toggleModal }) => {
  const toast = useToast()

  // Inject Specialty Hooks
  const { addPersonalDetail, updatePersonalDetail, fetchFolioNo } = usePmsGuests()
  const { addDocumentDetail, updateDocumentDetail } = usePmsDocumentDetails()
  const { addStayDetail, updateStayDetail } = usePmsStayDetails()
  const { addGuestDetail, updateGuestDetail } = usePmsGuestDetails()
  const { addRentDetail, updateRentDetail } = usePmsRentDetails()
  const { rooms, updateRoom } = usePmsRooms()

  const getIndustrialStayDefaults = useCallback(() => {
    const now = new Date()
    const checkInDate = now.toISOString()
    const checkInTime = now.toTimeString().slice(0, 8)

    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    const checkOutDate = tomorrow.toISOString()

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
    contactInformationTypeEnum: 'HOME',
    isDeleted: false,
    folioNo: '',
    crsFolioNo: '',
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
    contactInformationTypeEnum: 'HOME',
    isDeleted: false,
    folioNo: '',
    crsFolioNo: '',
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
    checkInDate: defaults.checkInDate.split('T')[0],
    checkOutDate: defaults.checkOutDate.split('T')[0],
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
        contactInformationTypeEnum: personalFormData.contactInformationTypeEnum || 'HOME',
        isDeleted: false,
        folioNo: personalFormData.folioNo,
        crsFolioNo: personalFormData.crsFolioNo,
      }
      console.log('1. [Add] Personal Payload:', personalPayload)
      const res = await addPersonalDetail(personalPayload)
      const personalDetailsId = res.data.id || res.data

      let documentDetailsId = null
      let stayDetailsId = null
      let rentDetailsId = null

      // 2. Create Document Detail
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
        console.log('2. [Add] Document Payload:', docPayload)
        const docRes = await addDocumentDetail(docPayload)
        documentDetailsId = docRes.data.id || docRes.data
      }

      // 3. Create Stay Detail
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
          roomStatusId: personalFormData.roomStatusId
            ? Number(personalFormData.roomStatusId)
            : undefined,
          color: personalFormData.color || '#2F8B2C',
          deleted: false,
        }
        console.log('3. [Add] Stay Payload:', stayPayload)
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
          otherCharges: personalFormData.otherCharges ? Number(personalFormData.otherCharges) : 0,
          discount: personalFormData.discount ? Number(personalFormData.discount) : 0,
          totalCharges: personalFormData.totalCharges ? Number(personalFormData.totalCharges) : 0,
          payments: personalFormData.payments ? Number(personalFormData.payments) : 0,
          ccAuthorized: personalFormData.ccAuthorized ? Number(personalFormData.ccAuthorized) : 0,
          deposite: personalFormData.deposite ? Number(personalFormData.deposite) : 0,
          balance: personalFormData.balance ? Number(personalFormData.balance) : 0,
          deleted: false,
        }
        console.log('4. [Add] Rent Payload:', rentPayload)
        const rentRes = await addRentDetail(rentPayload)
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
          ? `${personalFormData.checkInDate}T${personalFormData.checkInTime ? (personalFormData.checkInTime.split(':').length === 2 ? personalFormData.checkInTime + ':00' : personalFormData.checkInTime) : '00:00:00.000'}`
          : null,
        checkOutDate: personalFormData.checkOutDate
          ? `${personalFormData.checkOutDate}T${personalFormData.checkOutTime ? (personalFormData.checkOutTime.split(':').length === 2 ? personalFormData.checkOutTime + ':00' : personalFormData.checkOutTime) : '00:00:00.000'}`
          : null,
        checkInTime: personalFormData.checkInTime
          ? personalFormData.checkInTime.split(':').length === 2
            ? `${personalFormData.checkInTime}:00`
            : personalFormData.checkInTime
          : '00:00:00',
        checkOutTime: personalFormData.checkOutTime
          ? personalFormData.checkOutTime.split(':').length === 2
            ? `${personalFormData.checkOutTime}:00`
            : personalFormData.checkOutTime
          : '00:00:00',
        noOfDays: personalFormData.noOfDays ? Number(personalFormData.noOfDays) : 1,
        guestDetailsStatus: personalFormData.guestDetailsStatus || 'Reservation',
      }

      console.log('5. [Add] Guest Payload:', guestPayload)
      await addGuestDetail(guestPayload)

      // Sync Room Management Status
      if (personalFormData.roomMasterId && personalFormData.roomStatusId) {
        const originalRoom = rooms.find(
          (r) => String(r.id) === String(personalFormData.roomMasterId),
        )
        if (originalRoom) {
          try {
            await updateRoom(originalRoom.id, {
              ...originalRoom,
              roomStatusTableId: Number(personalFormData.roomStatusId),
              roomStatusId: Number(personalFormData.roomStatusId),
              personalDetailId: personalDetailsId,
            })
          } catch (err) {
            console.error('Failed to update room status:', err)
          }
        }
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
        contactInformationTypeEnum: 'HOME',
        isDeleted: false,
        folioNo: '',
        crsFolioNo: '',
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
        checkInDate: defaults.checkInDate.split('T')[0],
        checkOutDate: defaults.checkOutDate.split('T')[0],
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
      toast.success('Guest Personal Detail created successfully')
    } catch (err) {
      console.error('Failed to create guest package:', err)
      toast.error(err.response?.data?.message || 'Failed to create Guest Personal Detail')
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
    toast,
    rooms,
    updateRoom,
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
        contactInformationTypeEnum: editPersonalFormData.contactInformationTypeEnum || 'HOME',
        isDeleted: editPersonalFormData.isDeleted || false,
        folioNo: editPersonalFormData.folioNo,
        crsFolioNo: editPersonalFormData.crsFolioNo,
      }
      console.log('1. [Update] Personal Payload:', updatePayload)
      await updatePersonalDetail(editPersonalFormData.id, updatePayload)

      // 2. Update or Create Document Detail
      let docId = editPersonalFormData.documentId
      if (editPersonalFormData.documentNumber || editPersonalFormData.documentTypeId) {
        const docPayload = {
          documentNumber: editPersonalFormData.documentNumber,
          validTill: editPersonalFormData.validTill?.includes('T')
            ? editPersonalFormData.validTill
            : `${editPersonalFormData.validTill}T00:00:00.000Z`,
          frontImagePath: editPersonalFormData.frontImagePath,
          backImagePath: editPersonalFormData.backImagePath,
          remark: editPersonalFormData.remark,
          personalDetails: { id: editPersonalFormData.id },
          documentType: editPersonalFormData.documentTypeId
            ? { id: Number(editPersonalFormData.documentTypeId) }
            : undefined,
          deleted: false,
        }
        console.log('2. [Update] Document Payload:', docPayload)
        if (editPersonalFormData.documentId) {
          await updateDocumentDetail(editPersonalFormData.documentId, docPayload)
        } else {
          const docRes = await addDocumentDetail(docPayload)
          docId = docRes.data.id || docRes.data
        }
      }

      // 3. Update or Create Stay Detail
      let stayId = editPersonalFormData.stayId
      if (editPersonalFormData.buildingId || editPersonalFormData.roomMasterId) {
        const stayPayload = {
          floorId: Number(editPersonalFormData.floorId) || 1,
          buildingId: Number(editPersonalFormData.buildingId) || 1,
          roomTypeId: Number(editPersonalFormData.roomTypeId) || 1,
          roomMasterId: Number(editPersonalFormData.roomMasterId) || 1,
          comment: editPersonalFormData.comment || '',
          rateTypeEnum: editPersonalFormData.rateTypeEnum || 'RACK',
          stayStatusEnum: editPersonalFormData.stayStatusEnum || 'Confirmed',
          noOfGuest: Number(editPersonalFormData.noOfGuest) || 1,
          color: editPersonalFormData.color || '#2F8B2C',
          deleted: editPersonalFormData.deleted || false,
        }
        console.log('3. [Update] Stay Payload:', stayPayload)
        if (editPersonalFormData.stayId) {
          await updateStayDetail(editPersonalFormData.stayId, stayPayload)
        } else {
          const stayRes = await addStayDetail({
            ...stayPayload,
            personalDetailsId: editPersonalFormData.id,
          })
          stayId = stayRes.data.id || stayRes.data
        }
      }

      // 4. Update or Create Rent Details
      let rentId = editPersonalFormData.rentId
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
        console.log('4. [Update] Rent Payload:', rentPayload)
        if (rentId) {
          await updateRentDetail(rentId, rentPayload)
        } else {
          const rentRes = await addRentDetail(rentPayload)
          rentId = rentRes.data.id || rentRes.data
        }
      }

      // 5. Update or Create Guest Detail
      const guestPayload = {
        roomMasterId: editPersonalFormData.roomMasterId
          ? Number(editPersonalFormData.roomMasterId)
          : undefined,
        personalDetailsId: editPersonalFormData.id,
        documentDetailsId: docId,
        stayDetailsId: stayId,
        rentDetailsId: rentId,
        checkInDate: editPersonalFormData.checkInDate
          ? `${editPersonalFormData.checkInDate}T${editPersonalFormData.checkInTime ? (editPersonalFormData.checkInTime.split(':').length === 2 ? editPersonalFormData.checkInTime + ':00' : editPersonalFormData.checkInTime) : '00:00:00'}.000`
          : null,
        checkOutDate: editPersonalFormData.checkOutDate
          ? `${editPersonalFormData.checkOutDate}T${editPersonalFormData.checkOutTime ? (editPersonalFormData.checkOutTime.split(':').length === 2 ? editPersonalFormData.checkOutTime + ':00' : editPersonalFormData.checkOutTime) : '00:00:00'}.000`
          : null,
        checkInTime: editPersonalFormData.checkInTime
          ? editPersonalFormData.checkInTime.split(':').length === 2
            ? `${editPersonalFormData.checkInTime}:00`
            : editPersonalFormData.checkInTime
          : '00:00:00',
        checkOutTime: editPersonalFormData.checkOutTime
          ? editPersonalFormData.checkOutTime.split(':').length === 2
            ? `${editPersonalFormData.checkOutTime}:00`
            : editPersonalFormData.checkOutTime
          : '00:00:00',
        noOfDays: editPersonalFormData.noOfDays ? Number(editPersonalFormData.noOfDays) : 1,
        guestDetailsStatus: editPersonalFormData.guestDetailsStatus || 'Reservation',
        deleted: false,
      }

      console.log('5. [Update] Guest Payload:', guestPayload)

      if (editPersonalFormData.guestDetailId) {
        await updateGuestDetail(editPersonalFormData.guestDetailId, guestPayload)
      } else {
        await addGuestDetail(guestPayload)
      }

      // Sync Room Management Status
      if (editPersonalFormData.roomMasterId && editPersonalFormData.roomStatusId) {
        const originalRoom = rooms.find(
          (r) => String(r.id) === String(editPersonalFormData.roomMasterId),
        )
        if (originalRoom) {
          try {
            await updateRoom(originalRoom.id, {
              ...originalRoom,
              roomStatusTableId: Number(editPersonalFormData.roomStatusId),
              roomStatusId: Number(editPersonalFormData.roomStatusId),
              personalDetailId: editPersonalFormData.id,
            })
          } catch (err) {
            console.error('Failed to update room status:', err)
          }
        }
      }

      setEditPersonalFormData({ id: null, isDeleted: false })
      toggleModal('personalDetailEdit', false)
      toast.success('Guest Personal Detail updated successfully')
    } catch (err) {
      console.error('Failed to update guest package:', err)
      toast.error(err.response?.data?.message || 'Failed to update Guest Personal Detail')
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
    toast,
    rooms,
    updateRoom,
  ])

  const handleEditPersonalDetail = useCallback(
    (detail, document = null, stay = null, guest = null, rentDetailObj = null) => {
      const formatDate = (dateStr) =>
        dateStr?.includes('T') ? dateStr.split('T')[0] : dateStr || ''
      const formatTime = (timeStr) =>
        timeStr?.includes(':') ? timeStr.split('.')[0] : timeStr || ''
      const normalizeDropdown = (val, options = []) =>
        options.find((opt) => String(opt).toLowerCase() === String(val).toLowerCase()) || val || ''

      setEditPersonalFormData({
        ...detail,
        contactInformationTypeEnum: detail.contactInformationTypeEnum || 'HOME',
        folioNo: detail.folioNo || '',
        crsFolioNo: detail.crsFolioNo || '',
        documentId: document?.id || null,
        documentNumber: document?.documentNumber || '',
        validTill: formatDate(document?.validTill),
        remark: document?.remark || '',
        documentTypeId: document?.documentType?.id || document?.documentTypeId || '',
        frontImagePath: document?.frontImagePath || '',
        backImagePath: document?.backImagePath || '',
        stayId: stay?.id || guest?.stayDetailsId || guest?.stay_details_id || null,
        floorId: stay?.floorId || stay?.floor?.id || stay?.floor_id || '',
        buildingId: stay?.buildingId || stay?.building?.id || stay?.building_id || '',
        roomTypeId: stay?.roomTypeId || stay?.roomType?.id || stay?.room_type_id || '',
        roomMasterId:
          stay?.roomMasterId ||
          stay?.roomMaster?.id ||
          stay?.room_master_id ||
          guest?.roomMasterId ||
          guest?.room_master_id ||
          '',
        comment: stay?.comment || stay?.remarks || guest?.comment || '',
        rateTypeEnum: normalizeDropdown(stay?.rateTypeEnum || 'RACK', [
          'RACK',
          'WEEKLY_RATE_TEST',
          'YEARLY_RATE',
        ]),
        noOfGuest: stay?.noOfGuest || guest?.noOfGuest || 1,
        stayStatusEnum: normalizeDropdown(
          stay?.stayStatusEnum || stay?.stay_status_enum || 'Confirmed',
          ['Confirmed', 'Unconfirmed'],
        ),
        deleted: stay?.deleted || stay?.is_deleted || false,
        guestDetailId: guest?.id || null,
        checkInDate: formatDate(guest?.checkInDate) || formatDate(defaults.checkInDate),
        checkOutDate: formatDate(guest?.checkOutDate) || formatDate(defaults.checkOutDate),
        checkInTime: formatTime(guest?.checkInTime) || formatTime(defaults.checkInTime),
        checkOutTime: formatTime(guest?.checkOutTime) || formatTime(defaults.checkOutTime),
        guestDetailsStatus: normalizeDropdown(guest?.guestDetailsStatus || 'Reservation', [
          'Reservation',
          'Check-In',
          'In-House',
          'Check-Out',
        ]),
        noOfDays: guest?.noOfDays || guest?.no_of_days || defaults.noOfDays,
        rentId: guest?.rentDetailsId || guest?.rent_details_id || guest?.rentId || '',
        roomStatusId:
          stay?.roomStatusId ||
          stay?.roomStatus?.id ||
          stay?.room_status_id ||
          guest?.roomStatusId ||
          guest?.room_status_id ||
          '',
        rent: rentDetailObj?.rent || '',
        basic: rentDetailObj?.basic || '',
        taxId: rentDetailObj?.taxId || rentDetailObj?.taxMaster?.id || '',
        totalRental: rentDetailObj?.totalRental || rentDetailObj?.total_rental || '',
        otherCharges: rentDetailObj?.otherCharges || rentDetailObj?.other_charges || '',
        discount: rentDetailObj?.discount || '',
        totalCharges: rentDetailObj?.totalCharges || rentDetailObj?.total_charges || '',
        payments: rentDetailObj?.payments || '',
        ccAuthorized: rentDetailObj?.ccAuthorized || rentDetailObj?.cc_authorized || '',
        deposite: rentDetailObj?.deposite || rentDetailObj?.deposit || '',
        balance: rentDetailObj?.balance || '',
      })
      toggleModal('personalDetailEdit', true)
    },
    [toggleModal, defaults],
  )

  const handleAddNewPersonalDetail = useCallback(async () => {
    const newDefaults = getIndustrialStayDefaults()
    let initialFolio = ''
    try {
      initialFolio = await fetchFolioNo()
    } catch (err) {
      console.warn('Could not fetch folio number automatically', err)
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
      contactInformationTypeEnum: 'HOME',
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
      checkInDate: newDefaults.checkInDate.split('T')[0],
      checkOutDate: newDefaults.checkOutDate.split('T')[0],
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
      folioNo: initialFolio || '',
      crsFolioNo: '',
    })
    toggleModal('personalDetail', true)
  }, [toggleModal, getIndustrialStayDefaults, fetchFolioNo])

  return {
    personalFormData,
    setPersonalFormData,
    setNewPersonalDetail: setPersonalFormData, // Compatibility alias
    editPersonalFormData,
    setEditPersonalFormData,
    handleAddPersonalDetail,
    handleUpdatePersonalDetail,
    handleEditPersonalDetail,
    handleAddNewPersonalDetail,
  }
}
