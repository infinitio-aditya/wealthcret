import { Organization } from "./auth";
import { Service } from "./userservices";

export interface PIE_CHART_DATA_TYPE {
  name: string;
  value: number;
}

export interface Commission {
  id?: number;
  name: string;
  month: number;
  year: number;
  service_provider: number;
  processing_status?: number;
  payout_status?: number;
  task_type: number;
  earnings?: Record<any, any>;
  task_items?: CommissionItem[];
}

export interface CommissionItem {
  id?: number;
  created?: string;
  updated?: string;
  service: number;
  referral_partner: number;
  commission_task: number;
  earnings?: Record<any, any>;
  settings?: Record<any, any>;
}

export interface CommissionResponse {
  count: number;
  next: string;
  previous: string;
  results: Commission[]; 
}

export interface PayoutResponse {
  count: number;
  next: string;
  previous: string;
  results: Commission[]; 
}

export interface ServiceItem {
  id?: number;
  service: Service;
  total_revenue?: number;
  total_earnings?: number;
  payout: number;
}


export interface Payout {
  id?: number;
  month: number;
  year: number;
  service_provider: Organization;
  referral_partner: Organization;
  service_items?: ServiceItem[];
  total_revenue?: number;
  total_earnings?: number;
  sp_earnings?: number;
  rp_earnings?: number;
  wa_earnings?: number;
  is_paid?: boolean;
  pie_chart_data?: PIE_CHART_DATA_TYPE[];
}

export interface PayoutFileUploadTask {
  service_provider: number;
  month: number;
  year: number;
  current_progress: number;
  status: number;
  stats: Record<string, string>
}


export interface PayoutFileUploadTaskResponse {
  count: number;
  next: string;
  previous: string;
  results: PayoutFileUploadTask[]; 
}

export interface SearchResponse {
  success: boolean;
  results: CommissionItem[];
}

export interface SearchItem {
  service: string;
  commission: number;
  ad_commission: number;
}
