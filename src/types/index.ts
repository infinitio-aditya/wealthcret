export type UserRole = 'admin' | 'service_provider' | 'referral_partner' | 'client';

export interface CustomerMapping {
    id: string;
    customerName: string;
    externalId: string;
    internalId: string;
    system: string;
    status: 'active' | 'pending';
    lastSync: string;
    serviceProvider: string;
    email?: string;
    mobile?: string;
    services?: string[];
    referralPartner?: string;
}

import { CustomUser } from './backend/auth';

export type User = CustomUser;

export interface Theme {
    name: string;
    id: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        card: string;
        text: string;
        textSecondary: string;
        textOnPrimary: string; // High contrast text for use on primary/gradient backgrounds
        border: string;
        success: string;
        warning: string;
        error: string;
        info: string;
    };
    effects: {
        cardBackground: string;
        cardBorder: string;
        cardShadow: string;
        glassBackground: string;
        glassBlur: string;
        buttonGradient: string[];
        hoverTransform: string;
    };
}

export interface OnboardingProgress {
    percentage: number;
    uploadedDocs: number;
    totalDocs: number;
    signedDocs: number;
    totalSignedDocs: number;
}



export interface OrganizationRequest {
    id: string;
    organizationName: string;
    requestType: 'service_provider' | 'referral_partner' | 'admin';
    contactPerson: string;
    email: string;
    phone: string;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    description: string;
}

export interface ServiceRequest {
    id: string;
    serviceName: string;
    clientId: string;
    clientName: string;
    organizationId?: string;
    status: 'pending' | 'assigned' | 'completed';
    requestDate: string;
    priority: 'low' | 'medium' | 'high';
}

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    domain: string;
    date: string;
    image?: string;
    category?: string;
    sub_category?: string;
}

export interface DashboardMetric {
    label: string;
    value: string | number;
    change?: number;
    icon: string;
}

export interface Payout {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'processing';
    requestDate: string;
    partnerId: string;
    partnerName: string;
    payoutDate: string;
}

