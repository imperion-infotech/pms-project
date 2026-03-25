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
  const [floors, setFloors] = useState([]);           // List of all floors
  const [roomTypes, setRoomTypes] = useState([]);     // List of room categories (Standard, Deluxe, etc.)
  const [roomStatuses, setRoomStatuses] = useState([]); // List of statuses (Clean, Dirty, maintenance, etc.)
  const [rooms, setRooms] = useState([]);             // List of physical rooms

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
        propertyService.getRoomTypes(),
        propertyService.getRoomStatuses(),
        propertyService.getRooms(),
      ]);

      // Distribute the results into their respective states
      const [floorsRes, roomTypesRes, roomStatusesRes, roomsRes] = results.map(
        (res) => (res.status === 'fulfilled' ? res.value : { data: [] })
      );

      setFloors(floorsRes.data || []);
      setRoomTypes(roomTypesRes.data || []);
      setRoomStatuses(roomStatusesRes.data || []);
      setRooms(roomsRes.data || []);

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
  const deleteFloor = (id) => executeAction(propertyService.deleteFloor, id);

  // Room Type Operations
  const addRoomType = (data) => executeAction(propertyService.createRoomType, data);
  const updateRoomType = (id, data) => executeAction(propertyService.updateRoomType, id, data);
  const deleteRoomType = (id) => executeAction(propertyService.deleteRoomType, id);

  // Room Status Operations
  const addRoomStatus = (data) => executeAction(propertyService.createRoomStatus, data);
  const updateRoomStatus = (id, data) => executeAction(propertyService.updateRoomStatus, id, data);
  const deleteRoomStatus = (id) => executeAction(propertyService.deleteRoomStatus, id);

  // Room Operations
  const addRoom = (data) => executeAction(propertyService.createRoom, data);
  const updateRoom = (id, data) => executeAction(propertyService.updateRoom, id, data);
  const deleteRoom = (id) => executeAction(propertyService.deleteRoom, id);

  return {
    floors,
    roomTypes,
    roomStatuses,
    rooms,
    isLoading,
    error,
    fetchData,
    addFloor, updateFloor, deleteFloor,
    addRoomType, updateRoomType, deleteRoomType,
    addRoomStatus, updateRoomStatus, deleteRoomStatus,
    addRoom, updateRoom, deleteRoom
  };
};

export default usePmsData;


