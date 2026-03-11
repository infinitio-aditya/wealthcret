import { User, UserRole } from "../types";
import { CustomUser } from "../types/backend/auth";
import {
  ORG_TYPE_AD,
  ORG_TYPE_RP,
  ORG_TYPE_SP,
  ORG_TYPE_CL,
} from "../types/backend/constants";

export const mapCustomUserToUser = (customUser: CustomUser): User => {
  const roleMap: Record<string, UserRole> = {
    [ORG_TYPE_AD]: "admin",
    [ORG_TYPE_RP]: "referral_partner",
    [ORG_TYPE_SP]: "service_provider",
    [ORG_TYPE_CL]: "client",
  };

  return {
    id: customUser.id.toString(),
    uuid: customUser.uuid,
    name: `${customUser.first_name} ${customUser.last_name}`,
    email: customUser.email,
    role: roleMap[customUser.organization?.org_type || ""] || "client",
    organization: customUser.organization?.name,
    service_providers: customUser.service_providers,
    license: customUser.organization?.license,
  };
};
