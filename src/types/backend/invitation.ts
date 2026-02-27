export interface Invitation{
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
}

export interface InvitationVerifyRequest {
  uuid: string;
  mobile_number: string;
  dob: string;
  gender: string;
  is_mobile_verified: boolean;
  password: string;
  confirm_password: string;
}

export interface InvitationVerifyResponse {
  success: boolean;
  message: string;
}

export interface InvitationCreateRequest {
  organization: string;
  org_type: string;
  referrar?: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  is_admin: boolean;
  relation_to_admin?:number;
}

export interface InvitationCreateResponse {
  success: boolean;
}
