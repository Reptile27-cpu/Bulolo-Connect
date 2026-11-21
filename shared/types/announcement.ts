export enum AnnouncementCategory {
  OFFICIAL_NOTICE = 'OFFICIAL_NOTICE',
  PUBLIC_MEETING = 'PUBLIC_MEETING',
  COMMUNITY_CONSULTATION = 'COMMUNITY_CONSULTATION',
  EDUCATIONAL_OPPORTUNITY = 'EDUCATIONAL_OPPORTUNITY',
  ASSISTANCE_PROGRAMME = 'ASSISTANCE_PROGRAMME',
  AGRICULTURAL_NOTICE = 'AGRICULTURAL_NOTICE',
  HEALTH_AWARENESS = 'HEALTH_AWARENESS',
  EMERGENCY_NOTICE = 'EMERGENCY_NOTICE',
  DISTRICT_UPDATE = 'DISTRICT_UPDATE'
}

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  summary: string;
  content: string;
  publishDate: string;
  expiryDate?: string;
  targetLlg?: string; // Optional: specific to one LLG, or district-wide if null
  targetWard?: string;
  isUrgent: boolean;
  isPublished: boolean;
  authorStaffName: string;
  attachmentUrls?: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'REQUEST_UPDATE' | 'ASSISTANCE_UPDATE' | 'ANNOUNCEMENT' | 'SYSTEM';
  referenceId?: string; // e.g. Request ID or Application ID
  isRead: boolean;
  createdAt: string;
}
