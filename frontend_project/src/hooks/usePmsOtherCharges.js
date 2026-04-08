import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsOtherCharges = () => {
  const [otherCharges, setOtherCharges] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchOtherCharges = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getOtherCharges()
      setOtherCharges(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch other charges')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchOtherCharges()
  }, [fetchOtherCharges])

  const addOtherCharge = useCallback(
    async (payload) => {
      try {
        const res = await propertyService.createOtherCharge(payload)
        toast.success('Other Charge created!')
        fetchOtherCharges()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create other charge')
        throw err
      }
    },
    [fetchOtherCharges, toast],
  )

  const updateOtherCharge = useCallback(
    async (id, payload) => {
      try {
        const res = await propertyService.updateOtherCharge(id, payload)
        toast.success('Other Charge updated!')
        fetchOtherCharges()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update other charge')
        throw err
      }
    },
    [fetchOtherCharges, toast],
  )

  const deleteOtherCharge = useCallback(
    async (id) => {
      try {
        const res = await propertyService.deleteOtherCharge(id)
        toast.success('Other Charge deleted successfully')
        fetchOtherCharges()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete other charge')
        throw err
      }
    },
    [fetchOtherCharges, toast],
  )

  const searchOtherCharges = useCallback(
    async (query) => {
      setIsLoading(true)
      try {
        const res = await propertyService.searchOtherCharges(query)
        setOtherCharges(extractData(res))
      } catch (err) {
        toast.error(err.response?.data?.message || 'Other charge search failed')
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return {
    otherCharges,
    isLoading,
    fetchOtherCharges,
    addOtherCharge,
    updateOtherCharge,
    deleteOtherCharge,
    searchOtherCharges,
  }
}
