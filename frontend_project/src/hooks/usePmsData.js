import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for managing Property Management System data.
 * Handles fetching and CRUD operations for Floors, Room Types, and Room Statuses.
 */
const usePmsData = () => {
  const [floors, setFloors] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ─── GET: Fetch all data ─────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    console.log('Fetching PMS data...');
    try {
      const results = await Promise.allSettled([
        api.get('/user/getfloors'),
        api.get('/user/getroomtypes'),
        api.get('/user/getroomstatuses'),
        api.get('/user/getroommasters'),
      ]);

      const [floorsRes, roomTypesRes, roomStatusesRes, roomsRes] = results.map(r => r.status === 'fulfilled' ? r.value : { data: [] });

      // Log for debugging (helps user see what comes from backend)
      console.log('Floors Raw:', floorsRes.data);
      console.log('Room Types Raw:', roomTypesRes.data);

      // Handle both pure arrays and Spring-style wrapped arrays { content: [] }
      const extractArray = (data) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.content)) return data.content;
        if (data && typeof data === 'object') {
          // Try to find any property that is an array
          const arrayProp = Object.values(data).find(val => Array.isArray(val));
          if (arrayProp) return arrayProp;
        }
        return [];
      };

      setFloors(extractArray(floorsRes.data));
      setRoomTypes(extractArray(roomTypesRes.data));
      setRoomStatuses(extractArray(roomStatusesRes.data));
      setRooms(extractArray(roomsRes.data));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Small timeout for smooth UI transition
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── GET: Fetch a single floor ────────
  const getFloorById = async (id) => {
    try {
      const response = await api.get(`/user/getfloor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching floor ${id}:`, error);
      throw error;
    }
  };

  // ─── GET: Fetch a single Room Type ────────
  const getRoomTypeById = async (id) => {
    try {
      const response = await api.get(`/user/getroomtype/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room type ${id}:`, error);
      throw error;
    }
  };

  // ─── GET: Fetch a single Room Master ───────
  const getRoomMasterById = async (id) => {
    try {
      const response = await api.get(`/user/getroommaster/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room master ${id}:`, error);
      throw error;
    }
  };

  // ─── POST: Create a new floor ────────
  const addFloor = async (floorData) => {
    try {
      await api.post('/admin/createfloor', floorData);
      await fetchData();
    } catch (error) {
      console.error('Error creating floor:', error);
      throw error;
    }
  };

  // ─── PUT: Update a floor ────────────
  const updateFloor = async (id, floorData) => {
    try {
      await api.put(`/admin/updatefloor/${id}`, floorData);
      await fetchData();
    } catch (error) {
      console.error('Error updating floor:', error);
      throw error;
    }
  };

  // ─── DELETE: Delete a floor ─────────
  const deleteFloor = async (id) => {
    try {
      await api.delete(`/admin/deletefloor/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting floor:', error);
      throw error;
    }
  };

  // ─── POST: Create a new Room Type ────────
  const addRoomType = async (typeData) => {
    try {
      await api.post('/admin/createroomtype', typeData);
      await fetchData();
    } catch (error) {
      console.error('Error creating room type:', error);
      throw error;
    }
  };

  // ─── PUT: Update a Room Type ────────
  const updateRoomType = async (id, typeData) => {
    try {
      await api.put(`/admin/updateroomtype/${id}`, typeData);
      await fetchData();
    } catch (error) {
      console.error('Error updating room type:', error);
      throw error;
    }
  };

  // ─── DELETE: Delete a Room Type ────────
  const deleteRoomType = async (id) => {
    try {
      await api.delete(`/admin/deleteroomtype/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting room type:', error);
      throw error;
    }
  };

  // ─── POST: Create a new Room Status ────────
  const addRoomStatus = async (statusData) => {
    try {
      await api.post('/admin/createroomstatus', statusData);
      await fetchData();
    } catch (error) {
      console.error('Error creating room status:', error);
      throw error;
    }
  };

  // ─── PUT: Update a Room Status ───────────
  const updateRoomStatus = async (id, statusData) => {
    try {
      await api.put(`/admin/updateroomstatus/${id}`, statusData);
      await fetchData();
    } catch (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
  };

  // ─── DELETE: Delete a Room Status ────────
  const deleteRoomStatus = async (id) => {
    try {
      await api.delete(`/admin/deleteroomstatus/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting room status:', error);
      throw error;
    }
  };

  // ─── POST: Create a new Room ────────
  const addRoom = async (roomData) => {
    try {
      await api.post('/admin/createroommaster', roomData);
      await fetchData();
    } catch (error) {
      console.error('Error creating room master:', error);
      throw error;
    }
  };

  // ─── PUT: Update a Room ───────────
  const updateRoom = async (id, roomData) => {
    try {
      await api.put(`/admin/updateroommaster/${id}`, roomData);
      await fetchData();
    } catch (error) {
      console.error('Error updating room master:', error);
      throw error;
    }
  };

  // ─── DELETE: Delete a Room ────────
  const deleteRoom = async (id) => {
    try {
      await api.delete(`/admin/deleteroommaster/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting room master:', error);
      throw error;
    }
  };

  return {
    floors,
    roomTypes,
    roomStatuses,
    isLoading,
    fetchData,
    addFloor,
    getFloorById,
    updateFloor,
    deleteFloor,
    addRoomType,
    getRoomTypeById,
    updateRoomType,
    deleteRoomType,
    addRoomStatus,
    updateRoomStatus,
    deleteRoomStatus,
    rooms,
    addRoom,
    getRoomMasterById,
    updateRoom,
    deleteRoom
  };
};

export default usePmsData;
