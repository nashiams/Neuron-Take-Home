import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useRequestStore = create((set) => ({
  user: null,
  requests: [],
  pendingApprovals: [],
  myApprovals: [],
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      set({ user: response.data.user, loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, requests: [], pendingApprovals: [], myApprovals: [] });
  },

  loadUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      set({ user: JSON.parse(userStr) });
    }
  },

  createRequest: async (type, details, notes) => {
    set({ loading: true, error: null });
    try {
      await api.post("/api/requests", { type, details, notes });
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create request",
        loading: false,
      });
      return false;
    }
  },

  fetchMyRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/requests/my-requests");
      set({ requests: response.data.requests, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch requests",
        loading: false,
      });
    }
  },

  fetchPendingApprovals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/requests/pending-approvals");
      set({ pendingApprovals: response.data.requests, loading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch pending approvals",
        loading: false,
      });
    }
  },

  approveRequest: async (id, notes) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/api/requests/${id}/approve`, { notes });
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to approve request",
        loading: false,
      });
      return false;
    }
  },

  rejectRequest: async (id, notes) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/api/requests/${id}/reject`, { notes });
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to reject request",
        loading: false,
      });
      return false;
    }
  },

  fetchMyApprovals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/requests/my-approvals");
      set({ myApprovals: response.data.requests, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch approvals",
        loading: false,
      });
    }
  },

  registerEmployee: async (employeeData) => {
    set({ loading: true, error: null });
    try {
      await api.post("/api/auth/register", employeeData);
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to register employee",
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
