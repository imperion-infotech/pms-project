import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsGuestDetails = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: guestDetails = [], isLoading, refetch } = useQuery({
    queryKey: ['guestDetails'],
    queryFn: async () => {
      const res = await propertyService.getGuestDetails()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 5
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createGuestDetail(payload)
      if (type === 'update') return propertyService.updateGuestDetail(id, payload)
      if (type === 'delete') return propertyService.deleteGuestDetail(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Guest detail created', update: 'Guest detail updated', delete: 'Guest detail deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries(['guestDetails'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addGuestDetail = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateGuestDetail = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteGuestDetail = (id) => mutation.mutateAsync({ id, type: 'delete' })

  const fetchGuestDetailById = useCallback(async (id) => {
    try {
      const res = await propertyService.getGuestDetailById(id)
      return res
    } catch (err) {
      toast.error('Failed to fetch guest detail')
      throw err
    }
  }, [toast])

  return { 
    guestDetails, 
    isLoading, 
    fetchGuestDetails: refetch, 
    fetchGuestDetailById, 
    addGuestDetail, 
    updateGuestDetail, 
    deleteGuestDetail 
  }
}
