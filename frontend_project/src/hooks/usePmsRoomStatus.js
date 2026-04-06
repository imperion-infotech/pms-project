import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsRoomStatus = () => {
  const [roomStatuses, setRoomStatuses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchRoomStatuses = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getRoomStatuses()
      setRoomStatuses(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch room statuses')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchRoomStatuses()
  }, [fetchRoomStatuses])

  const addRoomStatus = useCallback(
    async (payload) => {
      try {
        const res = await propertyService.createRoomStatus(payload)
        toast.success('Room status created successfully')
        fetchRoomStatuses()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create room status')
        throw err
      }
    },
    [fetchRoomStatuses, toast],
  )

  const updateRoomStatus = useCallback(
    async (id, payload) => {
      try {
        const res = await propertyService.updateRoomStatus(id, payload)
        toast.success('Room status updated successfully')
        fetchRoomStatuses()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update room status')
        throw err
      }
    },
    [fetchRoomStatuses, toast],
  )

  const deleteRoomStatus = useCallback(
    async (id) => {
      try {
        const res = await propertyService.deleteRoomStatus(id)
        toast.success('Room status deleted successfully')
        fetchRoomStatuses()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete room status')
        throw err
      }
    },
    [fetchRoomStatuses, toast],
  )

  const searchRoomStatuses = useCallback(
    async (query) => {
      setIsLoading(true)
      try {
        const res = await propertyService.searchRoomStatuses(query)
        setRoomStatuses(extractData(res))
      } catch (err) {
        toast.error(err.response?.data?.message || 'Room status search failed')
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return {
    roomStatuses,
    isLoading,
    fetchRoomStatuses,
    addRoomStatus,
    updateRoomStatus,
    deleteRoomStatus,
    searchRoomStatuses,
  }
}
