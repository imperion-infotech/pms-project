import { useState, useCallback } from 'react'
import { usePmsOtherCharges } from '../../../../hooks/usePmsOtherCharges'

/**
 * useOtherChargeManagement - Centralized hook for Other Charge CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useOtherChargeManagement = ({ toggleModal }) => {
  const { addOtherCharge, updateOtherCharge } = usePmsOtherCharges()
  
  // Context: Get IDs from localStorage
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  const currentUserId = Number(localStorage.getItem('userId')) || 0

  const [newOtherCharge, setNewOtherCharge] = useState({
    otherChargeShortName: '',
    otherChargeName: '',
    categoryName: '',
    taxable: true,
    alwaysCharge: false,
    reoccureCharge: false,
    reoccureChargeFrequency: 0,
    crsCharge: false,
    callLoggingCharge: false,
    callPOSCharge: false,
    foreCastingRevenue: false,
  })

  const [editOtherCharge, setEditOtherCharge] = useState(null)

  const handleAddOtherCharge = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    try {
      const timestamp = new Date().toISOString()
      
      const payload = {
        hotelId: activeHotelId,
        isDeleted: false,
        isActive: true,
        createdBy: currentUserId,
        createdOn: timestamp,
        updatedBy: currentUserId,
        updatedOn: timestamp,
        deletedBy: 0,
        deletedOn: timestamp,
        id: 0,
        ...newOtherCharge,
        reoccureChargeFrequency: Number(newOtherCharge.reoccureChargeFrequency) || 0
      }

      console.log('Other Charge Create Payload:', payload)
      await addOtherCharge(payload)
      
      setNewOtherCharge({
        otherChargeShortName: '',
        otherChargeName: '',
        categoryName: '',
        taxable: true,
        alwaysCharge: false,
        reoccureCharge: false,
        reoccureChargeFrequency: 0,
        crsCharge: false,
        callLoggingCharge: false,
        callPOSCharge: false,
        foreCastingRevenue: false,
      })
      toggleModal('otherCharge', false)
    } catch (err) {
      console.error('Failed to create other charge:', err)
    }
  }

  const handleUpdateOtherCharge = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!editOtherCharge || !editOtherCharge.id) return
    try {
      const payload = {
        ...editOtherCharge,
        reoccureChargeFrequency: Number(editOtherCharge.reoccureChargeFrequency) || 0,
        updatedBy: currentUserId,
        updatedOn: new Date().toISOString(),
      }

      console.log('Other Charge Update Payload:', payload)
      await updateOtherCharge(editOtherCharge.id, payload)
      setEditOtherCharge(null)
      toggleModal('otherChargeEdit', false)
    } catch (err) {
      console.error('Failed to update other charge:', err)
    }
  }

  const handleEditOtherCharge = useCallback(
    (oc) => {
      setEditOtherCharge({ ...oc })
      toggleModal('otherChargeEdit', true)
    },
    [toggleModal],
  )

  return {
    newOtherCharge,
    setNewOtherCharge,
    editOtherCharge,
    setEditOtherCharge,
    handleAddOtherCharge,
    handleUpdateOtherCharge,
    handleEditOtherCharge,
  }
}
