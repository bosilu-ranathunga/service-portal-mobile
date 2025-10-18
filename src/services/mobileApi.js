import api from './api.js';
import { mockAPI } from './dummyData.js';

// Toggle this to switch between real API and dummy data
const USE_DUMMY_DATA = true;

// Engineer Authentication
export const engineerAuth = {
  login: async (credentials) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.login(credentials);
    }
    const response = await api.post('/auth/engineer/login', credentials);
    return response.data;
  },
  
  refreshToken: async () => {
    if (USE_DUMMY_DATA) {
      return { token: 'refreshed-mock-token-' + Date.now() };
    }
    const response = await api.post('/auth/refresh');
    return response.data;
  },
  
  logout: async () => {
    if (USE_DUMMY_DATA) {
      return { success: true };
    }
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Engineer Profile
export const engineerProfile = {
  getProfile: async () => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getProfile();
    }
    const response = await api.get('/engineer/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.updateProfile(profileData);
    }
    const response = await api.put('/engineer/profile', profileData);
    return response.data;
  }
};

// Work Assignments
export const assignments = {
  getAssignments: async (status = 'all') => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getAssignments(status);
    }
    const response = await api.get(`/engineer/assignments?status=${status}`);
    return response.data;
  },
  
  getAssignmentDetails: async (assignmentId) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getAssignmentDetails(assignmentId);
    }
    const response = await api.get(`/engineer/assignments/${assignmentId}`);
    return response.data;
  },
  
  updateAssignmentStatus: async (assignmentId, status) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.updateAssignmentStatus(assignmentId, status);
    }
    const response = await api.put(`/engineer/assignments/${assignmentId}/status`, { status });
    return response.data;
  },
  
  acceptAssignment: async (assignmentId) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.acceptAssignment(assignmentId);
    }
    const response = await api.post(`/engineer/assignments/${assignmentId}/accept`);
    return response.data;
  },
  
  startWork: async (assignmentId, location) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.startWork(assignmentId, location);
    }
    const response = await api.post(`/engineer/assignments/${assignmentId}/start`, { location });
    return response.data;
  },
  
  completeWork: async (assignmentId, completionData) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.completeWork(assignmentId, completionData);
    }
    const response = await api.post(`/engineer/assignments/${assignmentId}/complete`, completionData);
    return response.data;
  }
};

// Field Service Reports
export const fieldService = {
  createReport: async (reportData) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.createReport(reportData);
    }
    const response = await api.post('/engineer/field-reports', reportData);
    return response.data;
  },
  
  updateReport: async (reportId, reportData) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.updateReport(reportId, reportData);
    }
    const response = await api.put(`/engineer/field-reports/${reportId}`, reportData);
    return response.data;
  },
  
  getReports: async (filters = {}) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getReports(filters);
    }
    const params = new URLSearchParams(filters);
    const response = await api.get(`/engineer/field-reports?${params}`);
    return response.data;
  },
  
  getReportDetails: async (reportId) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getReportDetails(reportId);
    }
    const response = await api.get(`/engineer/field-reports/${reportId}`);
    return response.data;
  },
  
  uploadPhoto: async (reportId, photoFile) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.uploadPhoto(reportId, photoFile);
    }
    const formData = new FormData();
    formData.append('photo', photoFile);
    const response = await api.post(`/engineer/field-reports/${reportId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  deletePhoto: async (reportId, photoId) => {
    if (USE_DUMMY_DATA) {
      return { success: true };
    }
    const response = await api.delete(`/engineer/field-reports/${reportId}/photos/${photoId}`);
    return response.data;
  }
};

// Notifications
export const notifications = {
  getNotifications: async (page = 1, limit = 20) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getNotifications(page, limit);
    }
    const response = await api.get(`/engineer/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  markAsRead: async (notificationId) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.markAsRead(notificationId);
    }
    const response = await api.put(`/engineer/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.markAllAsRead();
    }
    const response = await api.put('/engineer/notifications/read-all');
    return response.data;
  },
  
  subscribeToNotifications: async (subscription) => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.subscribeToNotifications(subscription);
    }
    const response = await api.post('/engineer/notifications/subscribe', subscription);
    return response.data;
  }
};

// Dashboard Data
export const dashboard = {
  getStats: async () => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getDashboardStats();
    }
    const response = await api.get('/engineer/dashboard/stats');
    return response.data;
  },
  
  getRecentActivity: async () => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getRecentActivity();
    }
    const response = await api.get('/engineer/dashboard/recent-activity');
    return response.data;
  },
  
  getTodaySchedule: async () => {
    if (USE_DUMMY_DATA) {
      return await mockAPI.getTodaySchedule();
    }
    const response = await api.get('/engineer/dashboard/today-schedule');
    return response.data;
  }
};

// Location Services
export const location = {
  updateLocation: async (coordinates) => {
    const response = await api.post('/engineer/location', coordinates);
    return response.data;
  },
  
  getDirections: async (destinationAddress) => {
    const response = await api.get(`/engineer/directions?destination=${encodeURIComponent(destinationAddress)}`);
    return response.data;
  }
};

export default {
  engineerAuth,
  engineerProfile,
  assignments,
  fieldService,
  notifications,
  dashboard,
  location
};