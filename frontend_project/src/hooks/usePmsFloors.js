import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsFloors = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const {
    data: floors = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['floors'],
    queryFn: async () => {
      const res = await propertyService.getFloors()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 2,
  })

  const floorMutation = useMutation({
    mutationFn: (args) => {
      const { id, payload, type } = args
      if (type === 'create') return propertyService.createFloor(payload)
      if (type === 'update') return propertyService.updateFloor(id, payload)
      if (type === 'delete') return propertyService.deleteFloor(id)
    },
    onSuccess: (res, variables) => {
      const msgs = { create: 'Floor created', update: 'Floor updated', delete: 'Floor deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries({ queryKey: ['floors'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed'),
  })

  const addFloor = (payload) => floorMutation.mutateAsync({ payload, type: 'create' })
  const updateFloor = (id, payload) => floorMutation.mutateAsync({ id, payload, type: 'update' })
  const deleteFloor = (id) => floorMutation.mutateAsync({ id, type: 'delete' })

  const searchFloors = async (query) => {
    const res = await propertyService.searchFloors(query)
    queryClient.setQueryData(['floors'], extractData(res))
  }

  return {
    floors,
    isLoading,
    fetchFloors: refetch,
    addFloor,
    updateFloor,
    deleteFloor,
    searchFloors,
  }
}
