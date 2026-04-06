/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { propertyService } from '../services/propertyService'

const PMSDataContext = createContext()

export const usePMSDataState = () => {
  const context = useContext(PMSDataContext)
  if (!context) {
    throw new Error('usePMSDataState must be used within a PMSDataProvider')
  }
  return context
}

const extractData = (res) => res?.data?.content || (Array.isArray(res?.data) ? res.data : [])

/**
 * PMSDataProvider - Centralized state for all PMS entities.
 */
export const PMSDataProvider = ({ children }) => {
  const [state, setState] = useState({
    buildings: [],
    floors: [],
    roomTypes: [],
    roomStatuses: [],
    rooms: [],
    taxes: [],
    personalDetails: [],
    documentTypes: [],
    documentDetails: [],
    stayDetails: [],
    isLoading: false,
    error: null,
  })

  const updateEntityState = useCallback((entity, data) => {
    setState((prev) => ({ ...prev, [entity]: data }))
  }, [])

  const setLoading = useCallback((val) => {
    setState((prev) => ({ ...prev, isLoading: val }))
  }, [])

  const fetchEntity = useCallback(async (apiCall, entityName, stateKey) => {
    try {
      const res = await apiCall()
      const data = extractData(res)
      setState((prev) => ({ ...prev, [stateKey]: data }))
      return data
    } catch (err) {
      console.error(`Failed to fetch ${entityName}:`, err)
      return []
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchEntity(propertyService.getBuildings, 'Buildings', 'buildings'),
        fetchEntity(propertyService.getFloors, 'Floors', 'floors'),
        fetchEntity(propertyService.getRoomTypes, 'Room Types', 'roomTypes'),
        fetchEntity(propertyService.getRoomStatuses, 'Room Statuses', 'roomStatuses'),
        fetchEntity(propertyService.getRooms, 'Rooms', 'rooms'),
        fetchEntity(propertyService.getTaxMasters, 'Taxes', 'taxes'),
        fetchEntity(propertyService.getPersonalDetails, 'Guests', 'personalDetails'),
        fetchEntity(propertyService.getDocumentTypes, 'Doc Types', 'documentTypes'),
        fetchEntity(propertyService.getDocumentDetails, 'Doc Details', 'documentDetails'),
        fetchEntity(propertyService.getStayDetails, 'Stay Details', 'stayDetails'),
      ])
    } finally {
      setLoading(false)
    }
  }, [fetchEntity, setLoading])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const value = useMemo(
    () => ({
      ...state,
      refreshAll: fetchAllData,
      refreshEntity: fetchEntity,
      updateEntityState,
    }),
    [state, fetchAllData, fetchEntity, updateEntityState],
  )

  return <PMSDataContext.Provider value={value}>{children}</PMSDataContext.Provider>
}
