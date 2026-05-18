import apiClient from '@/api/axios';
import { AuthResponseData, ApiResponse } from '@/types';
import { LoginFormData, RegisterFormData } from './schema';

export const loginApi = async (data: LoginFormData): Promise<AuthResponseData> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
  return response.data.data;
};

export const registerApi = async (data: RegisterFormData): Promise<AuthResponseData> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
  return response.data.data;
};
