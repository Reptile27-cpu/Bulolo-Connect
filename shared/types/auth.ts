export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  MP_OFFICE_REP = 'MP_OFFICE_REP',
  OFFICE_STAFF = 'OFFICE_STAFF',
  LLG_ADMIN = 'LLG_ADMIN',
  COMMUNITY_REP = 'COMMUNITY_REP',
  CITIZEN = 'CITIZEN',
  PUBLIC_VISITOR = 'PUBLIC_VISITOR'
}

export interface UserSession {
  id: string;
  accountId: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  role: UserRole;
  preferredLanguage: 'en' | 'tpi';
  isVerified: boolean;
  assignedLlgId?: string;
  citizenProfileId?: string;
}

export interface AuthResponse {
  token: string;
  user: UserSession;
  message?: string;
}

export interface RegisterCitizenDto {
  fullName: string;
  email?: string;
  phoneNumber: string;
  province: string;
  district: string;
  llg: string;
  ward: string;
  village: string;
  residentialLocation: string;
  isDiaspora: boolean;
  preferredLanguage: 'en' | 'tpi';
  password: string;
}

export interface LoginDto {
  identifier: string; // phone number or email
  password: string;
}
