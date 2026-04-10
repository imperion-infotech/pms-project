import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsBuildings = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const {
    data: buildings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['buildings'],
    queryFn: async () => {
      const res = await propertyService.getBuildings()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 10,
  })

  const buildingMutation = useMutation({
    mutationFn: (args) => {
      const { id, payload, type } = args
      if (type === 'create') return propertyService.createBuilding(payload)
      if (type === 'update') return propertyService.updateBuilding(id, payload)
      if (type === 'delete') return propertyService.deleteBuilding(id)
    },
    onSuccess: (res, variables) => {
      const msgs = {
        create: 'Building created',
        update: 'Building updated',
        delete: 'Building deleted',
      }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries(['buildings'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed'),
  })

  const addBuilding = (payload) => buildingMutation.mutateAsync({ payload, type: 'create' })
  const updateBuilding = (id, payload) =>
    buildingMutation.mutateAsync({ id, payload, type: 'update' })
  const deleteBuilding = (id) => buildingMutation.mutateAsync({ id, type: 'delete' })

  const searchBuildings = async (query) => {
    const res = await propertyService.searchBuildings(query)
    queryClient.setQueryData(['buildings'], extractData(res))
  }

  return {
    buildings,
    isLoading,
    fetchBuildings: refetch,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    searchBuildings,
  }
}
