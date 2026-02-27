import { CustomUser } from "./auth";

export interface RiskProfile {
  id: number;
  user: CustomUser;
  last_calculated: string;
  current_score: number;
  history: Object;
  document_id?: number
}

interface RiskProfileQuestionOption {
  id: number;
  label: string;
  value: number;
}

export interface RiskProfileQuestion {
  id: number;
  label: string;
  options: RiskProfileQuestionOption[];
}

export interface RiskProfileResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RiskProfile[];
}
