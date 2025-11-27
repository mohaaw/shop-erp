import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if it exists
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string) {
    return this.client.get<ApiResponse<T>>(url);
  }

  async post<T>(url: string, data?: unknown) {
    return this.client.post<ApiResponse<T>>(url, data);
  }

  async put<T>(url: string, data?: unknown) {
    return this.client.put<ApiResponse<T>>(url, data);
  }

  async patch<T>(url: string, data?: unknown) {
    return this.client.patch<ApiResponse<T>>(url, data);
  }

  async delete<T>(url: string) {
    return this.client.delete<ApiResponse<T>>(url);
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
};

// Products API
export const productsApi = {
  getAll: () => apiClient.get('/products'),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  create: (data: unknown) => apiClient.post('/products', data),
  update: (id: string, data: unknown) => apiClient.put(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

// Customers API
export const customersApi = {
  getAll: () => apiClient.get('/customers'),
  getById: (id: string) => apiClient.get(`/customers/${id}`),
  create: (data: unknown) => apiClient.post('/customers', data),
  update: (id: string, data: unknown) => apiClient.put(`/customers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/customers/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: () => apiClient.get('/orders'),
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  create: (data: unknown) => apiClient.post('/orders', data),
  update: (id: string, data: unknown) => apiClient.put(`/orders/${id}`, data),
  delete: (id: string) => apiClient.delete(`/orders/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getSalesChart: () => apiClient.get('/dashboard/sales-chart'),
  getRecentOrders: () => apiClient.get('/dashboard/recent-orders'),
};
