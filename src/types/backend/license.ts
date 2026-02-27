export interface License {
  id?: number;
  feature: Feature;
  max_licenses: number;
  used_licenses: number;
  organization_license: number;
  is_active?: boolean;
  billing_type?:number;
  lump_sum_amount?:number;
  price_per_license?:number;
}


export interface OrganizationLicense {
  id?: number;
  organization: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  organization_name?: string;
  feature_licenses?: License[];
}

export interface Feature {
  id: number;
  label: string;
  name: string;
  billing_type?:number;

}
