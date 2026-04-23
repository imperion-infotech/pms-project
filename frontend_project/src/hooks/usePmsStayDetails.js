import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsStayDetails = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const {
    data: stayDetails = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['stayDetails'],
    queryFn: async () => {
      const res = await propertyService.getStayDetails()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 5,
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createStayDetail(payload)
      if (type === 'update') return propertyService.updateStayDetail(id, payload)
      if (type === 'delete') return propertyService.deleteStayDetail(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Stay created', update: 'Stay updated', delete: 'Stay deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries({ queryKey: ['stayDetails'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed'),
  })

  const addStayDetail = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateStayDetail = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteStayDetail = (id) => mutation.mutateAsync({ id, type: 'delete' })

  return {
    stayDetails,
    isLoading,
    fetchStayDetails: refetch,
    addStayDetail,
    updateStayDetail,
    deleteStayDetail,
  }
}
