export enum ProjectCategory {
  ROADS_AND_BRIDGES = 'ROADS_AND_BRIDGES',
  EDUCATION = 'EDUCATION',
  HEALTHCARE = 'HEALTHCARE',
  WATER_AND_SANITATION = 'WATER_AND_SANITATION',
  ELECTRICITY = 'ELECTRICITY',
  AGRICULTURE = 'AGRICULTURE',
  COMMUNITY_INFRASTRUCTURE = 'COMMUNITY_INFRASTRUCTURE',
  YOUTH_DEVELOPMENT = 'YOUTH_DEVELOPMENT',
  ECONOMIC_DEVELOPMENT = 'ECONOMIC_DEVELOPMENT'
}

export enum ProjectStatus {
  PROPOSED = 'PROPOSED',
  UNDER_ASSESSMENT = 'UNDER_ASSESSMENT',
  APPROVED = 'APPROVED',
  PROCUREMENT = 'PROCUREMENT',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  DELAYED = 'DELAYED',
  COMPLETED = 'COMPLETED',
  SUSPENDED = 'SUSPENDED'
}

export interface DevelopmentProject {
  id: string;
  projectCode: string; // e.g. 'BDP-2026-008'
  title: string;
  description: string;
  category: ProjectCategory;
  llg: string;
  ward: string;
  specificLocation: string;
  latitude?: number;
  longitude?: number;
  implementingAgency: string;
  contractorName?: string;
  commencementDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: ProjectStatus;
  progressPercentage: number; // 0 to 100
  publishedBudgetKina?: number; // strictly verified
  fundingSource?: string; // e.g. 'Bulolo DSIP 2025/2026'
  isFinanciallyVerified: boolean;
  featuredImageUrl?: string;
  updates?: ProjectUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  updateDate: string;
  title: string;
  reportSummary: string;
  progressPercentage: number;
  statusAtUpdate: ProjectStatus;
  inspectionOfficerName: string;
  photoUrls?: string[];
  createdAt: string;
}
