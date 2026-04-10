import { useState, useCallback } from 'react'
import { usePmsOtherCharges } from '../../../../hooks/usePmsOtherCharges'

/**
 * useOtherChargeManagement - Centralized hook for Other Charge CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useOtherChargeManagement = ({ toggleModal }) => {
  const { addOtherCharge, updateOtherCharge } = usePmsOtherCharges()
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
    e.preventDefault()
    try {
      await addOtherCharge(newOtherCharge)
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
      console.error(err)
    }
  }

  const handleUpdateOtherCharge = async (e) => {
    e.preventDefault()
    try {
      await updateOtherCharge(editOtherCharge.id, editOtherCharge)
      setEditOtherCharge(null)
      toggleModal('otherChargeEdit', false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditOtherCharge = useCallback(
    (oc) => {
      setEditOtherCharge(oc)
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
