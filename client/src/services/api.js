import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.100:3000/api",
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Store tokens if they exist in the response
    if (response.data?.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    if (response.data?.data?.refreshToken) {
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
    if (response.data?.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },
};

// Draws service
export const drawsService = {
  getDraws: async () => {
    // Use api for fetching draws
    const response = await api.get("/draws");
    return response.data;
  },

  getDraw: async (id) => {
    // Use api for fetching a single draw
    const response = await api.get(`/draws/${id}`);
    return response.data;
  },

  enterDraw: async (drawId) => {
    // Use authenticated api for entering draws
    const response = await api.post(`/draws/${drawId}/enter`);
    return response.data;
  },

  getMyTickets: async () => {
    const response = await api.get("/tickets/my-tickets");
    return response.data;
  },

  getTicketDetails: async (ticketId) => {
    const response = await api.get(`/tickets/tickets/${ticketId}`);
    return response.data;
  },

  toggleDrawStatus: async (drawId) => {
    const response = await api.patch(`/admin/draws/${drawId}/toggle-status`);
    return response.data;
  },
};

// Profile service
export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post('/profile/change-password', data);
    return response.data;
  },

  uploadAvatar: async (formData) => {
    const response = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/profile/stats');
    return response.data;
  },
};

// Admin service
export const adminService = {
  getStats: async () => {
    try {
      const response = await api.get("/admin/stats");
      console.log("Raw stats response:", response);
      if (response?.data?.status === "success" && response?.data?.data) {
        return { status: "success", data: response.data.data };
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }
  },

  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getDraws: async () => {
    const response = await api.get("/admin/draws");
    return response.data;
  },

  createDraw: async (drawData) => {
    const response = await api.post("/admin/draws", drawData);
    return response.data;
  },

  updateDraw: async (drawId, drawData) => {
    const response = await api.put(`/admin/draws/${drawId}`, drawData);
    return response.data;
  },

  deleteDraw: async (drawId) => {
    const response = await api.delete(`/admin/draws/${drawId}`);
    return response.data;
  },

  uploadImage: async (formData) => {
    const response = await api.post("/admin/upload-image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPendingTickets: async () => {
    const response = await api.get('/admin/pending-tickets');
    return response.data;
  },

  updateTicketStatus: async (ticketId, statusData) => {
    const response = await api.patch(`/admin/tickets/${ticketId}/status`, statusData);
    return response.data;
  },
};

export default api;
