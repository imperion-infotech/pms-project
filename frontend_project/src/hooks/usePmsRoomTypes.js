import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchRoomTypes = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getRoomTypes()
      setRoomTypes(extractData(res))
    } catch (err) {
      toast.error('Failed to fetch room types')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchRoomTypes()
  }, [fetchRoomTypes])

  const addRoomType = useCallback(async (payload) => {
    try {
      const res = await propertyService.createRoomType(payload)
      toast.success('Room type created successfully')
      fetchRoomTypes()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room type')
      throw err
    }
  }, [fetchRoomTypes, toast])

  const updateRoomType = useCallback(async (id, payload) => {
    try {
      const res = await propertyService.updateRoomType(id, payload)
      toast.success('Room type updated successfully')
      fetchRoomTypes()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update room type')
      throw err
    }
  }, [fetchRoomTypes, toast])

  const deleteRoomType = useCallback(async (id) => {
    try {
      const res = await propertyService.deleteRoomType(id)
      toast.success('Room type deleted successfully')
      fetchRoomTypes()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete room type')
      throw err
    }
  }, [fetchRoomTypes, toast])

  const searchRoomTypes = useCallback(async (query) => {
    setIsLoading(true)
    try {
      const res = await propertyService.searchRoomTypes(query)
      setRoomTypes(extractData(res))
    } catch (err) {
      toast.error('Room type search failed')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return { roomTypes, isLoading, fetchRoomTypes, addRoomType, updateRoomType, deleteRoomType, searchRoomTypes }
}
