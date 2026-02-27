import { CustomUser } from "./auth";

export interface SupportTicketResponse {
  results: SupportTicket[];
  count: number;
  next: string | null;
  previous: string | null;
}


export interface SupportTicket {
  id: number;
  title: string;
  description: string;
  status: number;
  created: string;
  updated: string;
  assigned_to_user: string;
  assigned_to_org: number;
  sender_id: number;
  user: CustomUser;
}

export interface SupportTicketMessage {
  id: number;
  support_ticket: number;
  user: number;
  message: string;
  created: string;
  updated: string;
  sender_id: number;
  sender_name: string;
}

export interface SupportDashboard {
  total_tickets: number;
  open_tickets: number;
  closed_tickets: number;
  pending_tickets: number;
}

export interface SupportConfiguration {
  id: number;
  assignment_type: number;
  settings: Record<any, any>;
}
