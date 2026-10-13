import apiClient, { ENABLE_MOCK_FALLBACK } from './api';
import { getStoredAuthUser, saveAuthUser, getStoredToken } from './storage';
import { DEMO_USERS } from './mockData';

export const authService = {
  // Login with credentials and selected role
  async login(email, password, role = 'patient') {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password, role });
      const { user, token } = response.data;
      saveAuthUser(user, token);
      return { success: true, user, token };
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        // Fallback demo mock verification
        const matchedDemo = Object.values(DEMO_USERS).find(
          (u) => u.email.toLowerCase() === email.toLowerCase() || u.role === role
        );
        const user = matchedDemo || {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' '),
          email,
          role,
          phone: "+1 (555) 000-1122"
        };
        const token = `jwt-mock-token-${Date.now()}`;
        saveAuthUser(user, token);
        return { success: true, user, token, isMock: true };
      }
      throw error;
    }
  },

  // Register a new user (Patient or Doctor)
  async register(registrationData) {
    try {
      const response = await apiClient.post('/api/auth/register', registrationData);
      const { user, token } = response.data;
      saveAuthUser(user, token);
      return { success: true, user, token };
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        const newUser = {
          id: `usr-${Date.now()}`,
          name: registrationData.name,
          email: registrationData.email,
          role: registrationData.role || 'patient',
          phone: registrationData.phone || "+1 (555) 123-4567",
          specialty: registrationData.specialty || undefined,
          hospital: registrationData.hospital || undefined,
          bloodGroup: registrationData.bloodGroup || 'A+',
          allergies: registrationData.allergies || 'None'
        };
        const token = `jwt-mock-register-${Date.now()}`;
        saveAuthUser(newUser, token);
        return { success: true, user: newUser, token, isMock: true };
      }
      throw error;
    }
  },

  logout() {
    saveAuthUser(null);
  },

  getCurrentUser() {
    return getStoredAuthUser();
  },

  getToken() {
    return getStoredToken();
  },

  switchDemoRole(role) {
    const demoUser = DEMO_USERS[role] || DEMO_USERS.patient;
    const token = `demo-token-${role}`;
    saveAuthUser(demoUser, token);
    return demoUser;
  }
};

export default authService;
