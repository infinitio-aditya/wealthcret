import { OrganizationLicense } from "./license";

export interface SendOTPRequest {
  mobile_number: string
  uuid: string
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  mobile_number: string
  uuid: string
  otp: string
}

export interface VerifyOTPResponse {
  isOTPVerified: boolean;
  message: string;
  token?: string
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: CustomUser;
  detail?: string;
}

export interface ForgotPasswordSendRequest {
  email: string;
}

export interface ForgotPasswordVerifyRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  org_type: string;
  fin_type: string;
  is_active: string;
  address: string;
  city: string;
  state: string;
  default_commission: number;
  display_name?: string;
  logo_url?: string;
  icon_url?: string;
  license?: OrganizationLicense;
}

export interface CustomUser {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  dob: string;
  email: string;
  mobile_number: string;
  type: string;
  is_admin: boolean;
  organization: Organization;
  application_status: string;
  application_status_display?: string;
  user_type_display?:string;
  alternate_contact_name: string;
  alternate_contact: string;
  is_staff: boolean;
  pipeline_status: string;
  user_type: number;
  is_masked: boolean;
  theme: Record<string, any>;
  feature_licenses?: string[];
  my_subscriptions: UserFeatureSubscription[];
  uuid?: string;
  created?: string;
  relation_to_admin?:number;
  service_providers: { value: number; label: string }[];
}

export interface MaskedInResponse {
  token: string;
}

export interface OrganizationTheme {
  id: number;
  organization: number;
  display_name: string;
  theme: Record<string, any>
  icon: string;
  logo: string;
}

export interface PredefinedTheme {
  id: number;
  name: number;
  theme: Record<string, any>
}

export interface CustomUserSearchResponse {
  count: number;
  next: string;
  prev: string;
  results: CustomUser[]
}


export interface UserFeatureSubscription {
  id?: number;
  user: number;
  feature_license: number;
  subscribed_on: string;
  is_active: boolean;
  billing_type:number;
  lum_sum_amount?:number;
  price_per_license?:number;
}

export interface BulkUploadJob {
  id?: number;
  name: string;
  organization: number;
  status?: number;
  total_records?: number;
  success_records?: number;
  failed_records?: number;
  file: any; // Changed from File to any for mobile compatibility
  progress?: number;
}


export interface BulkUploadJobRecordResponse {
  count: number;
  results: BulkUploadJobRecord[]
  next: string;
  previous: string;
}
export interface OrgnizationListResponse{
  count:number;
  results:Organization[]
  next:string;
  previous:string;
}

export interface BulkUploadJobRecord {
  id?: number;
  record: Record<any, any>;
  settings?: Record<any, any>;
  error_details?: string;
  bulk_upload_job: number;
  status?: number;
  invited?: boolean;
}
export interface BulkInviteError {
  id: number;
  error: string;
}
export interface BulkInviteResponse {
  created: number;
  failed: number;
  errors: BulkInviteError[]
}
