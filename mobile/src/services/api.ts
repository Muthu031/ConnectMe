import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { token } = response.data.data;
          await AsyncStorage.setItem('token', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyOTP: (code: string) => api.post('/auth/verify-otp', { code }),
};

// User API
export const userAPI = {
  getProfile: (userId: string) => api.get(`/users/${userId}`),
  updateProfile: (userId: string, data: FormData) => {
    return api.put(`/users/${userId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  followUser: (userId: string) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId: string) => api.delete(`/users/${userId}/unfollow`),
  getFollowers: (userId: string) => api.get(`/users/${userId}/followers`),
  getFollowing: (userId: string) => api.get(`/users/${userId}/following`),
};

// Post API
export const postAPI = {
  getFeed: (page: number = 1, limit: number = 20) => 
    api.get('/posts', { params: { page, limit } }),
  getPost: (postId: string) => api.get(`/posts/${postId}`),
  createPost: (data: FormData) => {
    return api.post('/posts', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePost: (postId: string) => api.delete(`/posts/${postId}`),
  likePost: (postId: string) => api.post(`/posts/${postId}/like`),
  unlikePost: (postId: string) => api.delete(`/posts/${postId}/unlike`),
  commentPost: (postId: string, text: string) => 
    api.post(`/posts/${postId}/comment`, { text }),
  savePost: (postId: string) => api.post(`/posts/${postId}/save`),
  unsavePost: (postId: string) => api.delete(`/posts/${postId}/unsave`),
};

// Story API
export const storyAPI = {
  getStories: () => api.get('/stories'),
  createStory: (data: FormData) => {
    return api.post('/stories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  viewStory: (storyId: string) => api.post(`/stories/${storyId}/view`),
};

// Reel API
export const reelAPI = {
  getReels: (page: number = 1) => api.get('/reels', { params: { page } }),
  createReel: (data: FormData) => {
    return api.post('/reels', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  likeReel: (reelId: string) => api.post(`/reels/${reelId}/like`),
  commentReel: (reelId: string, text: string) => 
    api.post(`/reels/${reelId}/comment`, { text }),
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get('/chats'),
  getConversation: (conversationId: string) => api.get(`/chats/${conversationId}`),
  createConversation: (participantId: string, isCouple: boolean = false) => 
    api.post('/chats', { participantId, isCouple }),
  getMessages: (conversationId: string, page: number = 1) => 
    api.get(`/messages/${conversationId}`, { params: { page } }),
};

// Notification API
export const notificationAPI = {
  getNotifications: (page: number = 1) => 
    api.get('/notifications', { params: { page } }),
  markAsRead: (notificationId: string) => 
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// Search API
export const searchAPI = {
  searchUsers: (query: string) => api.get('/search/users', { params: { q: query } }),
  searchPosts: (query: string) => api.get('/search/posts', { params: { q: query } }),
};

export default api;
