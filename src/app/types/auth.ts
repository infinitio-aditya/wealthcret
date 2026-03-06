/**
 * Authentication Related Types
 */

export type UserRole = 'admin' | 'service_provider' | 'referral_partner' | 'client';

export interface Organization {
  id?: string;
  uuid?: string;
  name: string;
  org_type: 'admin' | 'service_provider' | 'referral_partner' | 'client';
  description?: string;
  is_active?: boolean;
  default_commission?: number;
  features?: Feature[];
  theme?: any;
}

export interface Feature {
  name: string;
  allocated: number;
  used: number;
  billing_type: string;
  amount: number;
}

export interface CustomUser {
  id?: string;
  uuid?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email: string;
  mobile_number?: string;
  gender?: 'M' | 'F' | 'O';
  dob?: string;
  is_mobile_verified?: boolean;
  organization?: Organization;
  organization_id?: string;
  is_admin?: boolean;
  is_staff?: boolean;
  user_type?: string;
  application_status?: string;
  pipeline_status?: string;
  alternate_contact?: string;
  alternate_contact_name?: string;
  avatar?: string;
  role?: UserRole;
  my_subscriptions?: FeatureSubscription[];
}

export interface FeatureSubscription {
  name: string;
  allocated: number;
  used: number;
  billing_type: string;
  amount: number;
}

// Request/Response Types for Authentication Endpoints

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh?: string;
  user?: CustomUser;
  token?: string; // For compatibility with different API versions
}

export interface SendOTPRequest {
  phone_number?: string;
  email?: string;
  method?: 'sms' | 'email';
}

export interface SendOTPResponse {
  otp_request_id?: string;
  message?: string;
  success: boolean;
}

export interface VerifyOtpRequest {
  otp_request_id?: string;
  otp: string;
  email?: string;
  phone_number?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  otp_verified?: boolean;
}

export interface ForgotPasswordSendRequest {
  email: string;
}

export interface ForgotPasswordSendResponse {
  otp_request_id?: string;
  message?: string;
  success: boolean;
}

export interface ForgotPasswordVerifyRequest {
  email: string;
  otp: string;
  otp_request_id?: string;
}

export interface ForgotPasswordVerifyResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export interface ResetPasswordRequest {
  email: string;
  new_password: string;
  otp_request_id?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

export interface LogoutRequest {
  // Can be empty or contain additional data if needed
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}
