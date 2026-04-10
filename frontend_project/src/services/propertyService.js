/**
 * propertyService.js - Centralized API Service Layer
 *
 * Is file mein saare 'Axios' API calls likhe gaye hain.
 * Iska main kaam hai frontend aur backend ke beech bridge banana.
 * Agar aapko URL change karna ho ya naya endpoint add karna ho, toh yahi wo jagah hai.
 */
import api from './api'

/**
 * handleResponse: Ek helper function hai jo API ki success aur error
 * ko console mein log karta hai (debug karne ke liye easy hota hai).
 */
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
  // --- FLOOR MANAGEMENT (Maan lijiye buildings ke floor manage karne ke liye) ---
  getFloors: () => handleResponse(() => api.get('/user/getfloors')),
  createFloor: (data) => handleResponse(() => api.post('/admin/createfloor', data)),
  updateFloor: (id, data) => handleResponse(() => api.put(`/admin/updatefloor/${id}`, data)),
  deleteFloor: (id) => handleResponse(() => api.delete(`/admin/deletefloor/${id}`)),
  searchFloors: (query) =>
    handleResponse(() => api.get('/user/floor/search', { params: { query } })),

  // --- BUILDING MANAGEMENT (Poori building ki details) ---
  getBuildings: () => handleResponse(() => api.get('/user/getbuildings')),
  getBuildingById: (id) => handleResponse(() => api.get(`/user/getbuilding/${id}`)),
  createBuilding: (data) => handleResponse(() => api.post('/admin/createbuilding', data)),
  updateBuilding: (id, data) => handleResponse(() => api.put(`/admin/updatebuilding/${id}`, data)),
  deleteBuilding: (id) => handleResponse(() => api.delete(`/admin/deletebuilding/${id}`)),
  searchBuildings: (query) =>
    handleResponse(() => api.get('/user/building/search', { params: { query } })),

  // --- ROOM TYPE MANAGEMENT (Single, Deluxe, Suite, etc.) ---
  getRoomTypes: () => handleResponse(() => api.get('/user/getroomtypes')),
  createRoomType: (data) => handleResponse(() => api.post('/admin/createroomtype', data)),
  updateRoomType: (id, data) => handleResponse(() => api.put(`/admin/updateroomtype/${id}`, data)),
  deleteRoomType: (id) => handleResponse(() => api.delete(`/admin/deleteroomtype/${id}`)),
  searchRoomTypes: (query) =>
    handleResponse(() => api.get('/user/roomtype/search', { params: { query } })),

  // --- ROOM STATUS (Available, Occupied, Maintenance, etc.) ---
  getRoomStatuses: () => handleResponse(() => api.get('/user/getroomstatuses')),
  getRoomStatusById: (id) => handleResponse(() => api.get(`/user/getroomstatus/${id}`)),
  createRoomStatus: (data) => handleResponse(() => api.post('/admin/createroomstatus', data)),
  updateRoomStatus: (id, data) =>
    handleResponse(() => api.put(`/admin/updateroomstatus/${id}`, data)),
  deleteRoomStatus: (id) => handleResponse(() => api.delete(`/admin/deleteroomstatus/${id}`)),
  searchRoomStatuses: (query) =>
    handleResponse(() => api.get('/user/roomstatus/search', { params: { query } })),

  // --- ROOM MASTER (Actual Room Numbers aur unki details) ---
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

  // --- TAX MANAGEMENT (GST, VAT, etc. jo rent par lagte hain) ---
  getTaxMasters: () => handleResponse(() => api.get('/user/gettaxmasters')),
  getTaxMasterById: (id) => handleResponse(() => api.get(`/user/gettaxmaster/${id}`)),
  createTaxMaster: (data) => handleResponse(() => api.post('/admin/createtaxmaster', data)),
  updateTaxMaster: (id, data) =>
    handleResponse(() => api.put(`/admin/updatetaxmaster/${id}`, data)),
  deleteTaxMaster: (id) => handleResponse(() => api.delete(`/admin/deletetaxmaster/${id}`)),
  searchTaxMasters: (query) =>
    handleResponse(() => api.get('/user/taxmaster/search', { params: { query } })),

  // --- GUEST PERSONAL DETAILS (Guest ka naam, phone, email, etc.) ---
  getPersonalDetails: () => handleResponse(() => api.get('/user/getpersonaldetails')),
  getPersonalDetailById: (id) => handleResponse(() => api.get(`/user/getpersonaldetail/${id}`)),
  createPersonalDetail: (data) =>
    handleResponse(() => api.post('/user/createpersonaldetail', data)),
  updatePersonalDetail: (id, data) =>
    handleResponse(() => api.put(`/user/updatepersonaldetail/${id}`, data)),
  deletePersonalDetail: (id) =>
    handleResponse(() => api.delete(`/user/deletepersonaldetail/${id}`)),
  searchPersonalDetails: (query) =>
    handleResponse(() => api.get(`/user/personaldetails/search`, { params: { query } })),

  // --- FOLIO NO ---
  getFolioNo: () => handleResponse(() => api.get('/user/getfoliono')),

  // --- DOCUMENT TYPE (Aadhar, PAN, Passport types) ---
  getDocumentTypes: () => handleResponse(() => api.get('/user/getdocumenttypes')),
  getDocumentTypeById: (id) => handleResponse(() => api.get(`/user/getdocumenttypes/${id}`)),
  createDocumentType: (data) => handleResponse(() => api.post('/admin/createdocumenttype', data)),
  updateDocumentType: (id, data) =>
    handleResponse(() => api.put(`/admin/updatedocumenttype/${id}`, data)),
  deleteDocumentType: (id) => handleResponse(() => api.delete(`/admin/documenttype/${id}`)),
  searchDocumentTypes: (query) =>
    handleResponse(() => api.get('/user/documenttype/search', { params: { query } })),

  // --- GUEST DOCUMENTS (Actual Aadhar card details for a guest) ---
  getDocumentDetails: () => handleResponse(() => api.get('/user/getdocumentdetails')),
  getDocumentDetailById: (id) => handleResponse(() => api.get(`/user/getdocumentdetail/${id}`)),
  createDocumentDetail: (data) =>
    handleResponse(() => api.post('/admin/createdocumentdetail', data)),
  updateDocumentDetail: (id, data) =>
    handleResponse(() => api.put(`/admin/updatedocumentdetails/${id}`, data)),
  deleteDocumentDetail: (id) =>
    handleResponse(() => api.delete(`/admin/deletedocumentdetails/${id}`)),
  searchDocumentDetails: (query) =>
    handleResponse(() => api.get('/user/documentdetails/search', { params: { query } })),

  // --- STAY DETAILS (Kab guest aaya aur kab jayega / Check-in Check-out) ---
  getStayDetails: () => handleResponse(() => api.get('/user/getstaydetails')),
  getStayDetailById: (id) => handleResponse(() => api.get(`/user/getstaydetail/${id}`)),
  createStayDetail: (data) => handleResponse(() => api.post('/admin/createstaydetail', data)),
  updateStayDetail: (id, data) =>
    handleResponse(() => api.put(`/admin/updatestaydetails/${id}`, data)),
  deleteStayDetail: (id) => handleResponse(() => api.delete(`/admin/deletestaydetails/${id}`)),

  // --- GUEST OVERALL STATUS (Active, Inactive status) ---
  getGuestDetails: () => handleResponse(() => api.get('/user/getguestdetails')),
  getGuestDetailById: (id) => handleResponse(() => api.get(`/user/getguestdetail/${id}`)),
  createGuestDetail: (data) => handleResponse(() => api.post('/admin/createguestdetail', data)),
  updateGuestDetail: (id, data) =>
    handleResponse(() => api.put(`/admin/updateguestdetail/${id}`, data)),
  deleteGuestDetail: (id) => handleResponse(() => api.delete(`/admin/deleteguestdetail/${id}`)),

  // --- RENT DETAILS (Booking ka kiraya aur expenses) ---
  getRentDetails: () => handleResponse(() => api.get('/user/getrentdetails')),
  getRentDetailById: (id) => handleResponse(() => api.get(`/user/getrentdetail/${id}`)),
  createRentDetail: (data) => handleResponse(() => api.post('/admin/createrentdetail', data)),
  updateRentDetail: (id, data) =>
    handleResponse(() => api.put(`/admin/updaterentdetail/${id}`, data)),
  deleteRentDetail: (id) => handleResponse(() => api.delete(`/admin/deleterentdetail/${id}`)),

  // --- IMAGE UPLOAD (Guest photos and documents) ---
  uploadImage: (formData) =>
    handleResponse(() =>
      api.post('/user/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    ),
  getImageUrl: (filename) => `/user/${filename}`,
  deleteImage: (filename) => handleResponse(() => api.delete(`/user/delete/${filename}`)),

  // --- PAYMENT TYPES (Cash, Card, UPI, etc.) ---
  getPaymentTypes: () => handleResponse(() => api.get('/user/getpaymenttypes')),
  getPaymentTypeById: (id) => handleResponse(() => api.get(`/user/getpaymenttype/${id}`)),
  createPaymentType: (data) => handleResponse(() => api.post('/admin/createpaymenttype', data)),
  updatePaymentType: (id, data) =>
    handleResponse(() => api.put(`/admin/updatepaymenttype/${id}`, data)),
  deletePaymentType: (id) => handleResponse(() => api.delete(`/admin/deletepaymenttype/${id}`)),
  searchPaymentTypes: (query) =>
    handleResponse(() => api.get('/user/paymenttype/search', { params: { query } })),

  // --- OTHER CHARGES (Extra services charges) ---
  getOtherCharges: () => handleResponse(() => api.get('/user/getothercharges')),
  getOtherChargeById: (id) => handleResponse(() => api.get(`/user/getothercharge/${id}`)),
  createOtherCharge: (data) => handleResponse(() => api.post('/admin/createothercharge', data)),
  updateOtherCharge: (id, data) =>
    handleResponse(() => api.put(`/admin/updateothercharge/${id}`, data)),
  deleteOtherCharge: (id) => handleResponse(() => api.delete(`/admin/deleteothercharge/${id}`)),
  searchOtherCharges: (query) =>
    handleResponse(() => api.get('/user/othercharge/search', { params: { query } })),
}
