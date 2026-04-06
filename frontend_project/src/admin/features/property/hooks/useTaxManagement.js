import { useState, useCallback } from 'react'

/**
 * useTaxManagement - Centralized hook for Tax CRUD operations.
 */
export const useTaxManagement = ({ addTax, updateTax, toggleModal }) => {
  const [newTax, setNewTax] = useState({
    taxMasterName: '',
    taxTypeEnum: 'Occupancy_tax',
    perDayTax: false,
    perStayTax: false,
  })
  const [editTax, setEditTax] = useState({
    id: null,
    taxMasterName: '',
    taxTypeEnum: 'Occupancy_tax',
    perDayTax: false,
    perStayTax: false,
    createdOn: '',
  })

  const handleAddTax = useCallback(async () => {
    if (!newTax.taxMasterName.trim()) return
    try {
      await addTax({
        ...newTax,
        createdOn: new Date().toISOString(),
      })
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
  }, [newTax, addTax, toggleModal])

  const handleUpdateTax = useCallback(async () => {
    if (!editTax.id || !editTax.taxMasterName.trim()) return
    try {
      await updateTax(editTax.id, {
        ...editTax,
        createdOn: editTax.createdOn || new Date().toISOString(),
      })
      setEditTax({
        id: null,
        taxMasterName: '',
        taxTypeEnum: 'STANDARD',
        perDayTax: false,
        perStayTax: false,
      })
      toggleModal('taxEdit', false)
    } catch (err) {
      console.error('Failed to update tax record:', err)
    }
  }, [editTax, updateTax, toggleModal])

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
