import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsRoomTypes = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: roomTypes = [], isLoading, refetch } = useQuery({
    queryKey: ['roomTypes'],
    queryFn: async () => {
      const res = await propertyService.getRoomTypes()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 2
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createRoomType(payload)
      if (type === 'update') return propertyService.updateRoomType(id, payload)
      if (type === 'delete') return propertyService.deleteRoomType(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Room type created', update: 'Room type updated', delete: 'Room type deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addRoomType = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateRoomType = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteRoomType = (id) => mutation.mutateAsync({ id, type: 'delete' })

  const searchRoomTypes = async (query) => {
    const res = await propertyService.searchRoomTypes(query)
    queryClient.setQueryData(['roomTypes'], extractData(res))
  }

  return { roomTypes, isLoading, fetchRoomTypes: refetch, addRoomType, updateRoomType, deleteRoomType, searchRoomTypes }
}
