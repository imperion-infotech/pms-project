import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsPaymentTypes = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: paymentTypes = [], isLoading, refetch } = useQuery({
    queryKey: ['paymentTypes'],
    queryFn: async () => {
      const res = await propertyService.getPaymentTypes()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 30 // Rare changes
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createPaymentType(payload)
      if (type === 'update') return propertyService.updatePaymentType(id, payload)
      if (type === 'delete') return propertyService.deletePaymentType(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Payment Type created!', update: 'Payment Type updated!', delete: 'Payment Type deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries({ queryKey: ['paymentTypes'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addPaymentType = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updatePaymentType = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deletePaymentType = (id) => mutation.mutateAsync({ id, type: 'delete' })

  const searchPaymentTypes = async (query) => {
    const res = await propertyService.searchPaymentTypes(query)
    queryClient.setQueryData(['paymentTypes'], extractData(res))
  }

  return { paymentTypes, isLoading, fetchPaymentTypes: refetch, addPaymentType, updatePaymentType, deletePaymentType, searchPaymentTypes }
}
