import apiClient from '@/api/axios';
import { Lead } from '@/features/leads/types';
import { ApiResponse } from '@/types';

export interface DashboardStats {
  total: number;
  new: number;
  qualified: number;
  lost: number;
  recent: Lead[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>('/leads/stats/summary');
  return response.data.data;
};
