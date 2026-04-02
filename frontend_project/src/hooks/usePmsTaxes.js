import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsTaxes = () => {
  const [taxes, setTaxes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchTaxes = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getTaxMasters()
      setTaxes(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch taxes')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchTaxes()
  }, [fetchTaxes])

  const addTax = useCallback(async (payload) => {
    try {
      const res = await propertyService.createTaxMaster(payload)
      toast.success('Tax record created successfully')
      fetchTaxes()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create tax record')
      throw err
    }
  }, [fetchTaxes, toast])

  const updateTax = useCallback(async (id, payload) => {
    try {
      const res = await propertyService.updateTaxMaster(id, payload)
      toast.success('Tax record updated successfully')
      fetchTaxes()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update tax record')
      throw err
    }
  }, [fetchTaxes, toast])

  const deleteTax = useCallback(async (id) => {
    try {
      const res = await propertyService.deleteTaxMaster(id)
      toast.success('Tax record deleted successfully')
      fetchTaxes()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete tax record')
      throw err
    }
  }, [fetchTaxes, toast])


  return { taxes, isLoading, fetchTaxes, addTax, updateTax, deleteTax }
}
