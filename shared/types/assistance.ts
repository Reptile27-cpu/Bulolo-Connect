export enum AssistanceCategory {
  EDUCATIONAL_ASSISTANCE = 'EDUCATIONAL_ASSISTANCE',
  MEDICAL_ASSISTANCE = 'MEDICAL_ASSISTANCE',
  FAMILY_AND_SOCIAL = 'FAMILY_AND_SOCIAL',
  AGRICULTURAL_ASSISTANCE = 'AGRICULTURAL_ASSISTANCE',
  YOUTH_DEVELOPMENT = 'YOUTH_DEVELOPMENT',
  COMMUNITY_ORGANISATION_SUPPORT = 'COMMUNITY_ORGANISATION_SUPPORT'
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ADDITIONAL_INFO_REQUIRED = 'ADDITIONAL_INFO_REQUIRED',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  COMPLETED = 'COMPLETED'
}

export interface AssistanceProgramme {
  id: string;
  code: string;
  title: string;
  category: AssistanceCategory;
  description: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  isOpen: boolean;
  openingDate: string;
  closingDate?: string;
  responsibleOffice: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  maximumGrantAmount?: number;
}

export interface AssistanceApplication {
  id: string;
  applicationNumber: string; // e.g. 'AST-2026-0042'
  programmeId: string;
  programmeTitle?: string;
  programmeCategory?: AssistanceCategory;
  citizenProfileId: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  llg: string;
  ward: string;
  village: string;
  householdReference?: string;
  requestedAmount?: number;
  statementOfNeed: string;
  status: ApplicationStatus;
  reviewedByStaffId?: string;
  reviewedByStaffName?: string;
  reviewedAt?: string;
  decisionDate?: string;
  decisionReason?: string;
  documents?: ApplicationDocument[];
  decisions?: ApplicationDecision[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ApplicationDecision {
  id: string;
  applicationId: string;
  decisionOfficerId: string;
  decisionOfficerName: string;
  status: ApplicationStatus;
  amountApproved?: number;
  explanation: string;
  decisionDate: string;
}
