export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface StudentProfile {
  _id?: string;
  userId: string;
  educationLevel: string;
  course: string;
  specialization?: string;
  yearOfStudy: string;
  institution: string;
  cgpa?: number; // 10.0 scale
  scorePercent?: number;
  academicAchievements?: string;
  stateOrRegion: string;
  country: string;
  familyIncomeAnnual?: number; // in INR
  incomeRange?: string; // in Lakhs
  reservationCategory?: string; // 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  studyInterests: string[];
  preferredCategories: string[];
  documentsReady: string[];
  digiLockerVerifiedDocs?: string[];
  isOnboarded: boolean;
  updatedAt?: string;
}

export interface EligibilityResult {
  scholarshipId: string;
  outcome: 'Strong Match' | 'Needs Confirmation' | 'Does Not Match';
  statusColor: 'emerald' | 'amber' | 'rose';
  requirementsSatisfied: string[];
  requirementsNotSatisfied: string[];
  missingInformation: string[];
  plainLanguageExplanation: string;
  recommendedNextSteps: string[];
  readinessDimensions: {
    eligibilityFitScore: number;
    eligibilityFitLabel: string;
    documentReadinessScore: number;
    documentReadinessLabel: string;
    documentsReadyCount: number;
    documentsTotalCount: number;
    readyDocumentsList: string[];
    missingDocumentsList: string[];
    digiLockerVerifiedCount: number;
    digiLockerReadyCount: number;
    deadlineUrgencyStatus: 'expired' | 'closing_soon' | 'approaching' | 'open' | 'future_opening';
    daysRemaining: number;
    deadlineFormatted: string;
    applicationReadinessScore: number;
    applicationReadinessLabel: string;
  };
}

export interface Scholarship {
  _id: string;
  name: string;
  provider: string;
  description: string;
  fundingAmount: number; // in INR
  fundingFormatted: string; // e.g. '₹2,00,000 Total Grant'
  fundingType: 'full_tuition' | 'partial' | 'stipend' | 'grant' | 'merit_award';
  educationLevels: string[];
  eligibleCourses: string[];
  minScorePercent?: number;
  minCgpa?: number; // 10.0 scale
  maxAnnualIncome?: number; // in INR
  eligibleCategories?: string[]; // General, OBC, SC, ST, EWS, All
  eligibleRegions: string[];
  eligibleStudyYears: string[];
  requiredDocuments: string[];
  digiLockerSupportedDocs?: string[];
  applicationOpeningDate: string;
  applicationDeadline: string;
  officialUrl: string;
  sourceMetadata: {
    sourceName: string;
    sourceType: 'government' | 'university' | 'foundation' | 'corporate';
    lastCheckedDate: string;
    verifiedBy: string;
    portalSchemeCode?: string;
  };
  verificationStatus: 'verified_official' | 'not_verified' | 'verification_required' | 'expired';
  lifecycleStatus: 'active' | 'draft' | 'archived';
  isDemoData: boolean;
  categoryTags: string[];
  isSaved?: boolean;
  trackerStatus?: string;
  eligibility?: EligibilityResult;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChecklistItem {
  documentName: string;
  isReady: boolean;
  isDigiLockerVerified?: boolean;
  notes?: string;
}

export interface Application {
  _id: string;
  studentId: string;
  scholarshipId: string;
  trackerStatus:
    | 'interested'
    | 'preparing_documents'
    | 'ready_to_apply'
    | 'applied'
    | 'under_review'
    | 'awarded'
    | 'rejected'
    | 'withdrawn';
  notes: string;
  appliedDate?: string;
  deadlineDate?: string;
  checklistProgress: DocumentChecklistItem[];
  scholarship?: Scholarship | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalMatching: number;
  strongMatches: number;
  needsConfirmation: number;
  savedCount: number;
  inProgressApplications: number;
  upcomingDeadlinesCount: number;
  documentReadinessPercent: number;
  documentsReadyCount: number;
  digiLockerVerifiedCount?: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  upcomingDeadlines: Array<Scholarship & { daysRemaining: number }>;
  recommendedScholarships: Scholarship[];
  profileCompletion: {
    isOnboarded: boolean;
    hasAcademicScores: boolean;
    hasIncomeData: boolean;
    missingKeyFields: string[];
  };
}

export interface DbStatus {
  connected: boolean;
  mode: 'mongodb_atlas' | 'local_persistent_store';
  uriConfigured: boolean;
  databaseName: string;
  error: string | null;
  lastChecked: string;
}
