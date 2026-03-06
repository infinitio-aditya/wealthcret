import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../configs/axios/AxiosBaseQuery';

export interface SupportTicket {
  id?: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at?: string;
  updated_at?: string;
}

export interface SupportTicketMessage {
  id?: number;
  support_ticket: number;
  message: string;
  created_at?: string;
  user?: any;
}

export interface SupportDashboard {
  open_tickets: number;
  in_progress_tickets: number;
  closed_tickets: number;
}

export interface SupportConfiguration {
  id: number;
  max_attachments: number;
}

export interface SupportTicketResponse {
  count: number;
  next: string;
  previous: string;
  results: SupportTicket[];
}

export const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['supportTickets', 'supportTicketsMessages', 'supportDashboard', 'supportConfiguration'],
  endpoints: (builder) => ({
    getSupportTickets: builder.query<SupportTicketResponse, { page: number; page_size: number }>({
      query: ({ page, page_size }) => ({
        url: '/api/support/tickets/',
        method: 'GET',
        params: { page, page_size },
      }),
      providesTags: ['supportTickets'],
    }),

    createSupportTicket: builder.mutation<SupportTicket, Partial<SupportTicket>>({
      query: (ticket) => ({
        url: '/api/support/tickets/',
        method: 'POST',
        data: ticket,
      }),
      invalidatesTags: ['supportTickets'],
    }),

    retrieveSupportTicket: builder.query<SupportTicket, number>({
      query: (id) => ({
        url: `/api/support/tickets/${id}/`,
        method: 'GET',
      }),
      providesTags: ['supportTickets'],
    }),

    updateSupportTicket: builder.mutation<SupportTicket, Partial<SupportTicket>>({
      query: (ticket) => ({
        url: `/api/support/tickets/${ticket.id}/`,
        method: 'PATCH',
        data: ticket,
      }),
      invalidatesTags: ['supportTickets'],
    }),

    createSupportTicketMessage: builder.mutation<SupportTicketMessage, Partial<SupportTicketMessage>>(
      {
        query: (message) => ({
          url: `/api/support/tickets/${message.support_ticket}/messages/`,
          method: 'POST',
          data: message,
        }),
        invalidatesTags: ['supportTicketsMessages'],
      }
    ),

    getSupportTicketMessages: builder.query<SupportTicketMessage[], number>({
      query: (ticketId) => ({
        url: `/api/support/tickets/${ticketId}/messages/`,
        method: 'GET',
      }),
      providesTags: ['supportTicketsMessages'],
    }),

    getSupportDashboard: builder.query<SupportDashboard, void>({
      query: () => ({
        url: '/api/support/dashboard/',
        method: 'GET',
      }),
      providesTags: ['supportDashboard'],
    }),

    getSupportConfiguration: builder.query<SupportConfiguration, void>({
      query: () => ({
        url: '/api/support/configuration/',
        method: 'GET',
      }),
      providesTags: ['supportConfiguration'],
    }),

    updateSupportConfiguration: builder.mutation<SupportConfiguration, Partial<SupportConfiguration>>(
      {
        query: (config) => ({
          url: '/api/support/configuration/',
          method: 'PATCH',
          data: config,
        }),
        invalidatesTags: ['supportConfiguration'],
      }
    ),
  }),
});

export const {
  useLazyGetSupportTicketsQuery,
  useRetrieveSupportTicketQuery,
  useGetSupportTicketMessagesQuery,
  useGetSupportDashboardQuery,
  useGetSupportConfigurationQuery,
  useCreateSupportTicketMutation,
  useUpdateSupportTicketMutation,
  useCreateSupportTicketMessageMutation,
  useUpdateSupportConfigurationMutation,
  useGetSupportTicketsQuery,
} = supportApi;
