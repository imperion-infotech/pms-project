import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsRoomStatus = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: roomStatuses = [], isLoading, refetch } = useQuery({
    queryKey: ['roomStatuses'],
    queryFn: async () => {
      const res = await propertyService.getRoomStatuses()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 10
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createRoomStatus(payload)
      if (type === 'update') return propertyService.updateRoomStatus(id, payload)
      if (type === 'delete') return propertyService.deleteRoomStatus(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Room status created', update: 'Room status updated', delete: 'Room status deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries(['roomStatuses'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addRoomStatus = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateRoomStatus = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteRoomStatus = (id) => mutation.mutateAsync({ id, type: 'delete' })

  const getRoomStatusById = useCallback(async (id) => {
    try {
      const res = await propertyService.getRoomStatusById(id)
      return res.data
    } catch (err) {
      toast.error('Failed to fetch room status details')
      throw err
    }
  }, [toast])

  const searchRoomStatuses = async (query) => {
    const res = await propertyService.searchRoomStatuses(query)
    queryClient.setQueryData(['roomStatuses'], extractData(res))
  }

  return { 
    roomStatuses, 
    isLoading, 
    fetchRoomStatuses: refetch, 
    addRoomStatus, 
    updateRoomStatus, 
    deleteRoomStatus, 
    getRoomStatusById,
    searchRoomStatuses 
  }
}
