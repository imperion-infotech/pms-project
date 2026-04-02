import { useState, useEffect, useCallback } from 'react'
import { propertyService } from '../services/propertyService'
import { useToast } from '../context/NotificationContext'

const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : [])

export const usePmsBuildings = () => {
  const [buildings, setBuildings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const fetchBuildings = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await propertyService.getBuildings()
      setBuildings(extractData(res))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch buildings')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBuildings()
  }, [fetchBuildings])

  const addBuilding = useCallback(
    async (payload) => {
      try {
        const res = await propertyService.createBuilding(payload)
        toast.success('Building created successfully')
        fetchBuildings()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create building')
        throw err
      }
    },
    [fetchBuildings, toast],
  )

  const updateBuilding = useCallback(
    async (id, payload) => {
      try {
        const res = await propertyService.updateBuilding(id, payload)
        toast.success('Building updated successfully')
        fetchBuildings()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update building')
        throw err
      }
    },
    [fetchBuildings, toast],
  )

  const deleteBuilding = useCallback(
    async (id) => {
      try {
        const res = await propertyService.deleteBuilding(id)
        toast.success('Building deleted successfully')
        fetchBuildings()
        return res
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete building')
        throw err
      }
    },
    [fetchBuildings, toast],
  )

  const searchBuildings = useCallback(
    async (query) => {
      setIsLoading(true)
      try {
        const res = await propertyService.searchBuildings(query)
        setBuildings(extractData(res))
      } catch (err) {
        toast.error(err.response?.data?.message || 'Building search failed')
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return {
    buildings,
    isLoading,
    fetchBuildings,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    searchBuildings,
  }
}
