import { useState, useCallback } from 'react'
import { usePmsPaymentTypes } from '../../../../hooks/usePmsPaymentTypes'

/**
 * usePaymentTypeManagement - Centralized hook for Payment Type CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const usePaymentTypeManagement = ({ toggleModal }) => {
  const { addPaymentType, updatePaymentType } = usePmsPaymentTypes()
  
  // Context: Get IDs from localStorage
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  const currentUserId = Number(localStorage.getItem('userId')) || 0

  const [newPaymentType, setNewPaymentType] = useState({
    paymentTypeName: '',
    paymentTypeShortName: '',
    categoryName: '',
    description: '',
    creditCardProcessing: false,
    paymentDetails: '', // Added from provided schema
  })
  
  const [editPaymentType, setEditPaymentType] = useState(null)

  const handleAddPaymentType = useCallback(async () => {
    if (!newPaymentType.paymentTypeName.trim()) return
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
        ...newPaymentType
      }

      console.log('Payment Type Create Payload:', payload)
      await addPaymentType(payload)
      
      setNewPaymentType({
        paymentTypeName: '',
        paymentTypeShortName: '',
        categoryName: '',
        description: '',
        creditCardProcessing: false,
        paymentDetails: '',
      })
      toggleModal('paymentType', false)
    } catch (err) {
      console.error('Failed to create payment type:', err)
    }
  }, [newPaymentType, addPaymentType, toggleModal, activeHotelId, currentUserId])

  const handleUpdatePaymentType = useCallback(async () => {
    if (!editPaymentType || !editPaymentType.id || !editPaymentType.paymentTypeName?.trim()) return
    try {
      const payload = {
        ...editPaymentType,
        updatedBy: currentUserId,
        updatedOn: new Date().toISOString(),
      }

      console.log('Payment Type Update Payload:', payload)
      await updatePaymentType(editPaymentType.id, payload)
      setEditPaymentType(null)
      toggleModal('paymentTypeEdit', false)
    } catch (err) {
      console.error('Failed to update payment type:', err)
    }
  }, [editPaymentType, updatePaymentType, toggleModal, currentUserId])

  const handleEditPaymentType = useCallback(
    (pt) => {
      setEditPaymentType({ ...pt })
      toggleModal('paymentTypeEdit', true)
    },
    [toggleModal],
  )

  return {
    newPaymentType,
    setNewPaymentType,
    editPaymentType,
    setEditPaymentType,
    handleAddPaymentType,
    handleUpdatePaymentType,
    handleEditPaymentType,
  }
}
