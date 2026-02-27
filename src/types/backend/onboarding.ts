import { CustomUser } from "./auth";

export interface ApprovalRequest{
  id: number;
  user: CustomUser;
  approval_comments: string;
  approved_by: string;
  created: string;
  status: string;
  approval_comment: string;
}
