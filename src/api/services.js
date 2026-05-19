import { api } from './client.js';

export const authApi = {
  register: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/auth/me'),
  updateProfile: (body) => api('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),
};

export const catalogApi = {
  amenities: () => api('/catalog/amenities'),
  categories: (type) => api(`/catalog/categories${type ? `?type=${type}` : ''}`),
};

export const groundsApi = {
  list: (params) => {
    const q = new URLSearchParams(params).toString();
    return api(`/grounds${q ? `?${q}` : ''}`);
  },
  locationStats: (params) => {
    const q = new URLSearchParams(params).toString();
    return api(`/grounds/stats/locations${q ? `?${q}` : ''}`);
  },
  get: (id) => api(`/grounds/${id}`),
  monthAvailability: (id, year, month) =>
    api(`/grounds/${id}/availability/month?year=${year}&month=${month}`),
  dayAvailability: (id, date) => api(`/grounds/${id}/availability/day/${date}`),
};

export const bookingsApi = {
  // Slot management
  validate: (body) => api('/bookings/validate', { method: 'POST', body: JSON.stringify(body) }),
  lock: (body) => api('/bookings/lock', { method: 'POST', body: JSON.stringify(body) }),
  
  // Booking CRUD
  create: (body) => api('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  mine: (status) => api(`/bookings/my${status ? `?status=${status}` : ''}`),
  manage: (params) => {
    const q = new URLSearchParams(params).toString();
    return api(`/bookings/manage${q ? `?${q}` : ''}`);
  },
  get: (id) => api(`/bookings/${id}`),
  
  // Booking actions
  cancel: (id, reason) =>
    api(`/bookings/${id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  respond: (id, body) =>
    api(`/bookings/${id}/respond`, { method: 'PATCH', body: JSON.stringify(body) }),
  
  // Statistics
  stats: (groundId) => api(`/bookings/stats/${groundId}`),
};

export const ownerApi = {
  // Dashboard & Overview
  dashboard: () => api('/owner/dashboard'),
  
  // Ground Management
  grounds: () => api('/owner/grounds'),
  createGround: (body) => api('/owner/grounds', { method: 'POST', body: JSON.stringify(body) }),
  updateGround: (id, body) => api(`/owner/grounds/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  setGroundActive: (id, isActive) =>
    api(`/owner/grounds/${id}/active`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  deleteGround: (id) => api(`/owner/grounds/${id}`, { method: 'DELETE' }),
  
  // Pricing Management
  setPricing: (id, body) => api(`/owner/grounds/${id}/pricing`, { method: 'PATCH', body: JSON.stringify(body) }),
  setDynamicPricing: (id, body) => api(`/owner/grounds/${id}/dynamic-pricing`, { method: 'POST', body: JSON.stringify(body) }),
  removeDynamicPricing: (groundId, pricingId) =>
    api(`/owner/grounds/${groundId}/dynamic-pricing/${pricingId}`, { method: 'DELETE' }),
  
  // Availability Management
  blockDate: (id, body) => api(`/owner/grounds/${id}/blocked-dates`, { method: 'POST', body: JSON.stringify(body) }),
  unblockDate: (groundId, blockId) =>
    api(`/owner/grounds/${groundId}/blocked-dates/${blockId}`, { method: 'DELETE' }),
  setSchedule: (id, body) => api(`/owner/grounds/${id}/schedule`, { method: 'PATCH', body: JSON.stringify(body) }),
  
  // Booking Management
  bookings: (params) => {
    const q = new URLSearchParams(params).toString();
    return api(`/owner/bookings${q ? `?${q}` : ''}`);
  },
  respondBooking: (id, body) =>
    api(`/bookings/${id}/respond`, { method: 'PATCH', body: JSON.stringify(body) }),
  
  // Analytics
  revenue: (params) => {
    const q = new URLSearchParams(params).toString();
    return api(`/owner/revenue${q ? `?${q}` : ''}`);
  },
};

export const adminApi = {
  // Dashboard & Analytics
  analytics: () => api('/admin/analytics'),
  bookingStats: (params) => {
    const q = new URLSearchParams(params).toString();
    return api(`/admin/bookings/stats${q ? `?${q}` : ''}`);
  },
  
  // User Management
  users: (role) => api(`/admin/users${role ? `?role=${role}` : ''}`),
  updateUser: (id, body) => api(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  createOwner: (body) => api('/admin/owners', { method: 'POST', body: JSON.stringify(body) }),
  owners: () => api('/admin/owners'),
  
  // Ground Approval Workflow
  pendingGrounds: () => api('/admin/grounds/pending'),
  reviewGround: (id, body) =>
    api(`/admin/grounds/${id}/listing`, { method: 'PATCH', body: JSON.stringify(body) }),
  
  // Booking Management & Approval
  bookings: (params) => {
    const q = new URLSearchParams(params).toString();
    return api(`/admin/bookings${q ? `?${q}` : ''}`);
  },
  respondBooking: (id, body) =>
    api(`/bookings/${id}/respond`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: body.status,
        ownerNote: body.ownerNote ?? body.adminNote,
      }),
    }),
  resolveDispute: (id, body) =>
    api(`/admin/bookings/${id}/dispute`, { method: 'PATCH', body: JSON.stringify(body) }),
  
  // Amenities Management
  amenities: () => api('/admin/amenities'),
  createAmenity: (body) => api('/admin/amenities', { method: 'POST', body: JSON.stringify(body) }),
  updateAmenity: (id, body) =>
    api(`/admin/amenities/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAmenity: (id) => api(`/admin/amenities/${id}`, { method: 'DELETE' }),
  
  // Categories Management
  categories: (type) => api(`/admin/categories${type ? `?type=${type}` : ''}`),
  createCategory: (body) => api('/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) =>
    api(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteCategory: (id) => api(`/admin/categories/${id}`, { method: 'DELETE' }),
};
