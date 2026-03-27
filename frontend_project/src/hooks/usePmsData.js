/**
 * usePmsData.js - Custom React Hook for Property Data
 * 
 * Purpose:
 * This hook acts as a "single source of truth" for all property-related data
 * (Floors, Room Types, Statuses, and Rooms). It manages the state and 
 * provides CRUD (Create, Read, Update, Delete) functions to the components.
 * 
 * Benefits:
 * 1. Logic Reuse: Any component can access the same property data easily.
 * 2. Auto-Sync: Every time a record is added or updated, the fetch logic 
 *    automatically refreshes the list from the server.
 */
import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services/propertyService';

const usePmsData = () => {
  // --- MODULE STATES ---
  const [buildings, setBuildings] = useState([]);     // List of all buildings
  const [floors, setFloors] = useState([]);           // List of all floors
  const [roomTypes, setRoomTypes] = useState([]);     // List of room categories (Standard, Deluxe, etc.)
  const [roomStatuses, setRoomStatuses] = useState([]); // List of statuses (Clean, Dirty, maintenance, etc.)
  const [rooms, setRooms] = useState([]);             // List of physical rooms
  const [taxes, setTaxes] = useState([]);             // List of tax masters
  const [personalDetails, setPersonalDetails] = useState([]); // List of guest profiles


  const [isLoading, setIsLoading] = useState(false);  // Global loading state for calculations
  const [error, setError] = useState(null);           // Error message storage

  /**
   * fetchData()
   * Downloads all property master data from the backend concurrently.
   * Uses Promise.allSettled to ensure that even if one API call fails,
   * others can still complete and show data.
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        propertyService.getFloors(),
        propertyService.getBuildings(),
        propertyService.getRoomTypes(),
        propertyService.getRoomStatuses(),
        propertyService.getRooms(),
        propertyService.getTaxMasters(),
        propertyService.getPersonalDetails()

      ]);

      // Distribute the results into their respective states
      const [floorsRes, buildingsRes, roomTypesRes, roomStatusesRes, roomsRes, taxesRes, personalRes] = results.map(
        (res) => (res.status === 'fulfilled' ? res.value : { data: [] })
      );

      // Handle both plain array and Spring Boot paginated object (data.content)
      setFloors(floorsRes.data?.content || (Array.isArray(floorsRes.data) ? floorsRes.data : []));
      setBuildings(buildingsRes.data?.content || (Array.isArray(buildingsRes.data) ? buildingsRes.data : []));
      setRoomTypes(roomTypesRes.data?.content || (Array.isArray(roomTypesRes.data) ? roomTypesRes.data : []));
      setRoomStatuses(roomStatusesRes.data?.content || (Array.isArray(roomStatusesRes.data) ? roomStatusesRes.data : []));
      setRooms(roomsRes.data?.content || (Array.isArray(roomsRes.data) ? roomsRes.data : []));
      setTaxes(taxesRes.data?.content || (Array.isArray(taxesRes.data) ? taxesRes.data : []));
      setPersonalDetails(personalRes.data?.content || (Array.isArray(personalRes.data) ? personalRes.data : []));


      if (results.some(r => r.status === 'rejected')) {
        console.warn("One or more fetch requests failed, some data may be missing.");
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to synchronize data.');
    } finally {
      // Small artificial delay to prevent UI flickering on fast networks
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  // Fetch initial data when the hook is first mounted
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * executeAction()
   * Generic helper that runs a service function and then re-triggers 
   * the data fetch to keep the UI in sync with the database.
   */
  const executeAction = async (action, ...args) => {
    try {
      const result = await action(...args);
      await fetchData(); // Refresh all data after any write operation
      return result;
    } catch (err) {
      console.error('Action failed:', err);
      throw err;
    }
  };

  // --- EXPORTED CRUD OPERATIONS ---

  // Floor Operations
  const addFloor = (data) => executeAction(propertyService.createFloor, data);
  const updateFloor = (id, data) => executeAction(propertyService.updateFloor, id, data);
  console.log("Update Floor", updateFloor);
  const deleteFloor = (id) => executeAction(propertyService.deleteFloor, id);

  // Building Operations
  const addBuilding = (data) => executeAction(propertyService.createBuilding, data);
  const updateBuilding = (id, data) => executeAction(propertyService.updateBuilding, id, data);
  console.log("Update Building", updateBuilding);
  const deleteBuilding = (id) => executeAction(propertyService.deleteBuilding, id);

  // Room Type Operations
  const addRoomType = (data) => executeAction(propertyService.createRoomType, data);
  const updateRoomType = (id, data) => executeAction(propertyService.updateRoomType, id, data);
  console.log("Update Room Type", updateRoomType);
  const deleteRoomType = (id) => executeAction(propertyService.deleteRoomType, id);

  // Room Status Operations
  const addRoomStatus = (data) => executeAction(propertyService.createRoomStatus, data);
  const updateRoomStatus = (id, data) => executeAction(propertyService.updateRoomStatus, id, data);
  console.log("Update Room Status", updateRoomStatus);
  const deleteRoomStatus = (id) => executeAction(propertyService.deleteRoomStatus, id);

  // Room Operations
  const addRoom = (data) => executeAction(propertyService.createRoom, data);
  const updateRoom = (id, data) => executeAction(propertyService.updateRoom, id, data);
  console.log("Update Room", updateRoom);
  const deleteRoom = (id) => executeAction(propertyService.deleteRoom, id);

  // Tax Operations
  const addTax = (data) => executeAction(propertyService.createTaxMaster, data);
  const updateTax = (id, data) => executeAction(propertyService.updateTaxMaster, id, data);
  console.log("Update Tax", updateTax);
  const deleteTax = (id) => executeAction(propertyService.deleteTaxMaster, id);

  // Personal Detail Operations
  const addPersonalDetail = (data) => executeAction(propertyService.createPersonalDetail, data);
  const updatePersonalDetail = (id, data) => executeAction(propertyService.updatePersonalDetail, id, data);
  console.log("Update Personal Detail", updatePersonalDetail);
  const deletePersonalDetail = (id) => executeAction(propertyService.deletePersonalDetail, id);

  // --- SEARCH OPERATIONS ---
  const searchRooms = async (query) => {
    setIsLoading(true);
    try {
      const res = await propertyService.searchRooms(query);
      setRooms(res.data?.content || (Array.isArray(res.data) ? res.data : []));
    } catch (err) { console.error('Search rooms failed:', err); }
    finally { setIsLoading(false); }
  };

  const searchFloors = async (query) => {
    setIsLoading(true);
    try {
      const res = await propertyService.searchFloors(query);
      setFloors(res.data?.content || (Array.isArray(res.data) ? res.data : []));
    } catch (err) { console.error('Search floors failed:', err); }
    finally { setIsLoading(false); }
  };

  const searchBuildings = async (query) => {
    setIsLoading(true);
    try {
      const res = await propertyService.searchBuildings(query);
      setBuildings(res.data?.content || (Array.isArray(res.data) ? res.data : []));
    } catch (err) { console.error('Search buildings failed:', err); }
    finally { setIsLoading(false); }
  };

  const searchRoomTypes = async (query) => {
    setIsLoading(true);
    try {
      const res = await propertyService.searchRoomTypes(query);
      setRoomTypes(res.data?.content || (Array.isArray(res.data) ? res.data : []));
    } catch (err) { console.error('Search room types failed:', err); }
    finally { setIsLoading(false); }
  };

  const searchRoomStatuses = async (query) => {
    setIsLoading(true);
    try {
      const res = await propertyService.searchRoomStatuses(query);
      setRoomStatuses(res.data?.content || (Array.isArray(res.data) ? res.data : []));
    } catch (err) { console.error('Search room statuses failed:', err); }
    finally { setIsLoading(false); }
  };


  return {
    floors,
    buildings,
    roomTypes,
    roomStatuses,
    rooms,
    personalDetails,
    taxes,
    isLoading,
    error,
    fetchData,
    addFloor, updateFloor, deleteFloor,
    addBuilding, updateBuilding, deleteBuilding,
    addRoomType, updateRoomType, deleteRoomType,
    addRoomStatus, updateRoomStatus, deleteRoomStatus,
    addRoom, updateRoom, deleteRoom,
    addTax, updateTax, deleteTax,
    addPersonalDetail, updatePersonalDetail, deletePersonalDetail,
    searchRooms, searchFloors, searchBuildings, searchRoomTypes, searchRoomStatuses,

  };
};

export default usePmsData;


