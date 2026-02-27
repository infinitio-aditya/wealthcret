export interface GenericNews {
  id?: number;
  created: string;
  title: string;
  category: string;
  sub_category: string;
  description: string;
  url: string;
}

export interface GenericNewsResponse {
  count: number;
  next: string;
  previous: string;
  results: GenericNews[]; 
}
