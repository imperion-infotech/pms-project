import { useState, useCallback } from 'react'
import { usePmsTaxes } from '../../../../hooks/usePmsTaxes'

/**
 * useTaxManagement - Centralized hook for Tax CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useTaxManagement = ({ toggleModal }) => {
  const { addTax, updateTax } = usePmsTaxes()
  const [newTax, setNewTax] = useState({
    taxMasterName: '',
    taxTypeEnum: 'Occupancy_tax',
    perDayTax: false,
    perStayTax: false,
  })
  const [editTax, setEditTax] = useState(null)

  // Context: Get IDs from localStorage
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  const currentUserId = Number(localStorage.getItem('userId')) || 0

  const handleAddTax = useCallback(async () => {
    if (!newTax.taxMasterName.trim()) return
    try {
      const timestamp = new Date().toISOString()
      
      // Exact alignment with provided JSON schema
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
        taxMasterName: newTax.taxMasterName,
        taxTypeEnum: newTax.taxTypeEnum,
        perDayTax: Boolean(newTax.perDayTax),
        perStayTax: Boolean(newTax.perStayTax),
        amount: Number(newTax.amount) || 0,
      }

      console.log('Tax Create Payload:', payload)
      await addTax(payload)

      setNewTax({
        taxMasterName: '',
        taxTypeEnum: 'Occupancy_tax',
        perDayTax: false,
        perStayTax: false,
      })
      toggleModal('tax', false)
    } catch (err) {
      console.error('Failed to create tax record:', err)
    }
  }, [newTax, addTax, toggleModal, activeHotelId, currentUserId])

  const handleUpdateTax = useCallback(async () => {
    if (!editTax || !editTax.id || !editTax.taxMasterName.trim()) return
    try {
      const payload = {
        ...editTax,
        amount: Number(editTax.amount) || 0,
        updatedBy: currentUserId,
        updatedOn: new Date().toISOString(),
      }

      console.log('Tax Update Payload:', payload)
      await updateTax(editTax.id, payload)
      setEditTax(null)
      toggleModal('taxEdit', false)
    } catch (err) {
      console.error('Failed to update tax record:', err)
    }
  }, [editTax, updateTax, toggleModal, currentUserId])

  const handleEditTax = useCallback(
    (tax) => {
      setEditTax({ ...tax })
      toggleModal('taxEdit', true)
    },
    [toggleModal],
  )

  return {
    newTax,
    setNewTax,
    editTax,
    setEditTax,
    handleAddTax,
    handleUpdateTax,
    handleEditTax,
  }
}
