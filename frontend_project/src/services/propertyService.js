/**
 * propertyService.js - Centralized API Service Layer
 *
 * Is file mein saare 'Axios' API calls likhe gaye hain.
 * Iska main kaam hai frontend aur backend ke beech bridge banana.
 * Agar aapko URL change karna ho ya naya endpoint add karna ho, toh yahi wo jagah hai.
 */
import api from './api'

const handleResponse = async (apiCall) => {
  try {
    const response = await apiCall()
    return response
  } catch (err) {
    if (err.response) {
      console.error('API Error Details:', {
        url: err.config?.url,
        status: err.response.status,
        data: err.response.data,
      })
    } else {
      console.error(`API Call failed: ${err.config?.url || 'unknown'}`, err)
    }
    throw err
  }
}

export const propertyService = {
  // --- FLOOR MANAGEMENT ---
  getFloors: () => handleResponse(() => api.get('/user/getfloors')),
  createFloor: (data) => handleResponse(() => api.post('/admin/createfloor', data)),
  updateFloor: (id, data) => handleResponse(() => api.put(`/admin/updatefloor/${id}`, data)),
  deleteFloor: (id) => handleResponse(() => api.delete(`/admin/deletefloor/${id}`)),
  searchFloors: (query) =>
    handleResponse(() => api.get('/user/floor/search', { params: { query } })),

  // --- BUILDING MANAGEMENT ---
  getBuildings: () => handleResponse(() => api.get('/user/getbuildings')),
  getBuildingById: (id) => handleResponse(() => api.get(`/user/getbuilding/${id}`)),
  createBuilding: (data) => handleResponse(() => api.post('/admin/createbuilding', data)),
  updateBuilding: (id, data) => handleResponse(() => api.put(`/admin/updatebuilding/${id}`, data)),
  deleteBuilding: (id) => handleResponse(() => api.delete(`/admin/deletebuilding/${id}`)),
  searchBuildings: (query) =>
    handleResponse(() => api.get('/user/building/search', { params: { query } })),

  // --- ROOM TYPE MANAGEMENT ---
  getRoomTypes: () => handleResponse(() => api.get('/user/getroomtypes')),
  createRoomType: (data) => handleResponse(() => api.post('/admin/createroomtype', data)),
  updateRoomType: (id, data) => handleResponse(() => api.put(`/admin/updateroomtype/${id}`, data)),
  deleteRoomType: (id) => handleResponse(() => api.delete(`/admin/deleteroomtype/${id}`)),
  searchRoomTypes: (query) =>
    handleResponse(() => api.get('/user/roomtype/search', { params: { query } })),

  // --- ROOM STATUS MANAGEMENT ---
  getRoomStatuses: () => handleResponse(() => api.get('/user/getroomstatuses')),
  createRoomStatus: (data) => handleResponse(() => api.post('/admin/createroomstatus', data)),
  updateRoomStatus: (id, data) =>
    handleResponse(() => api.put(`/admin/updateroomstatus/${id}`, data)),
  deleteRoomStatus: (id) => handleResponse(() => api.delete(`/admin/deleteroomstatus/${id}`)),
  searchRoomStatuses: (query) =>
    handleResponse(() => api.get('/user/roomstatus/search', { params: { query } })),

  // --- ROOM MASTER (UNITS) ---
  getRooms: () =>
    handleResponse(() =>
      api.get('/user/getroommasters', {
        params: { page: 0, size: 100, sortBy: 'id', sortDir: 'asc' },
      }),
    ),
  getRoomById: (id) => handleResponse(() => api.get(`/user/getroommaster/${id}`)),
  createRoom: (data) => handleResponse(() => api.post('/admin/createroommaster', data)),
  updateRoom: (id, data) => handleResponse(() => api.put(`/admin/updateroommaster/${id}`, data)),
  deleteRoom: (id) => handleResponse(() => api.delete(`/admin/deleteroommaster/${id}`)),
  searchRooms: (query) =>
    handleResponse(() => api.get('/user/roommaster/search', { params: { query } })),

  // --- TAX MANAGEMENT ---
  getTaxMasters: () => handleResponse(() => api.get('/user/gettaxmasters')),
  getTaxMasterById: (id) => handleResponse(() => api.get(`/user/gettaxmaster/${id}`)),
  createTaxMaster: (data) => handleResponse(() => api.post('/admin/createtaxmaster', data)),
  updateTaxMaster: (id, data) =>
    handleResponse(() => api.put(`/admin/updatetaxmaster/${id}`, data)),
  deleteTaxMaster: (id) => handleResponse(() => api.delete(`/admin/deletetaxmaster/${id}`)),
  searchTaxMasters: (query) =>
    handleResponse(() => api.get('/user/taxmaster/search', { params: { query } })),

  // --- GUEST PERSONAL DETAILS ---
  getPersonalDetails: () => handleResponse(() => api.get('/user/getpersonaldetails')),
  getPersonalDetailById: (id) => handleResponse(() => api.get(`/user/getpersonaldetails/${id}`)),
  createPersonalDetail: (data) =>
    handleResponse(() => api.post('/user/createpersonaldetail', data)),
  updatePersonalDetail: (id, data) =>
    handleResponse(() => api.put(`/user/updatepersonaldetail/${id}`, data)),
  deletePersonalDetail: (id) =>
    handleResponse(() => api.delete(`/user/deletepersonaldetail/${id}`)),
  searchPersonalDetails: (query) =>
    handleResponse(() => api.get(`/user/personaldetails/search`, { params: { query } })),

  // --- DOCUMENT TYPE MANAGEMENT ---
  getDocumentTypes: () => handleResponse(() => api.get('/user/getdocumenttypes')),
  getDocumentTypeById: (id) => handleResponse(() => api.get(`/user/getdocumenttypes/${id}`)),
  createDocumentType: (data) => handleResponse(() => api.post('/admin/createdocumenttype', data)),
  updateDocumentType: (id, data) =>
    handleResponse(() => api.put(`/admin/updatedocumenttype/${id}`, data)),
  deleteDocumentType: (id) => handleResponse(() => api.delete(`/admin/documenttype/${id}`)),
  searchDocumentTypes: (query) =>
    handleResponse(() => api.get('/user/documenttype/search', { params: { query } })),

  // --- DOCUMENT DETAILS MANAGEMENT ---
  getDocumentDetails: () => handleResponse(() => api.get('/user/getdocumentdetails')),
  getDocumentDetailById: (id) => handleResponse(() => api.get(`/user/getdocumentdetail/${id}`)),
  createDocumentDetail: (data) =>
    handleResponse(() => api.post('/admin/createdocumentdetail', data)),
  updateDocumentDetail: (id, data) =>
    handleResponse(() => api.put(`/admin/updatedocumentdetail/${id}`, data)),
  deleteDocumentDetail: (id) =>
    handleResponse(() => api.delete(`/admin/deletedocumentdetail/${id}`)),

  // --- STAY DETAILS MANAGEMENT ---
  getStayDetails: () => handleResponse(() => api.get('/user/getstaydetails')),
  getStayDetailById: (id) => handleResponse(() => api.get(`/user/getstaydetail/${id}`)),
  createStayDetail: (data) => handleResponse(() => api.post('/admin/createstaydetail', data)),
  updateStayDetail: (id, data) =>
    handleResponse(() => api.put(`/admin/updatestaydetail/${id}`, data)),
  deleteStayDetail: (id) => handleResponse(() => api.delete(`/admin/deletestaydetails/${id}`)),

  // --- GUEST DETAILS MANAGEMENT ---
  getGuestDetails: () => handleResponse(() => api.get('/user/getguestdetails')),
  getGuestDetailById: (id) => handleResponse(() => api.get(`/user/getguestdetail/${id}`)),
  createGuestDetail: (data) => handleResponse(() => api.post('/admin/createguestdetail', data)),
  updateGuestDetail: (id, data) =>
    handleResponse(() => api.put(`/admin/updateguestdetail/${id}`, data)),
  deleteGuestDetail: (id) => handleResponse(() => api.delete(`/admin/deleteguestdetail/${id}`)),

  // --- RENT DETAILS MANAGEMENT ---
  getRentDetails: () => handleResponse(() => api.get('/user/getrentdetails')),
  getRentDetailById: (id) => handleResponse(() => api.get(`/user/getrentdetail/${id}`)),
  createRentDetail: (data) => handleResponse(() => api.post('/admin/createrentdetail', data)),
  updateRentDetail: (id, data) =>
    handleResponse(() => api.put(`/admin/updaterentdetail/${id}`, data)),
  deleteRentDetail: (id) => handleResponse(() => api.delete(`/admin/deleterentdetail/${id}`)),

  // --- IMAGE MANAGEMENT ---
  uploadImage: (formData) =>
    handleResponse(() =>
      api.post('/user/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    ),
  getImageUrl: (filename) => `/user/${filename}`,
  deleteImage: (filename) => handleResponse(() => api.delete(`/user/delete/${filename}`)),
}
