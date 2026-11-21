export enum RequestCategory {
  ROADS_AND_BRIDGES = 'ROADS_AND_BRIDGES',
  WATER_SUPPLY = 'WATER_SUPPLY',
  ELECTRICITY = 'ELECTRICITY',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  AGRICULTURE = 'AGRICULTURE',
  EMPLOYMENT = 'EMPLOYMENT',
  YOUTH_DEVELOPMENT = 'YOUTH_DEVELOPMENT',
  COMMUNITY_DEVELOPMENT = 'COMMUNITY_DEVELOPMENT',
  PUBLIC_INFRASTRUCTURE = 'PUBLIC_INFRASTRUCTURE',
  LAND_AND_ENVIRONMENT = 'LAND_AND_ENVIRONMENT',
  OTHER = 'OTHER'
}

export enum RequestStatus {
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ADDITIONAL_INFO_REQUIRED = 'ADDITIONAL_INFO_REQUIRED',
  REFERRED_TO_DEPARTMENT = 'REFERRED_TO_DEPARTMENT',
  ACTION_IN_PROGRESS = 'ACTION_IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export interface CitizenRequest {
  id: string;
  referenceNumber: string; // e.g. 'REQ-2026-00123'
  citizenProfileId?: string;
  isAnonymous: boolean;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  preferredContactMethod: 'PHONE' | 'EMAIL' | 'IN_APP';
  category: RequestCategory;
  subject: string;
  description: string;
  province: string;
  district: string;
  llg: string;
  ward: string;
  village: string;
  specificLocation?: string;
  latitude?: number;
  longitude?: number;
  status: RequestStatus;
  urgency: 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY';
  assignedToOfficerId?: string;
  assignedOfficerName?: string;
  departmentReferredTo?: string;
  resolutionSummary?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: RequestAttachment[];
  comments?: RequestComment[];
}

export interface RequestAttachment {
  id: string;
  requestId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isPublic: boolean;
  uploadedAt: string;
}

export interface RequestComment {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  isInternalOnly: boolean;
  content: string;
  createdAt: string;
}
