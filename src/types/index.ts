export type UserRole = 'admin' | 'service_provider' | 'referral_partner' | 'client';

export interface Feature {
    id: string;
    name: string;
    allocatedLicenses: number;
    usedLicenses: number;
    billingType: 'monthly' | 'annually';
    amount: number;
    isActive: boolean;
}

export interface Organization {
    id: string;
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    features: Feature[];
    assignedSP?: string;
    referralPartner?: string;
}

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

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    organization?: string;
}

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

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar?: string;
    status: 'active' | 'inactive' | 'pending';
    assignedSP?: string;
    netWorth?: number;
    lastContact?: string;
    services?: string[]; // Array of service IDs
    referralPartner?: string; // Referral partner name
}

export interface FamilyMember {
    id: string;
    clientId: string;
    name: string;
    relation: string;
    email: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    roles: string[]; // Array of role IDs
    avatar?: string;
    joinDate: string;
    phone?: string;
    assignedLicenses?: string[];
    assignedSP?: string;
    referralPartner?: string;
}

export interface Activity {
    id: string;
    clientId: string;
    title: string;
    description: string;
    meetType: 'call' | 'email' | 'physical';
    date: string;
    createdBy: string;
}

export interface RiskProfile {
    id: string;
    clientId: string;
    clientName: string;
    score: number;
    status: 'low' | 'medium' | 'high';
    lastAssessed?: string; // Kept for backward compatibility
    lastAssessmentDate?: string;
    nextReviewDate?: string;
    questions?: QuizQuestion[];
    assignedSP?: string;
    referralPartner?: string;
}

export interface QuizQuestion {
    id: string;
    question?: string;
    text?: string;
    category?: string;
    options: string[] | { id: string; text: string; score: number }[];
    selectedAnswer?: number | string;
}

export interface Document {
    id: string;
    clientId: string;
    name: string;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadDate: string;
    url?: string;
}

export interface Ticket {
    id: string;
    organizationId: string;
    organizationName: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdBy: string;
    assignedTo?: string;
    createdAt: string;
    messages: TicketMessage[];
}

export interface TicketMessage {
    id: string;
    ticketId: string;
    sender: string;
    message: string;
    timestamp: string;
}

export interface License {
    id: string;
    featureName: string;
    name?: string; // For backward compatibility
    allocatedLicenses: number;
    total?: number; // For backward compatibility
    usedLicenses: number;
    used?: number; // For backward compatibility
    billingType: 'monthly' | 'annually' | 'one-time';
    amount: number;
    isActive: boolean;
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
}

export interface DashboardMetric {
    label: string;
    value: string | number;
    change?: number;
    icon: string;
}
