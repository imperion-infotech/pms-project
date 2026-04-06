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
import { usePmsDocumentDetails } from './usePmsDocumentDetails'
import { usePmsStayDetails } from './usePmsStayDetails'
import { usePmsRentDetails } from './usePmsRentDetails'
import { usePmsGuestDetails } from './usePmsGuestDetails'

const usePmsData = () => {
  const floorsData = usePmsFloors()
  const buildingsData = usePmsBuildings()
  const roomTypesData = usePmsRoomTypes()
  const roomStatusesData = usePmsRoomStatus()
  const roomsData = usePmsRooms()
  const taxesData = usePmsTaxes()
  const guestData = usePmsGuests()
  const docTypeData = usePmsDocumentTypes()
  const docDetailData = usePmsDocumentDetails()
  const stayData = usePmsStayDetails()
  const rentData = usePmsRentDetails()
  const guestDetailsData = usePmsGuestDetails()

  const { fetchFloors } = floorsData
  const { fetchBuildings } = buildingsData
  const { fetchRoomTypes } = roomTypesData
  const { fetchRoomStatuses, getRoomStatusById } = roomStatusesData
  const { fetchRooms } = roomsData
  const { fetchTaxes } = taxesData
  const { fetchPersonalDetails, fetchPersonalDetailById } = guestData
  const { fetchDocumentTypes } = docTypeData
  const { fetchDocumentDetails } = docDetailData
  const { fetchStayDetails } = stayData
  const { fetchRentDetails } = rentData
  const { fetchGuestDetails } = guestDetailsData

  const fetchData = useCallback(async () => {
    await Promise.all([
      fetchFloors(),
      fetchBuildings(),
      fetchRoomTypes(),
      fetchRoomStatuses(),
      fetchRooms(),
      fetchTaxes(),
      fetchPersonalDetails(),
      fetchDocumentTypes(),
      fetchDocumentDetails(),
      fetchStayDetails(),
      fetchRentDetails(),
      fetchGuestDetails(),
    ])
  }, [
    fetchFloors,
    fetchBuildings,
    fetchRoomTypes,
    fetchRoomStatuses,
    fetchRooms,
    fetchTaxes,
    fetchPersonalDetails,
    fetchDocumentTypes,
    fetchDocumentDetails,
    fetchStayDetails,
    fetchRentDetails,
    fetchGuestDetails,
  ])

  return {
    ...floorsData,
    ...buildingsData,
    ...roomTypesData,
    ...roomStatusesData,
    ...roomsData,
    ...taxesData,
    ...guestData,
    ...docTypeData,
    ...docDetailData,
    ...stayData,
    ...rentData,
    ...guestDetailsData,

    fetchData,
    fetchPersonalDetailById,
    getRoomStatusById,

    // Aggregated Loading/Error
    isLoading:
      floorsData.isLoading ||
      buildingsData.isLoading ||
      roomsData.isLoading ||
      roomTypesData.isLoading ||
      roomStatusesData.isLoading ||
      taxesData.isLoading ||
      guestData.isLoading ||
      docTypeData.isLoading ||
      docDetailData.isLoading ||
      stayData.isLoading ||
      rentData.isLoading ||
      guestDetailsData.isLoading,
  }
}

export default usePmsData
