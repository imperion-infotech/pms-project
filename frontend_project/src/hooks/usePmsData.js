/**
 * usePmsData.js - Ye file poore project ka 'Brain' hai.
 * 
 * Iska kaam hai backend se data (Rooms, Floors, Buildings) fetch karna,
 * unhe global state mein save karna, aur CRUD (Add, Update, Delete)
 * operations ko handle karna. Ye hook baaki saare components ko data supply karta hai.
 */
import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services/propertyService';
import { useToast } from '../context/NotificationContext';

/**
 * Safe data extractor for Spring Boot paginated vs flat arrays
 */
const extractData = (res) => res.data?.content || (Array.isArray(res.data) ? res.data : []);

const usePmsData = () => {
  const toast = useToast();
  
  // --- MODULE STATES ---
  const [data, setData] = useState({
    buildings: [],
    floors: [],
    roomTypes: [],
    roomStatuses: [],
    rooms: [],
    taxes: [],
    personalDetails: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * fetchData()
   * Downloads all or specific property master data.
   * @param {string[]} targets - Optional list of keys to refresh (e.g. ['rooms', 'floors'])
   */
  const fetchData = useCallback(async (targets = null) => {
    // Prevent React synthetic event objects from breaking the targets logic
    if (targets && !Array.isArray(targets)) targets = null;
    setIsLoading(true);
    setError(null);
    
    // Mapping of targets to service calls
    const serviceMap = {
      floors: propertyService.getFloors,
      buildings: propertyService.getBuildings,
      roomTypes: propertyService.getRoomTypes,
      roomStatuses: propertyService.getRoomStatuses,
      rooms: propertyService.getRooms,
      taxes: propertyService.getTaxMasters,
      personalDetails: propertyService.getPersonalDetails
    };

    const keysToFetch = targets || Object.keys(serviceMap);
    
    try {
      const results = await Promise.allSettled(
        keysToFetch.map(key => serviceMap[key]())
      );

      let hasFailures = false;

      setData(prev => {
        const newData = { ...prev };
        results.forEach((res, index) => {
          const key = keysToFetch[index];
          if (res.status === 'fulfilled') {
            newData[key] = extractData(res.value);
          } else {
            hasFailures = true;
            console.error(`Failed to fetch ${key}:`, res.reason);
          }
        });
        return newData;
      });
      
      if (hasFailures) {
        toast.warn("Some data could not be synchronized.", "Sync Warning");
      }
    } catch {
      setError('Critical: Failed to synchronize data hierarchy.');
      toast.error("Failed to connect to the property server.", "Connection Error");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * executeAction()
   * Generic helper with automatic success/error notifications
   */
  const executeAction = async (action, successMsg, refreshTargets, ...args) => {
    try {
      const result = await action(...args);
      toast.success(successMsg);
      await fetchData(refreshTargets); 
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "An unexpected error occurred.";
      toast.error(errorMsg, "Action Failed");
      throw err;
    }
  };

  /**
   * Internal search helper
   */
  const executeSearch = useCallback(async (searchFn, key) => {
    setIsLoading(true);
    try {
      const res = await searchFn();
      setData(prev => ({ ...prev, [key]: extractData(res) }));
    } catch {
      toast.error(`Search for ${key} failed`);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Memoized Search Operations (replaces state with results)
  const searchRooms = useCallback((query) => executeSearch(() => propertyService.searchRooms(query), 'rooms'), [executeSearch]);
  const searchFloors = useCallback((query) => executeSearch(() => propertyService.searchFloors(query), 'floors'), [executeSearch]);
  const searchBuildings = useCallback((query) => executeSearch(() => propertyService.searchBuildings(query), 'buildings'), [executeSearch]);
  const searchRoomTypes = useCallback((query) => executeSearch(() => propertyService.searchRoomTypes(query), 'roomTypes'), [executeSearch]);
  const searchRoomStatuses = useCallback((query) => executeSearch(() => propertyService.searchRoomStatuses(query), 'roomStatuses'), [executeSearch]);

  return {
    ...data,
    isLoading,
    error,
    fetchData,
    searchRooms,
    searchFloors,
    searchBuildings,
    searchRoomTypes,
    searchRoomStatuses,
    
    // Optimized CRUD with selective refreshing
    addFloor: (payload) => executeAction(propertyService.createFloor, "Floor created successfully", ['floors'], payload),
    updateFloor: (id, payload) => executeAction(propertyService.updateFloor, "Floor updated successfully", ['floors'], id, payload),
    deleteFloor: (id) => executeAction(propertyService.deleteFloor, "Floor deleted successfully", ['floors'], id),

    addBuilding: (payload) => executeAction(propertyService.createBuilding, "Building created successfully", ['buildings'], payload),
    updateBuilding: (id, payload) => executeAction(propertyService.updateBuilding, "Building updated successfully", ['buildings'], id, payload),
    deleteBuilding: (id) => executeAction(propertyService.deleteBuilding, "Building deleted successfully", ['buildings'], id),

    addRoomType: (payload) => executeAction(propertyService.createRoomType, "Room type created successfully", ['roomTypes'], payload),
    updateRoomType: (id, payload) => executeAction(propertyService.updateRoomType, "Room type updated successfully", ['roomTypes'], id, payload),
    deleteRoomType: (id) => executeAction(propertyService.deleteRoomType, "Room type deleted successfully", ['roomTypes'], id),

    addRoomStatus: (payload) => executeAction(propertyService.createRoomStatus, "Room status created successfully", ['roomStatuses'], payload),
    updateRoomStatus: (id, payload) => executeAction(propertyService.updateRoomStatus, "Room status updated successfully", ['roomStatuses'], id, payload),
    deleteRoomStatus: (id) => executeAction(propertyService.deleteRoomStatus, "Room status deleted successfully", ['roomStatuses'], id),

    addRoom: (payload) => executeAction(propertyService.createRoom, "Room created successfully", ['rooms'], payload),
    updateRoom: (id, payload) => executeAction(propertyService.updateRoom, "Room updated successfully", ['rooms'], id, payload),
    deleteRoom: (id) => executeAction(propertyService.deleteRoom, "Room deleted successfully", ['rooms'], id),

    addTax: (payload) => executeAction(propertyService.createTaxMaster, "Tax record created successfully", ['taxes'], payload),
    updateTax: (id, payload) => executeAction(propertyService.updateTaxMaster, "Tax record updated successfully", ['taxes'], id, payload),
    deleteTax: (id) => executeAction(propertyService.deleteTaxMaster, "Tax record deleted successfully", ['taxes'], id),

    addPersonalDetail: (payload) => executeAction(propertyService.createPersonalDetail, "Guest profile created", ['personalDetails'], payload),
    updatePersonalDetail: (id, payload) => executeAction(propertyService.updatePersonalDetail, "Guest profile updated", ['personalDetails'], id, payload),
    deletePersonalDetail: (id) => executeAction(propertyService.deletePersonalDetail, "Guest profile deleted", ['personalDetails'], id),
  };
};

export default usePmsData;
