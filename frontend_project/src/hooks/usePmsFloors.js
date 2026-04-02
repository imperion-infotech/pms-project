import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsFloors = () => {
  const [floors, setFloors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchFloors = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getFloors()
      setFloors(extractData(res))
    } catch (err) {
      toast.error('Failed to fetch floors')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchFloors()
  }, [fetchFloors])

  const addFloor = useCallback(async (payload) => {
    try {
      const res = await propertyService.createFloor(payload)
      toast.success('Floor created successfully')
      fetchFloors()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create floor')
      throw err
    }
  }, [fetchFloors, toast])

  const updateFloor = useCallback(async (id, payload) => {
    try {
      const res = await propertyService.updateFloor(id, payload)
      toast.success('Floor updated successfully')
      fetchFloors()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update floor')
      throw err
    }
  }, [fetchFloors, toast])

  const deleteFloor = useCallback(async (id) => {
    try {
      const res = await propertyService.deleteFloor(id)
      toast.success('Floor deleted successfully')
      fetchFloors()
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete floor')
      throw err
    }
  }, [fetchFloors, toast])

  const searchFloors = useCallback(async (query) => {
    setIsLoading(true)
    try {
      const res = await propertyService.searchFloors(query)
      setFloors(extractData(res))
    } catch (err) {
      toast.error('Floor search failed')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return { floors, isLoading, fetchFloors, addFloor, updateFloor, deleteFloor, searchFloors }
}
