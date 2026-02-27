import { CustomUser, Organization } from "./auth";

export interface ProspectOrg{
  id: number;
  name: string;
  org_type: string
}

export interface ProspectRequest{
  first_name: string;
  last_name: string;
  email: string;
  individual: boolean;
  company?: string;
  services?: string[];
  licenses?: string[];
}

export interface BulkProspectRequest {
  FirstName: string;
  MiddleName: string
  LastName: string;
  Company: string;
  Email: string;
  Individual: string
}

export interface BulkProspectResponse {
  success: boolean;
  created: number;
  failed: number;
  errors: Record<string, string>[]
}

export interface Activity{
  created?: string;
  updated?: string;
  reminder_before?: number;
  due_date?: string;
  created_by?: string;
  updated_by?: string;
  activity_type: string;
  details: string;
  name: string;
  user: number;
}

export interface Prospect {
  id: number;
  organization: Organization;
  user: CustomUser;
  invitation_details: Object;
  activities: Activity[];
  owner: string;
}

export interface ProspectAssociation {
  id: number;
  user: CustomUser;
  organization: Organization;
  invitation_accepted: boolean;
  created: string;
  owner: number;
  owner_name: string;
}


export interface CreateAssociationRequest {
  organization_id: number;
  user_id: number;
  type: number;
  delete_old: boolean;
  old_organization?: number;
}

export interface ProspectResponse{
  count: number;
  next: string;
  previous: string;
  results: ProspectAssociation[]; 
}
