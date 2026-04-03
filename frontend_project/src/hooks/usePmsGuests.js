import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsGuests = () => {
  const [personalDetails, setPersonalDetails] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchPersonalDetails = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getPersonalDetails()
      setPersonalDetails(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch guest details')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPersonalDetails()
  }, [fetchPersonalDetails])

  const addPersonalDetail = useCallback(async (payload) => {
    try {
      const res = await propertyService.createPersonalDetail(payload)
      toast.success('Guest profile created')
      fetchPersonalDetails()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create guest profile')
      throw err
    }
  }, [fetchPersonalDetails, toast])

  const updatePersonalDetail = useCallback(async (id, payload) => {
    try {
      const res = await propertyService.updatePersonalDetail(id, payload)
      toast.success('Guest profile updated')
      fetchPersonalDetails()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update guest profile')
      throw err
    }
  }, [fetchPersonalDetails, toast])

  const deletePersonalDetail = useCallback(async (id) => {
    try {
      const res = await propertyService.deletePersonalDetail(id)
      toast.success('Guest profile deleted successfully')
      fetchPersonalDetails()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete guest profile')
      throw err
    }
  }, [fetchPersonalDetails, toast])
 
  const fetchPersonalDetailById = useCallback(async (id) => {
    try {
      const res = await propertyService.getPersonalDetailById(id)
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch guest profile')
      throw err
    }
  }, [toast])

  const searchPersonalDetails = useCallback(async (query) => {
    setIsLoading(true)
    try {
      const res = await propertyService.searchPersonalDetails(query)
      setPersonalDetails(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Guest search failed')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return { personalDetails, isLoading, fetchPersonalDetails, fetchPersonalDetailById, addPersonalDetail, updatePersonalDetail, deletePersonalDetail, searchPersonalDetails }
}
