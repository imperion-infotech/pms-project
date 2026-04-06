import { useState, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsDocumentDetails = () => {
  const [documentDetails, setDocumentDetails] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchDocumentDetails = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getDocumentDetails()
      const rawData = extractData(res)
      setDocumentDetails(rawData)
      return rawData
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch all document details')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const fetchDocumentDetailsByPersonalDetailId = useCallback(
    async (personalDetailId) => {
      setIsLoading(true)
      try {
        const res = await propertyService.getDocumentDetails()
        const rawData = extractData(res)
        const guestDocs = rawData.filter(
          (item) =>
            String(item.personalDetails?.id || item.personalDetailsId) === String(personalDetailId),
        )
        setDocumentDetails(guestDocs)
        return guestDocs
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch document details')
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const addDocumentDetail = useCallback(
    async (payload) => {
      console.log('--- Creating Document (Payload) ---:', payload)
      try {
        const res = await propertyService.createDocumentDetail(payload)
        console.log('--- Create Document Success ---:', res.data)
        toast.success('Document added!')
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add document')
        throw err
      }
    },
    [toast],
  )

  const updateDocumentDetail = useCallback(
    async (id, payload) => {
      console.log(`--- Updating Document ID ${id} (Payload) ---:`, payload)
      try {
        const res = await propertyService.updateDocumentDetail(id, payload)
        console.log('--- Update Document Success ---:', res.data)
        toast.success('Document updated!')
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update document')
        throw err
      }
    },
    [toast],
  )

  const deleteDocumentDetail = useCallback(
    async (id) => {
      console.log(`--- Deleting Document ID ${id} ---`)
      try {
        const res = await propertyService.deleteDocumentDetail(id)
        console.log('--- Delete Document Success ---:', res.data)
        toast.success('Document deleted successfully')
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete document')
        throw err
      }
    },
    [toast],
  )

  const searchDocumentDetails = useCallback(
    async (query) => {
      setIsLoading(true)
      try {
        const res = await propertyService.searchDocumentDetails(query)
        const rawData = extractData(res)
        setDocumentDetails(rawData)
        return rawData
      } catch (err) {
        toast.error(err.response?.data?.message || 'Document search failed')
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return {
    documentDetails,
    isLoading,
    fetchDocumentDetails,
    fetchDocumentDetailsByPersonalDetailId,
    addDocumentDetail,
    updateDocumentDetail,
    deleteDocumentDetail,
    searchDocumentDetails,
    setDocumentDetails,
  }
}
