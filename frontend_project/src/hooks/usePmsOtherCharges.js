import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsOtherCharges = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: otherCharges = [], isLoading, refetch } = useQuery({
    queryKey: ['otherCharges'],
    queryFn: async () => {
      const res = await propertyService.getOtherCharges()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 15
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createOtherCharge(payload)
      if (type === 'update') return propertyService.updateOtherCharge(id, payload)
      if (type === 'delete') return propertyService.deleteOtherCharge(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Other Charge created!', update: 'Other Charge updated!', delete: 'Other Charge deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries(['otherCharges'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addOtherCharge = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateOtherCharge = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteOtherCharge = (id) => mutation.mutateAsync({ id, type: 'delete' })

  const searchOtherCharges = async (query) => {
    const res = await propertyService.searchOtherCharges(query)
    queryClient.setQueryData(['otherCharges'], extractData(res))
  }

  return { otherCharges, isLoading, fetchOtherCharges: refetch, addOtherCharge, updateOtherCharge, deleteOtherCharge, searchOtherCharges }
}
