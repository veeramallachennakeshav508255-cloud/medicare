import apiClient, { ENABLE_MOCK_FALLBACK } from './api';
import { getStoredAppointments, saveAppointments } from './storage';

export const appointmentService = {
  async getAppointments(filters = {}) {
    try {
      const response = await apiClient.get('/api/appointments', { params: filters });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        let list = getStoredAppointments();
        if (filters.doctorId) {
          list = list.filter(a => a.doctorId === filters.doctorId);
        }
        if (filters.patientEmail) {
          list = list.filter(a => a.patientEmail?.toLowerCase() === filters.patientEmail.toLowerCase());
        }
        if (filters.status) {
          list = list.filter(a => a.status === filters.status);
        }
        return list;
      }
      throw error;
    }
  },

  async createAppointment(data) {
    try {
      const response = await apiClient.post('/api/appointments', data);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        const list = getStoredAppointments();
        const randId = Math.floor(1000 + Math.random() * 9000);
        const newAppointment = {
          id: `apt-${Date.now()}`,
          referenceId: `CC-2026-${randId}`,
          patientName: data.patientName || "Alex Morgan",
          patientEmail: data.patientEmail || "patient@careconnect.ai",
          patientPhone: data.patientPhone || "+1 (555) 234-5678",
          doctorId: data.doctorId,
          doctorName: data.doctorName,
          specialty: data.specialty,
          department: data.department || data.specialty,
          date: data.date,
          time: data.time,
          type: data.type || "In-Person",
          status: "Confirmed", // Auto confirmed for pleasant demo experience
          reason: data.reason || "General Consultation",
          notes: data.notes || "",
          createdAt: new Date().toISOString()
        };
        const updated = [newAppointment, ...list];
        saveAppointments(updated);
        return newAppointment;
      }
      throw error;
    }
  },

  async updateStatus(id, newStatus) {
    try {
      const response = await apiClient.patch(`/api/appointments/${id}/status`, { status: newStatus });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        const list = getStoredAppointments();
        const updated = list.map(item => item.id === id ? { ...item, status: newStatus } : item);
        saveAppointments(updated);
        return updated.find(item => item.id === id);
      }
      throw error;
    }
  },

  async cancelAppointment(id, reason = "Patient requested cancellation") {
    try {
      const response = await apiClient.post(`/api/appointments/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        const list = getStoredAppointments();
        const updated = list.map(item => item.id === id ? { ...item, status: 'Cancelled', cancelReason: reason } : item);
        saveAppointments(updated);
        return updated.find(item => item.id === id);
      }
      throw error;
    }
  },

  async addPrescription(appointmentId, prescriptionData) {
    try {
      const response = await apiClient.post(`/api/prescriptions`, { appointmentId, ...prescriptionData });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        const list = getStoredAppointments();
        const updated = list.map(item => {
          if (item.id === appointmentId) {
            return {
              ...item,
              status: 'Completed',
              prescription: {
                ...prescriptionData,
                dateIssued: new Date().toISOString().split('T')[0]
              }
            };
          }
          return item;
        });
        saveAppointments(updated);
        return updated.find(item => item.id === appointmentId);
      }
      throw error;
    }
  },

  // Check booked slots for a given doctor on a specific date to prevent double booking
  getBookedSlots(doctorId, date) {
    const list = getStoredAppointments();
    return list
      .filter(a => a.doctorId === doctorId && a.date === date && a.status !== 'Cancelled')
      .map(a => a.time);
  }
};

export default appointmentService;
