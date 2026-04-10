import { useState, useCallback } from 'react'
import { usePmsPaymentTypes } from '../../../../hooks/usePmsPaymentTypes'

/**
 * usePaymentTypeManagement - Centralized hook for Payment Type CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const usePaymentTypeManagement = ({ toggleModal }) => {
  const { addPaymentType, updatePaymentType } = usePmsPaymentTypes()
  const [newPaymentType, setNewPaymentType] = useState({
    id: 0,
    paymentTypeName: '',
    paymentTypeShortName: '',
    categoryName: '',
    description: '',
    creditCardProcessing: false,
    createdOn: new Date().toISOString(),
  })
  
  const [editPaymentType, setEditPaymentType] = useState({
    id: null,
    paymentTypeName: '',
    paymentTypeShortName: '',
    categoryName: '',
    description: '',
    creditCardProcessing: false,
    createdOn: '',
  })

  const handleAddPaymentType = useCallback(async () => {
    if (!newPaymentType.paymentTypeName.trim()) return
    try {
      await addPaymentType(newPaymentType)
      setNewPaymentType({
        id: 0,
        paymentTypeName: '',
        paymentTypeShortName: '',
        categoryName: '',
        description: '',
        creditCardProcessing: false,
        createdOn: new Date().toISOString(),
      })
      toggleModal('paymentType', false)
    } catch (err) {
      console.error('Failed to create payment type:', err)
    }
  }, [newPaymentType, addPaymentType, toggleModal])

  const handleUpdatePaymentType = useCallback(async () => {
    if (editPaymentType.id === null || !editPaymentType.paymentTypeName?.trim()) return
    try {
      await updatePaymentType(editPaymentType.id, editPaymentType)
      setEditPaymentType({
        id: null,
        paymentTypeName: '',
        paymentTypeShortName: '',
        categoryName: '',
        description: '',
        creditCardProcessing: false,
        createdOn: '',
      })
      toggleModal('paymentTypeEdit', false)
    } catch (err) {
      console.error('Failed to update payment type:', err)
    }
  }, [editPaymentType, updatePaymentType, toggleModal])

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
