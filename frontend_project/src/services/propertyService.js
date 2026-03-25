/**
 * propertyService.js - Centralized API Service Layer
 * 
 * Purpose:
 * This file contains all the "Axios" API calls for the property management 
 * system. By centralizing these, we avoid having URLs scattered across 
 * various components.
 * 
 * Domains Covered:
 * 1. Floors (Ground Floor, Floor 1, etc.)
 * 2. Room Types (Deluxe, Suite, etc.)
 * 3. Room Statuses (Available, Occupied, Out of Order)
 * 4. Room Masters (The actual physical room units)
 * 5. Personal Details (Guest information for check-ins)
 */
import api from './api';

export const propertyService = {
  // --- FLOOR MANAGEMENT ---
  getFloors: () => api.get('/user/getfloors'),
  createFloor: (data) => api.post('/admin/createfloor', data),
  updateFloor: (id, data) => api.put(`/admin/updatefloor/${id}`, data),
  deleteFloor: (id) => api.delete(`/admin/deletefloor/${id}`),

  // --- ROOM TYPE MANAGEMENT ---
  getRoomTypes: () => api.get('/user/getroomtypes'),
  createRoomType: (data) => api.post('/admin/createroomtype', data),
  updateRoomType: (id, data) => api.put(`/admin/updateroomtype/${id}`, data),
  deleteRoomType: (id) => api.delete(`/admin/deleteroomtype/${id}`),

  // --- ROOM STATUS MANAGEMENT ---
  getRoomStatuses: () => api.get('/user/getroomstatuses'),
  createRoomStatus: (data) => api.post('/admin/createroomstatus', data),
  updateRoomStatus: (id, data) => api.put(`/admin/updateroomstatus/${id}`, data),
  deleteRoomStatus: (id) => api.delete(`/admin/deleteroomstatus/${id}`),

  // --- ROOM MASTER (UNITS) ---
  getRooms: () => api.get('/user/getroommasters'),
  createRoom: (data) => api.post('/admin/createroommaster', data),
  updateRoom: (id, data) => api.put(`/admin/updateroommaster/${id}`, data),
  deleteRoom: (id) => api.delete(`/admin/deleteroommaster/${id}`),

  // --- GUEST PERSONAL DETAILS ---
  getPersonalDetails: () => api.get('/user/getpersonaldetails'),
  createPersonalDetail: (data) => api.post('/user/createpersonaldetail', data),
  updatePersonalDetail: (id, data) => api.put(`/user/updatepersonaldetail/${id}`, data),
};

