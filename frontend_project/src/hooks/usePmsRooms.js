import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

/**
 * usePmsRooms - Enterprise Data Management
 * 
 * Yeh hook ab TanStack Query use karta hai jo data caching,
 * auto-refresh aur performance ko industrial level par le jata hai.
 */
export const usePmsRooms = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  // 1. QUERY: Fetch Rooms with caching
  const { 
    data: rooms = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await propertyService.getRooms()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 5, // 5 minute caching
  })

  // 2. MUTATIONS: Data changes logic
  const roomMutation = useMutation({
    mutationFn: (args) => {
      const { id, payload, type } = args
      if (type === 'create') return propertyService.createRoom(payload)
      if (type === 'update') return propertyService.updateRoom(id, payload)
      if (type === 'delete') return propertyService.deleteRoom(id)
    },
    onSuccess: (res, variables) => {
      const message = {
        create: 'Room created successfully',
        update: 'Room updated successfully',
        delete: 'Room deleted successfully'
      }[variables.type]
      
      toast.success(message)
      // Invalidating 'rooms' cache taaki data refresh ho jaye
      queryClient.invalidateQueries(['rooms'])
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  })

  const addRoom = (payload) => roomMutation.mutateAsync({ payload, type: 'create' })
  const updateRoom = (id, payload) => roomMutation.mutateAsync({ id, payload, type: 'update' })
  const deleteRoom = (id) => roomMutation.mutateAsync({ id, type: 'delete' })

  const searchRooms = async (query) => {
    // Search usually doesn't need long caching
    const res = await propertyService.searchRooms(query)
    queryClient.setQueryData(['rooms'], extractData(res))
  }

  return { 
    rooms, 
    isLoading, 
    fetchRooms: refetch, 
    addRoom, 
    updateRoom, 
    deleteRoom, 
    searchRooms,
    error 
  }
}
