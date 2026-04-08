import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsPaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchPaymentTypes = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getPaymentTypes()
      setPaymentTypes(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch payment types')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPaymentTypes()
  }, [fetchPaymentTypes])

  const addPaymentType = useCallback(
    async (payload) => {
      try {
        const res = await propertyService.createPaymentType(payload)
        toast.success('Payment Type created!')
        fetchPaymentTypes()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create payment type')
        throw err
      }
    },
    [fetchPaymentTypes, toast],
  )

  const updatePaymentType = useCallback(
    async (id, payload) => {
      try {
        const res = await propertyService.updatePaymentType(id, payload)
        toast.success('Payment Type updated!')
        fetchPaymentTypes()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update payment type')
        throw err
      }
    },
    [fetchPaymentTypes, toast],
  )

  const deletePaymentType = useCallback(
    async (id) => {
      try {
        const res = await propertyService.deletePaymentType(id)
        toast.success('Payment Type deleted successfully')
        fetchPaymentTypes()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete payment type')
        throw err
      }
    },
    [fetchPaymentTypes, toast],
  )

  const searchPaymentTypes = useCallback(
    async (query) => {
      setIsLoading(true)
      try {
        const res = await propertyService.searchPaymentTypes(query)
        setPaymentTypes(extractData(res))
      } catch (err) {
        toast.error(err.response?.data?.message || 'Payment search failed')
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return {
    paymentTypes,
    isLoading,
    fetchPaymentTypes,
    addPaymentType,
    updatePaymentType,
    deletePaymentType,
    searchPaymentTypes,
  }
}
