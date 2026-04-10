/**
 * usePmsGuests.js - Guest Data Management Hook
 *
 * Yeh hook Guest ki details (Personal Details) ko handle karta hai.
 * Iska kaam hai data lana (Fetch), naya guest banana (Add),
 * update karna, aur delete karna.
 */
import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

/**
 * usePmsGuests - Ultra-Professional Data Handling
 *
 * Yeh hook Guest profiles ko manage karta hai.
 * React Query ka use karne se background sync aur caching automatic ho jati hai.
 */
export const usePmsGuests = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  // 1. QUERY: Get all guest profiles
  const {
    data: personalDetails = [],
    isLoading,
    refetch: fetchPersonalDetails,
  } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const res = await propertyService.getPersonalDetails()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 10, // 10 minute caching for guest list
  })

  // 2. MUTATIONS
  const guestMutation = useMutation({
    mutationFn: (args) => {
      const { id, payload, type } = args
      if (type === 'create') return propertyService.createPersonalDetail(payload)
      if (type === 'update') return propertyService.updatePersonalDetail(id, payload)
      if (type === 'delete') return propertyService.deletePersonalDetail(id)
    },
    onSuccess: (res, variables) => {
      const messages = {
        create: 'Guest profile created',
        update: 'Guest profile updated',
        delete: 'Guest profile deleted',
      }
      toast.success(messages[variables.type])
      queryClient.invalidateQueries(['guests'])
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Operation failed')
    },
  })

  const addPersonalDetail = (payload) => guestMutation.mutateAsync({ payload, type: 'create' })
  const updatePersonalDetail = (id, payload) =>
    guestMutation.mutateAsync({ id, payload, type: 'update' })
  const deletePersonalDetail = (id) => guestMutation.mutateAsync({ id, type: 'delete' })

  // Specific fetch logic (not strictly a query if it's one-off, but we can make it one)
  const fetchPersonalDetailById = useCallback(
    async (id) => {
      try {
        return await propertyService.getPersonalDetailById(id)
      } catch (err) {
        toast.error('Failed to fetch guest profile')
        throw err
      }
    },
    [toast],
  )

  const searchPersonalDetails = async (query) => {
    const res = await propertyService.searchPersonalDetails(query)
    queryClient.setQueryData(['guests'], extractData(res))
  }

  const fetchFolioNo = useCallback(async () => {
    const res = await propertyService.getFolioNo()
    return res.data
  }, [])

  return {
    personalDetails,
    isLoading,
    fetchPersonalDetails,
    fetchPersonalDetailById,
    addPersonalDetail,
    updatePersonalDetail,
    deletePersonalDetail,
    searchPersonalDetails,
    fetchFolioNo,
  }
}
