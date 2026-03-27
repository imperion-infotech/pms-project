/**
 * propertyService.js - Centralized API Service Layer
 * 
 * Purpose:
 * This file contains all the "Axios" API calls for the property management 
 * system. By centralizing these, we avoid having URLs scattered across 
 * various components.
 */
import api from './api';

const handleResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    return response;
  } catch (err) {
    console.error(`API Call failed: ${err.config?.url || 'unknown'}`, err);
    throw err;
  }
};

export const propertyService = {
  // --- FLOOR MANAGEMENT ---
  getFloors: () => handleResponse(() => api.get('/user/getfloors')),
  createFloor: (data) => handleResponse(() => api.post('/admin/createfloor', data)),
  updateFloor: (id, data) => handleResponse(() => api.put(`/admin/updatefloor/${id}`, data)),
  deleteFloor: (id) => handleResponse(() => api.delete(`/admin/deletefloor/${id}`)),
  searchFloors: (query) => handleResponse(() => api.get('/user/floor/search', { params: { query } })),

  // --- BUILDING MANAGEMENT ---
  getBuildings: () => handleResponse(() => api.get('/user/getbuildings')),
  getBuildingById: (id) => handleResponse(() => api.get(`/user/getbuilding/${id}`)),
  createBuilding: (data) => handleResponse(() => api.post('/admin/createbuilding', data)),
  updateBuilding: (id, data) => handleResponse(() => api.put(`/admin/updatebuilding/${id}`, data)),
  deleteBuilding: (id) => handleResponse(() => api.delete(`/admin/deletebuilding/${id}`)),
  searchBuildings: (query) => handleResponse(() => api.get('/user/building/search', { params: { query } })),

  // --- ROOM TYPE MANAGEMENT ---
  getRoomTypes: () => handleResponse(() => api.get('/user/getroomtypes')),
  createRoomType: (data) => handleResponse(() => api.post('/admin/createroomtype', data)),
  updateRoomType: (id, data) => handleResponse(() => api.put(`/admin/updateroomtype/${id}`, data)),
  deleteRoomType: (id) => handleResponse(() => api.delete(`/admin/deleteroomtype/${id}`)),
  searchRoomTypes: (query) => handleResponse(() => api.get('/user/roomtype/search', { params: { query } })),

  // --- ROOM STATUS MANAGEMENT ---
  getRoomStatuses: () => handleResponse(() => api.get('/user/getroomstatuses')),
  createRoomStatus: (data) => handleResponse(() => api.post('/admin/createroomstatus', data)),
  updateRoomStatus: (id, data) => handleResponse(() => api.put(`/admin/updateroomstatus/${id}`, data)),
  deleteRoomStatus: (id) => handleResponse(() => api.delete(`/admin/deleteroomstatus/${id}`)),
  searchRoomStatuses: (query) => handleResponse(() => api.get('/user/roomstatus/search', { params: { query } })),

  // --- ROOM MASTER (UNITS) ---
  getRooms: () => handleResponse(() => api.get('/user/getroommasters')),
  createRoom: (data) => handleResponse(() => api.post('/admin/createroommaster', data)),
  updateRoom: (id, data) => handleResponse(() => api.put(`/admin/updateroommaster/${id}`, data)),
  deleteRoom: (id) => handleResponse(() => api.delete(`/admin/deleteroommaster/${id}`)),
  searchRooms: (query) => handleResponse(() => api.get('/user/roommaster/search', { params: { query } })),


  // --- TAX MANAGEMENT ---
  getTaxMasters: () => handleResponse(() => api.get('/user/gettaxmasters')),
  getTaxMasterById: (id) => handleResponse(() => api.get(`/user/gettaxmaster/${id}`)),
  createTaxMaster: (data) => handleResponse(() => api.post('/admin/createtaxmaster', data)),
  updateTaxMaster: (id, data) => handleResponse(() => api.put(`/admin/updatetaxmaster/${id}`, data)),
  deleteTaxMaster: (id) => handleResponse(() => api.delete(`/admin/deletetaxmaster/${id}`)),
  searchTaxMasters: (query) => handleResponse(() => api.get('/user/taxmaster/search', { params: { query } })),

  // --- GUEST PERSONAL DETAILS ---
  getPersonalDetails: () => handleResponse(() => api.get('/user/getpersonaldetails')),
  getPersonalDetailById: (id) => handleResponse(() => api.get(`/user/getpersonaldetails/${id}`)),
  createPersonalDetail: (data) => handleResponse(() => api.post('/admin/createpersonaldetail', data)),
  updatePersonalDetail: (id, data) => handleResponse(() => api.put(`/admin/updatepersonaldetail/${id}`, data)),
  deletePersonalDetail: (id) => handleResponse(() => api.delete(`/admin/deletepersonaldetail/${id}`)),
  searchPersonalDetails: (query) => handleResponse(() => api.get(`/user/personaldetails/search`, { params: { query } })),

  // --- IMAGE MANAGEMENT ---
  uploadImage: (formData) => handleResponse(() => api.post('/user/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })),
  getImageUrl: (filename) => `/user/${filename}`,
  deleteImage: (filename) => handleResponse(() => api.delete(`/user/delete/${filename}`)),

};
