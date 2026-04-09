/**
 * usePmsGuests.js - Guest Data Management Hook
 *
 * Yeh hook Guest ki details (Personal Details) ko handle karta hai.
 * Iska kaam hai data lana (Fetch), naya guest banana (Add), 
 * update karna, aur delete karna.
 */
import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsGuests = () => {
  const [personalDetails, setPersonalDetails] = useState([]) // Guest ki list yahan save hoti hai
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  // Backend se saare guests ki details lekar aata hai
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

  // Component load hote hi guest detail fetch ho jaye
  useEffect(() => {
    fetchPersonalDetails()
  }, [fetchPersonalDetails])

  // Naya Guest profile banata hai
  const addPersonalDetail = useCallback(
    async (payload) => {
      try {
        const res = await propertyService.createPersonalDetail(payload)
        toast.success('Guest profile created')
        fetchPersonalDetails() // List update karo
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create guest profile')
        throw err
      }
    },
    [fetchPersonalDetails, toast],
  )

  // Maujooda profile ko edit/update karta hai
  const updatePersonalDetail = useCallback(
    async (id, payload) => {
      try {
        const res = await propertyService.updatePersonalDetail(id, payload)
        toast.success('Guest profile updated')
        fetchPersonalDetails()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update guest profile')
        throw err
      }
    },
    [fetchPersonalDetails, toast],
  )

  // Guest profile delete karne ke liye
  const deletePersonalDetail = useCallback(
    async (id) => {
      try {
        const res = await propertyService.deletePersonalDetail(id)
        toast.success('Guest profile deleted successfully')
        fetchPersonalDetails()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete guest profile')
        throw err
      }
    },
    [fetchPersonalDetails, toast],
  )

  // Specific ID se guest fetch karna
  const fetchPersonalDetailById = useCallback(
    async (id) => {
      try {
        const res = await propertyService.getPersonalDetailById(id)
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch guest profile')
        throw err
      }
    },
    [toast],
  )

  // Guest list mein search karne ke liye
  const searchPersonalDetails = useCallback(
    async (query) => {
      setIsLoading(true)
      try {
        const res = await propertyService.searchPersonalDetails(query)
        setPersonalDetails(extractData(res))
      } catch (err) {
        toast.error(err.response?.data?.message || 'Guest search failed')
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return {
    personalDetails,
    isLoading,
    fetchPersonalDetails,
    fetchPersonalDetailById,
    addPersonalDetail,
    updatePersonalDetail,
    deletePersonalDetail,
    searchPersonalDetails,
  }
}

