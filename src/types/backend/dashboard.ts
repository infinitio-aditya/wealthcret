export interface UserAggregatedData {
  earnings: number;
  active_customers: number;
  active_prospects: number;
  aum: number;
  active_customers_change: number;
  active_prospects_change: number;
  aum_change: number;
  history: {
    month: number;
    year: number;
    earnings: number;
    revenue: number;
  }[];
}
