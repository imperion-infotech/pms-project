import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsDocumentTypes = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: documentTypes = [], isLoading, refetch } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: async () => {
      const res = await propertyService.getDocumentTypes()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 30 // Constant types
  })

  const mutation = useMutation({
    mutationFn: ({ id, payload, type }) => {
      if (type === 'create') return propertyService.createDocumentType(payload)
      if (type === 'update') return propertyService.updateDocumentType(id, payload)
      if (type === 'delete') return propertyService.deleteDocumentType(id)
    },
    onSuccess: (_, variables) => {
      const msgs = { create: 'Document Type created!', update: 'Document Type updated!', delete: 'Document Type deleted' }
      toast.success(msgs[variables.type])
      queryClient.invalidateQueries(['documentTypes'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed')
  })

  const addDocumentType = (payload) => mutation.mutateAsync({ payload, type: 'create' })
  const updateDocumentType = (id, payload) => mutation.mutateAsync({ id, payload, type: 'update' })
  const deleteDocumentType = (id) => mutation.mutateAsync({ id, type: 'delete' })

  const searchDocumentTypes = async (query) => {
    const res = await propertyService.searchDocumentTypes(query)
    queryClient.setQueryData(['documentTypes'], extractData(res))
  }

  return { documentTypes, isLoading, fetchDocumentTypes: refetch, addDocumentType, updateDocumentType, deleteDocumentType, searchDocumentTypes }
}
