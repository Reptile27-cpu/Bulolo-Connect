export interface CommunityProfile {
  id: string;
  name: string;
  llg: string;
  ward: string;
  village: string;
  description: string;
  publicFacilities: string[];
  keyPriorities: string[];
  economicActivities: string[];
  activeInitiatives: string[];
  communityLeaderContact?: string;
  updatedAt: string;
}

// Strict Privacy Requirements: Household details are private and accessible only by authorized welfare officers
export interface Household {
  id: string;
  referenceNumber: string; // e.g. 'HHD-2026-00341'
  primaryContactUserId: string;
  headOfHouseholdName: string;
  headOfHouseholdNID?: string;
  llg: string;
  ward: string;
  village: string;
  residentialAddress: string;
  householdSize: number;
  vulnerabilityStatus?: string[]; // e.g. Single Parent, Elderly Care, Disability Support
  specialAssistanceNotes?: string;
  members?: HouseholdMember[];
  createdAt: string;
  updatedAt: string;
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  fullName: string;
  relationshipToHead: string; // Spouse, Child, Parent, Sibling, Other
  dateOfBirth?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  isAttendingSchool: boolean;
  schoolName?: string;
  hasSpecialNeeds: boolean;
}
