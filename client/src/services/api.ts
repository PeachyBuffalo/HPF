import axios, { AxiosInstance } from 'axios';
import { HealthcarePlan, UserPreferences, AuthResponse, LoginCredentials } from '../types/api.types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/token`, formData);
  return response.data;
};

export const fetchHealthcarePlans = async (filters = {}): Promise<HealthcarePlan[]> => {
  const response = await api.get<HealthcarePlan[]>('/plans/', { params: filters });
  return response.data;
};

export const getHealthcarePlan = async (planId: number): Promise<HealthcarePlan> => {
  const response = await api.get<HealthcarePlan>(`/plans/${planId}`);
  return response.data;
};

export const ratePlan = async (planId: number, rating: number, review?: string) => {
  const response = await api.post(`/plans/${planId}/rate`, { rating, review });
  return response.data;
};

export const getRecommendedPlans = async (preferences: UserPreferences): Promise<HealthcarePlan[]> => {
  const response = await api.post<HealthcarePlan[]>('/recommend/', preferences);
  return response.data;
};

export const updateUserPreferences = async (preferences: UserPreferences) => {
  const response = await api.post('/preferences/', preferences);
  return response.data;
}; 