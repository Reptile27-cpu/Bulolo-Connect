export enum ServiceCategory {
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  GOVERNMENT_OFFICE = 'GOVERNMENT_OFFICE',
  AGRICULTURE = 'AGRICULTURE',
  POLICE_AND_EMERGENCY = 'POLICE_AND_EMERGENCY',
  BUSINESS_SUPPORT = 'BUSINESS_SUPPORT',
  EMPLOYMENT_AND_TRAINING = 'EMPLOYMENT_AND_TRAINING',
  COMMUNITY_ORGANISATION = 'COMMUNITY_ORGANISATION',
  CHURCH_AND_FAITH = 'CHURCH_AND_FAITH',
  TRANSPORT = 'TRANSPORT',
  OTHER_ESSENTIAL = 'OTHER_ESSENTIAL'
}

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  OUTDATED = 'OUTDATED'
}

export interface DistrictService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  organisationName: string;
  physicalAddress: string;
  llg: string;
  ward: string;
  phoneNumber: string;
  alternativePhone?: string;
  email?: string;
  operatingHours: string;
  servicesOffered: string[];
  latitude?: number;
  longitude?: number;
  officialWebsite?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedByOfficerName?: string;
  informationSource: string;
  isEmergencyService: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceSuggestion {
  id: string;
  serviceId?: string;
  suggestedName: string;
  category: ServiceCategory;
  details: string;
  submitterContact?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}
