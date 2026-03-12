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
export interface Assessment {
  id: string;
  score: number;
  date: string;
  status: 'Conservative' | 'Moderate' | 'Aggressive' | 'Assessment Not taken yet';
  assessedBy: string;
  notes: string;
}

export const getScoreText = (value: number) => {
  if (value === 0) {return 'Assessment Not taken yet';}
  if (value <= 22) {return 'Conservative';}
  if (value >= 23 && value <= 32) {return 'Moderate';}
  return 'Aggressive';
};
