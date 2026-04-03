import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchDocumentTypes = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getDocumentTypes()
      console.log('--- API Response (Document Types) ---:', res.data)
      setDocumentTypes(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch document types')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchDocumentTypes()
  }, [fetchDocumentTypes])

  const addDocumentType = useCallback(
    async (payload) => {
      try {
        const res = await propertyService.createDocumentType(payload)
        toast.success('Document Type created!')
        fetchDocumentTypes()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create document type')
        throw err
      }
    },
    [fetchDocumentTypes, toast],
  )

  const updateDocumentType = useCallback(
    async (id, payload) => {
      try {
        const res = await propertyService.updateDocumentType(id, payload)
        toast.success('Document Type updated!')
        fetchDocumentTypes()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update document type')
        throw err
      }
    },
    [fetchDocumentTypes, toast],
  )

  const deleteDocumentType = useCallback(
    async (id) => {
      try {
        const res = await propertyService.deleteDocumentType(id)
        toast.success('Document Type deleted successfully')
        fetchDocumentTypes()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete document type')
        throw err
      }
    },
    [fetchDocumentTypes, toast],
  )

  return {
    documentTypes,
    isLoading,
    fetchDocumentTypes,
    addDocumentType,
    updateDocumentType,
    deleteDocumentType,
  }
}
