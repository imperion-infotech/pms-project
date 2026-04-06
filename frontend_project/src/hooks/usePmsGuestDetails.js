import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsGuestDetails = () => {
  const [guestDetails, setGuestDetails] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchGuestDetails = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getGuestDetails()
      setGuestDetails(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch guest details')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchGuestDetails()
  }, [fetchGuestDetails])

  const addGuestDetail = useCallback(async (payload) => {
    try {
      const res = await propertyService.createGuestDetail(payload)
      toast.success('Guest detail created')
      fetchGuestDetails()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create guest detail')
      throw err
    }
  }, [fetchGuestDetails, toast])

  const updateGuestDetail = useCallback(async (id, payload) => {
    try {
      const res = await propertyService.updateGuestDetail(id, payload)
      toast.success('Guest detail updated')
      fetchGuestDetails()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update guest detail')
      throw err
    }
  }, [fetchGuestDetails, toast])

  const deleteGuestDetail = useCallback(async (id) => {
    try {
      const res = await propertyService.deleteGuestDetail(id)
      toast.success('Guest detail deleted successfully')
      fetchGuestDetails()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete guest detail')
      throw err
    }
  }, [fetchGuestDetails, toast])

  const fetchGuestDetailById = useCallback(async (id) => {
    try {
      const res = await propertyService.getGuestDetailById(id)
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch guest detail')
      throw err
    }
  }, [toast])

  return { 
    guestDetails, 
    isLoading, 
    fetchGuestDetails, 
    fetchGuestDetailById, 
    addGuestDetail, 
    updateGuestDetail, 
    deleteGuestDetail 
  }
}
