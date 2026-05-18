import { z } from 'zod';

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedLeads {
  success: boolean;
  message: string;
  data: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Validation schemas for React Hook Form
export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  status: z.nativeEnum(LeadStatus, { message: 'Status is required' }),
  source: z.nativeEnum(LeadSource, { message: 'Source is required' }),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
