/**
 * Dashboard Related Types
 */

export interface DashboardMetric {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  color?: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  greeting?: string;
  userName?: string;
  role?: string;
  lastUpdated?: string;
  organization?: string;
}

export interface UserAggregatedData {
  id?: string;
  user?: string;
  data?: DashboardData;
  metrics?: Record<string, any>;
  [key: string]: any;
}

export interface PortfolioData {
  portfolio_value: number;
  invested_amount: number;
  returns: number;
  returns_percentage: number;
  assets: PortfolioAsset[];
}

export interface PortfolioAsset {
  name: string;
  quantity: number;
  price: number;
  value: number;
  percentage: number;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string;
  url: string;
  image_url?: string;
  created_at?: string;
  is_deleted?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
