import apiClient, { ENABLE_MOCK_FALLBACK } from './api';
import { getStoredDoctors, saveDoctors, getStoredDepartments } from './storage';

export const doctorService = {
  async getDoctors() {
    try {
      const response = await apiClient.get('/api/doctors');
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        return getStoredDoctors();
      }
      throw error;
    }
  },

  async getDoctorById(id) {
    try {
      const response = await apiClient.get(`/api/doctors/${id}`);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        const docs = getStoredDoctors();
        return docs.find(d => d.id === id) || null;
      }
      throw error;
    }
  },

  async getDepartments() {
    try {
      const response = await apiClient.get('/api/departments');
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        return getStoredDepartments();
      }
      throw error;
    }
  },

  async toggleDoctorAvailability(doctorId, isAvailable) {
    try {
      const response = await apiClient.patch(`/api/doctors/${doctorId}/availability`, { isAvailableToday: isAvailable });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        const docs = getStoredDoctors();
        const updated = docs.map(d => d.id === doctorId ? { ...d, isAvailableToday: isAvailable } : d);
        saveDoctors(updated);
        return { success: true, doctorId, isAvailableToday: isAvailable };
      }
      throw error;
    }
  }
};

export default doctorService;
