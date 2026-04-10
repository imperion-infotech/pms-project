import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsRentDetails = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: rentDetails = [], isLoading, refetch } = useQuery({
    queryKey: ['rentDetails'],
    queryFn: async () => {
      const res = await propertyService.getRentDetails()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 5
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createRentDetail(payload)
      if (type === 'update') return propertyService.updateRentDetail(id, payload)
      if (type === 'delete') return propertyService.deleteRentDetail(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Rent record created', update: 'Rent record updated', delete: 'Rent record deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries(['rentDetails'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addRentDetail = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateRentDetail = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteRentDetail = (id) => mutation.mutateAsync({ id, type: 'delete' })

  return { rentDetails, isLoading, fetchRentDetails: refetch, addRentDetail, updateRentDetail, deleteRentDetail }
}
