import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsRooms = () => {
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchRooms = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getRooms()
      setRooms(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch rooms')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const addRoom = useCallback(async (payload) => {
    try {
      const res = await propertyService.createRoom(payload)
      toast.success('Room created successfully')
      fetchRooms()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room')
      throw err
    }
  }, [fetchRooms, toast])

  const updateRoom = useCallback(async (id, payload) => {
    // Optimistic update
    setRooms(prev => prev.map(r => String(r.id) === String(id) ? { ...r, ...payload } : r))
    
    try {
      const res = await propertyService.updateRoom(id, payload)
      toast.success('Room updated successfully')
      fetchRooms()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update room')
      fetchRooms() // Rollback
      throw err
    }
  }, [fetchRooms, toast])

  const deleteRoom = useCallback(async (id) => {
    try {
      const res = await propertyService.deleteRoom(id)
      toast.success('Room deleted successfully')
      fetchRooms()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete room')
      throw err
    }
  }, [fetchRooms, toast])

  const searchRooms = useCallback(async (query) => {
    setIsLoading(true)
    try {
      const res = await propertyService.searchRooms(query)
      setRooms(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Room search failed')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return { rooms, isLoading, fetchRooms, addRoom, updateRoom, deleteRoom, searchRooms }
}
