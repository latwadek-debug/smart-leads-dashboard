import apiClient from '@/api/axios';
import { Lead, LeadFormData, PaginatedLeads, LeadFilters } from './types';
import { ApiResponse } from '@/types';

export const getLeads = async (filters: LeadFilters): Promise<PaginatedLeads> => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);
  if (filters.source) params.append('source', filters.source);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);

  const response = await apiClient.get<PaginatedLeads>(`/leads?${params.toString()}`);
  return response.data;
};

export const getLeadById = async (id: string): Promise<Lead> => {
  const response = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
  return response.data.data;
};

export const createLead = async (data: LeadFormData): Promise<Lead> => {
  const response = await apiClient.post<ApiResponse<Lead>>('/leads', data);
  return response.data.data;
};

export const updateLead = async ({ id, data }: { id: string; data: Partial<LeadFormData> }): Promise<Lead> => {
  const response = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, data);
  return response.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await apiClient.delete(`/leads/${id}`);
};

export const exportLeadsCsv = async (filters: LeadFilters): Promise<void> => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.source) params.append('source', filters.source);
  if (filters.search) params.append('search', filters.search);

  // Use raw axios to handle blob response correctly
  const response = await apiClient.get(`/leads/export/csv?${params.toString()}`, {
    responseType: 'blob',
  });

  // Create a temporary link to download the blob
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `leads-export-${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
