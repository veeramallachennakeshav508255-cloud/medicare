// LocalStorage persistence service for demo & offline mode
import { INITIAL_DEPARTMENTS, INITIAL_DOCTORS, INITIAL_APPOINTMENTS, DEMO_USERS } from './mockData';

const STORAGE_KEYS = {
  APPOINTMENTS: 'careconnect_appointments',
  DOCTORS: 'careconnect_doctors',
  DEPARTMENTS: 'careconnect_departments',
  AUTH_USER: 'careconnect_auth_user',
  AUTH_TOKEN: 'careconnect_jwt_token',
  SAVED_DOCTORS: 'careconnect_saved_doctors',
  NOTIFICATIONS: 'careconnect_notifications'
};

export const getStoredAppointments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.warn("Storage error, returning initial appointments", err);
    return INITIAL_APPOINTMENTS;
  }
};

export const saveAppointments = (appointments) => {
  try {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  } catch (err) {
    console.error("Failed to save appointments to storage", err);
  }
};

export const getStoredDoctors = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
      return INITIAL_DOCTORS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_DOCTORS;
  }
};

export const saveDoctors = (doctors) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  } catch (err) {
    console.error("Failed to save doctors to storage", err);
  }
};

export const getStoredDepartments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
      return INITIAL_DEPARTMENTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_DEPARTMENTS;
  }
};

export const getStoredAuthUser = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (data) return JSON.parse(data);
    // Default to Alex Morgan (patient) for immediate interactive demo experience
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEMO_USERS.patient));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo-jwt-token-patient-xyz');
    return DEMO_USERS.patient;
  } catch {
    return DEMO_USERS.patient;
  }
};

export const saveAuthUser = (user, token = 'demo-jwt-token-xyz') => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

export const getStoredToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || '';
};

export const getSavedDoctors = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_DOCTORS);
    return data ? JSON.parse(data) : ['doc-1', 'doc-2'];
  } catch {
    return ['doc-1', 'doc-2'];
  }
};

export const toggleSaveDoctor = (docId) => {
  const saved = getSavedDoctors();
  const exists = saved.includes(docId);
  const updated = exists ? saved.filter(id => id !== docId) : [...saved, docId];
  localStorage.setItem(STORAGE_KEYS.SAVED_DOCTORS, JSON.stringify(updated));
  return updated;
};
