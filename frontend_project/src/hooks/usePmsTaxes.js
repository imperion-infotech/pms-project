import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsTaxes = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: taxes = [], isLoading, refetch } = useQuery({
    queryKey: ['taxes'],
    queryFn: async () => {
      const res = await propertyService.getTaxMasters()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 15 // Taxes don't change often
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createTaxMaster(payload)
      if (type === 'update') return propertyService.updateTaxMaster(id, payload)
      if (type === 'delete') return propertyService.deleteTaxMaster(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Tax record created', update: 'Tax record updated', delete: 'Tax record deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries({ queryKey: ['taxes'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addTax = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateTax = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteTax = (id) => mutation.mutateAsync({ id, type: 'delete' })

  const getTaxMasterById = useCallback(async (id) => {
    try {
      const res = await propertyService.getTaxMasterById(id)
      return res.data
    } catch (err) {
      toast.error('Failed to fetch tax details')
      throw err
    }
  }, [toast])

  const searchTaxMasters = async (query) => {
    const res = await propertyService.searchTaxMasters(query)
    queryClient.setQueryData(['taxes'], extractData(res))
  }

  return { taxes, isLoading, fetchTaxes: refetch, getTaxMasterById, addTax, updateTax, deleteTax, searchTaxMasters }
}
