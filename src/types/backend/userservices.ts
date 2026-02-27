import { CustomUser } from "./auth";

export interface Service {
  id: number;
  name: string;
  label: string;
  description?: string;
  revenue_params?: Object;
}


export interface OrganizationService {
    id?: number;
    service: number;
    segment?: string;
    commission?: number;
    aum?: string;
}


export interface UserService {
  id: number;
  user?: CustomUser;
  service: Service;
  sp_owner: number;
  sp_owner_org: number;
  owner_commission: number;
  details: Object;
  amount: number;
  is_converted: Boolean;
  is_closed: Boolean;
  pipeline_status: string;
  closed_lost_reason: string;
}

export interface AssignmentRequestResponse {
  count: number;
  next: string;
  previous: string;
  results: UserService[]; 
}
