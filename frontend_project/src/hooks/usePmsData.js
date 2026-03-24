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
    try {
      const [floorsRes, roomTypesRes, roomStatusesRes, roomsRes] = await Promise.all([
        api.get('/auth/getfloors'),
        api.get('/auth/getroomtypes'),
        api.get('/auth/getroomstatuses'),
        api.get('/auth/getroommasters'),
      ]);
      setFloors(floorsRes.data || []);
      setRoomTypes(roomTypesRes.data || []);
      setRoomStatuses(roomStatusesRes.data || []);
      setRooms(roomsRes.data || []);
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

  // ─── POST: Create a new floor ────────
  const addFloor = async (floorData) => {
    try {
      await api.post('/auth/createfloor', floorData);
      await fetchData();
    } catch (error) {
      console.error('Error creating floor:', error);
      throw error;
    }
  };

  // ─── PUT: Update a floor ────────────
  const updateFloor = async (id, floorData) => {
    try {
      await api.put(`/auth/updatefloor/${id}`, floorData);
      await fetchData();
    } catch (error) {
      console.error('Error updating floor:', error);
      throw error;
    }
  };

  // ─── DELETE: Delete a floor ─────────
  const deleteFloor = async (id) => {
    try {
      await api.delete(`/auth/deletefloor/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting floor:', error);
      throw error;
    }
  };

  // ─── POST: Create a new Room Type ────────
  const addRoomType = async (typeData) => {
    try {
      await api.post('/auth/createroomtype', typeData);
      await fetchData();
    } catch (error) {
      console.error('Error creating room type:', error);
      throw error;
    }
  };

  // ─── PUT: Update a Room Type ────────
  const updateRoomType = async (id, typeData) => {
    try {
      await api.put(`/auth/updateroomtype/${id}`, typeData);
      await fetchData();
    } catch (error) {
      console.error('Error updating room type:', error);
      throw error;
    }
  };

  // ─── DELETE: Delete a Room Type ────────
  const deleteRoomType = async (id) => {
    try {
      await api.delete(`/auth/deleteroomtype/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting room type:', error);
      throw error;
    }
  };

  // ─── POST: Create a new Room Status ────────
  const addRoomStatus = async (statusData) => {
    try {
      await api.post('/auth/createroomstatus', statusData);
      await fetchData();
    } catch (error) {
      console.error('Error creating room status:', error);
      throw error;
    }
  };

  // ─── PUT: Update a Room Status ───────────
  const updateRoomStatus = async (id, statusData) => {
    try {
      await api.put(`/auth/updateroomstatus/${id}`, statusData);
      await fetchData();
    } catch (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
  };

  // ─── DELETE: Delete a Room Status ────────
  const deleteRoomStatus = async (id) => {
    try {
      await api.delete(`/auth/deleteroomstatus/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting room status:', error);
      throw error;
    }
  };

  // ─── POST: Create a new Room ────────
  const addRoom = async (roomData) => {
    try {
      await api.post('/auth/createroommaster', roomData);
      await fetchData();
    } catch (error) {
      console.error('Error creating room master:', error);
      throw error;
    }
  };

  // ─── PUT: Update a Room ───────────
  const updateRoom = async (id, roomData) => {
    try {
      await api.put(`/auth/updateroommaster/${id}`, roomData);
      await fetchData();
    } catch (error) {
      console.error('Error updating room master:', error);
      throw error;
    }
  };

  // ─── DELETE: Delete a Room ────────
  const deleteRoom = async (id) => {
    try {
      await api.delete(`/auth/deleteroommaster/${id}`);
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
    updateFloor,
    deleteFloor,
    addRoomType,
    updateRoomType,
    deleteRoomType,
    addRoomStatus,
    updateRoomStatus,
    deleteRoomStatus,
    rooms,
    addRoom,
    updateRoom,
    deleteRoom
  };
};

export default usePmsData;
