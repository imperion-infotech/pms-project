import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsDocumentDetails = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: documentDetails = [], isLoading, refetch } = useQuery({
    queryKey: ['documentDetails'],
    queryFn: async () => {
      const res = await propertyService.getDocumentDetails()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 5
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createDocumentDetail(payload)
      if (type === 'update') return propertyService.updateDocumentDetail(id, payload)
      if (type === 'delete') return propertyService.deleteDocumentDetail(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Document added!', update: 'Document updated!', delete: 'Document deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries({ queryKey: ['documentDetails'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addDocumentDetail = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateDocumentDetail = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteDocumentDetail = (id) => mutation.mutateAsync({ id, type: 'delete' })

  const fetchDocumentDetailsByPersonalDetailId = useCallback(async (personalDetailId) => {
    const rawData = await queryClient.fetchQuery({
      queryKey: ['documentDetails'],
      queryFn: async () => extractData(await propertyService.getDocumentDetails())
    })
    return rawData.filter(
      (item) => String(item.personalDetails?.id || item.personalDetailsId) === String(personalDetailId)
    )
  }, [queryClient])

  const searchDocumentDetails = async (query) => {
    const res = await propertyService.searchDocumentDetails(query)
    queryClient.setQueryData(['documentDetails'], extractData(res))
  }

  return { 
    documentDetails, 
    isLoading, 
    fetchDocumentDetails: refetch, 
    fetchDocumentDetailsByPersonalDetailId, 
    addDocumentDetail, 
    updateDocumentDetail, 
    deleteDocumentDetail, 
    searchDocumentDetails 
  }
}
