/**
 * Common/Shared Types
 */

export interface ApiError {
  status: number | string;
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  limit?: number;
  offset?: number;
}

export interface ListResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface Document {
  id: string;
  uuid?: string;
  name: string;
  type: string;
  file_url: string;
  uploaded_at?: string;
  status?: 'pending' | 'approved' | 'rejected';
  document_type?: string;
  user?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  is_active?: boolean;
}

export interface ServiceRequest {
  id: string;
  service: Service;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at?: string;
  updated_at?: string;
  user?: string;
}

export interface Compliance {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'failed';
  due_date?: string;
  completed_date?: string;
}

export interface RiskProfile {
  id: string;
  user?: string;
  risk_score: number;
  risk_category: 'low' | 'medium' | 'high' | 'very_high';
  assessment_date?: string;
  valid_until?: string;
  recommendation?: string;
}

export interface Activity {
  id: string;
  type: string;
  description?: string;
  created_at?: string;
  user?: string;
  organization?: string;
}

export interface Referral {
  id: string;
  referee_name: string;
  referee_email?: string;
  referee_phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  commission?: number;
  created_at?: string;
}

export interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  organization?: string;
  created_at?: string;
}

export interface Invitation {
  id: string;
  invite_id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
  accepted_at?: string;
  organization?: Organization;
}

export interface Organization {
  id: string;
  uuid?: string;
  name: string;
  org_type: string;
  description?: string;
  logo_url?: string;
  features?: Feature[];
}

export interface Feature {
  id?: string;
  name: string;
  allocated: number;
  used: number;
}

export interface Theme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  logo_url?: string;
}
