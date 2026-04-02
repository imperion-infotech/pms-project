/**
 * usePmsData.js - Aggregator Hook (Backward Compatible)
 * 
 * Ye hook ab modular hooks (usePmsFloors, usePmsBuildings, etc.)
 * ko combine karta hai taaki purana code na toote.
 */
import { useCallback } from 'react'
import { usePmsFloors } from './usePmsFloors'
import { usePmsBuildings } from './usePmsBuildings'
import { usePmsRoomTypes } from './usePmsRoomTypes'
import { usePmsRoomStatus } from './usePmsRoomStatus'
import { usePmsRooms } from './usePmsRooms'
import { usePmsTaxes } from './usePmsTaxes'
import { usePmsGuests } from './usePmsGuests'
import { usePmsDocumentTypes } from './usePmsDocumentTypes'

const usePmsData = () => {
  const floorsData = usePmsFloors()
  const buildingsData = usePmsBuildings()
  const roomTypesData = usePmsRoomTypes()
  const roomStatusesData = usePmsRoomStatus()
  const roomsData = usePmsRooms()
  const taxesData = usePmsTaxes()
  const guestData = usePmsGuests()
  const docData = usePmsDocumentTypes()

  const fetchData = useCallback(async () => {
    await Promise.all([
      floorsData.fetchFloors(),
      buildingsData.fetchBuildings(),
      roomTypesData.fetchRoomTypes(),
      roomStatusesData.fetchRoomStatuses(),
      roomsData.fetchRooms(),
      taxesData.fetchTaxes(),
      guestData.fetchPersonalDetails(),
      docData.fetchDocumentTypes(),
    ])
  }, [
    floorsData.fetchFloors,
    buildingsData.fetchBuildings,
    roomTypesData.fetchRoomTypes,
    roomStatusesData.fetchRoomStatuses,
    roomsData.fetchRooms,
    taxesData.fetchTaxes,
    guestData.fetchPersonalDetails,
    docData.fetchDocumentTypes,
  ])

  return {
    ...floorsData,
    ...buildingsData,
    ...roomTypesData,
    ...roomStatusesData,
    ...roomsData,
    ...taxesData,
    ...guestData,
    ...docData,

    fetchData,

    // Aggregated Loading/Error
    isLoading:
      floorsData.isLoading ||
      buildingsData.isLoading ||
      roomsData.isLoading ||
      roomTypesData.isLoading ||
      roomStatusesData.isLoading ||
      taxesData.isLoading ||
      guestData.isLoading ||
      docData.isLoading,
  }
}

export default usePmsData
