export interface Role {
  id: number;
  label: string;
  name: string;
  is_active: boolean;
  organization: number;
}

export interface TeamMemberRole {
  id: number;
  user: number;
  organization: number;
  role: Role;
  is_active: boolean;
}
