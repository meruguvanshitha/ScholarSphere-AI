import bcrypt from 'bcryptjs';
import { INITIAL_SCHOLARSHIPS, DEMO_USERS_AND_PROFILES, ScholarshipSeed } from '../data/seedData';
import { evaluateEligibility, EligibilityResult } from './eligibilityEngine';
import { getDbStatus } from '../config/db';

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfileRecord {
  _id: string;
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
  familyIncomeAnnual?: number;
  incomeRange?: string;
  reservationCategory?: string; // 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  studyInterests: string[];
  preferredCategories: string[];
  documentsReady: string[];
  digiLockerVerifiedDocs: string[];
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipRecord extends ScholarshipSeed {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationRecord {
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
  checklistProgress: Array<{
    documentName: string;
    isReady: boolean;
    isDigiLockerVerified?: boolean;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SavedScholarshipRecord {
  _id: string;
  studentId: string;
  scholarshipId: string;
  createdAt: string;
}

class ScholarSphereDataStore {
  private users: Map<string, UserRecord> = new Map();
  private profiles: Map<string, StudentProfileRecord> = new Map();
  private scholarships: Map<string, ScholarshipRecord> = new Map();
  private applications: Map<string, ApplicationRecord> = new Map();
  private saved: Map<string, SavedScholarshipRecord> = new Map();
  private isInitialized = false;

  constructor() {
    this.seedInitialData();
  }

  public seedInitialData() {
    this.users.clear();
    this.profiles.clear();
    this.scholarships.clear();
    this.applications.clear();
    this.saved.clear();

    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('demo1234', salt);

    // Seed Demo Users and Profiles
    for (const item of DEMO_USERS_AND_PROFILES) {
      const userRecord: UserRecord = {
        _id: item.user._id,
        name: item.user.name,
        email: item.user.email.toLowerCase(),
        passwordHash: demoPasswordHash,
        role: item.user.role as 'student' | 'admin',
        createdAt: new Date('2026-09-01T00:00:00Z').toISOString(),
        updatedAt: new Date('2026-10-01T00:00:00Z').toISOString()
      };
      this.users.set(userRecord._id, userRecord);

      const profileRecord: StudentProfileRecord = {
        _id: `prof_${item.user._id}`,
        userId: item.user._id,
        educationLevel: item.profile.educationLevel || 'undergraduate',
        course: item.profile.course || 'B.Tech Computer Science & Engineering',
        specialization: item.profile.specialization || '',
        yearOfStudy: item.profile.yearOfStudy || '1st Year',
        institution: item.profile.institution || '',
        cgpa: item.profile.cgpa,
        scorePercent: item.profile.scorePercent,
        academicAchievements: item.profile.academicAchievements || '',
        stateOrRegion: item.profile.stateOrRegion || 'Telangana',
        country: item.profile.country || 'India',
        familyIncomeAnnual: item.profile.familyIncomeAnnual,
        incomeRange: item.profile.incomeRange || '',
        reservationCategory: item.profile.reservationCategory || 'General',
        studyInterests: item.profile.studyInterests || [],
        preferredCategories: item.profile.preferredCategories || [],
        documentsReady: item.profile.documentsReady || [],
        digiLockerVerifiedDocs: item.profile.digiLockerVerifiedDocs || [],
        isOnboarded: item.profile.isOnboarded ?? true,
        createdAt: new Date('2026-09-01T00:00:00Z').toISOString(),
        updatedAt: new Date('2026-10-01T00:00:00Z').toISOString()
      };
      this.profiles.set(item.user._id, profileRecord);
    }

    // Seed Scholarships
    INITIAL_SCHOLARSHIPS.forEach((seed, index) => {
      const id = `sch_${String(index + 1).padStart(3, '0')}`;
      const record: ScholarshipRecord = {
        ...seed,
        _id: id,
        createdAt: new Date('2026-08-01T00:00:00Z').toISOString(),
        updatedAt: new Date('2026-10-05T00:00:00Z').toISOString()
      };
      this.scholarships.set(id, record);
    });

    // Seed Initial Saved and Tracker Records for Aarav Sharma (Strong Match student)
    const aaravId = 'user_aarav_btech';
    const sch1 = 'sch_001'; // Reliance Foundation UG
    const sch2 = 'sch_002'; // NSP Central Sector Scheme
    const sch3 = 'sch_004'; // TS ePASS Tuition Reimbursement

    // Saved scholarships
    this.saved.set(`${aaravId}_${sch1}`, {
      _id: `saved_${aaravId}_${sch1}`,
      studentId: aaravId,
      scholarshipId: sch1,
      createdAt: new Date('2026-10-02T10:00:00Z').toISOString()
    });
    this.saved.set(`${aaravId}_${sch2}`, {
      _id: `saved_${aaravId}_${sch2}`,
      studentId: aaravId,
      scholarshipId: sch2,
      createdAt: new Date('2026-10-03T14:30:00Z').toISOString()
    });

    // Tracker application for Reliance Foundation
    const sch1Record = this.scholarships.get(sch1);
    if (sch1Record) {
      this.applications.set(`${aaravId}_${sch1}`, {
        _id: `app_${aaravId}_${sch1}`,
        studentId: aaravId,
        scholarshipId: sch1,
        trackerStatus: 'preparing_documents',
        notes: 'Requested Bonafide from Osmania Academic Section. MeeSeva Income Certificate is ready & DigiLocker verified.',
        appliedDate: undefined,
        deadlineDate: sch1Record.applicationDeadline,
        checklistProgress: sch1Record.requiredDocuments.map((doc, i) => ({
          documentName: doc,
          isReady: i < 3,
          isDigiLockerVerified: sch1Record.digiLockerSupportedDocs.includes(doc),
          notes: i === 0 ? 'Verified via DigiLocker CBSE Marks Memo' : ''
        })),
        createdAt: new Date('2026-10-04T08:00:00Z').toISOString(),
        updatedAt: new Date('2026-10-08T12:00:00Z').toISOString()
      });
    }

    // Tracker application for TS ePASS
    const sch4Record = this.scholarships.get(sch3);
    if (sch4Record) {
      this.applications.set(`${aaravId}_${sch3}`, {
        _id: `app_${aaravId}_${sch3}`,
        studentId: aaravId,
        scholarshipId: sch3,
        trackerStatus: 'ready_to_apply',
        notes: 'Telangana ePASS online form filled; awaiting CET allotment acknowledgement.',
        appliedDate: undefined,
        deadlineDate: sch4Record.applicationDeadline,
        checklistProgress: sch4Record.requiredDocuments.map((doc, i) => ({
          documentName: doc,
          isReady: true,
          isDigiLockerVerified: sch4Record.digiLockerSupportedDocs.includes(doc),
          notes: 'MeeSeva application acknowledged'
        })),
        createdAt: new Date('2026-10-05T09:00:00Z').toISOString(),
        updatedAt: new Date('2026-10-08T16:00:00Z').toISOString()
      });
    }

    this.isInitialized = true;
    console.log(`✅ ScholarSphere Store: Seeded ${this.scholarships.size} Indian scholarships, ${this.users.size} demo personas, and active tracker entries.`);
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string): UserRecord | undefined {
    const normalized = email.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === normalized) return u;
    }
    return undefined;
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.users.get(id);
  }

  public createUser(name: string, email: string, password: string, role: 'student' | 'admin' = 'student'): UserRecord {
    const normalizedEmail = email.toLowerCase().trim();
    if (this.findUserByEmail(normalizedEmail)) {
      throw new Error('A user with this email address already exists.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const user: UserRecord = {
      _id: id,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(id, user);

    // Create initial student profile
    const profile: StudentProfileRecord = {
      _id: `prof_${id}`,
      userId: id,
      educationLevel: 'undergraduate',
      course: 'B.Tech Computer Science & Engineering',
      specialization: '',
      yearOfStudy: '1st Year',
      institution: '',
      stateOrRegion: 'Telangana',
      country: 'India',
      reservationCategory: 'General',
      studyInterests: [],
      preferredCategories: [],
      documentsReady: [],
      digiLockerVerifiedDocs: [],
      isOnboarded: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.profiles.set(id, profile);

    return user;
  }

  // --- Student Profile ---
  public getProfileByUserId(userId: string): StudentProfileRecord | undefined {
    return this.profiles.get(userId);
  }

  public updateProfile(userId: string, data: Partial<StudentProfileRecord>): StudentProfileRecord {
    let profile = this.profiles.get(userId);
    if (!profile) {
      profile = {
        _id: `prof_${userId}`,
        userId,
        educationLevel: 'undergraduate',
        course: 'B.Tech Computer Science & Engineering',
        yearOfStudy: '1st Year',
        institution: '',
        stateOrRegion: 'Telangana',
        country: 'India',
        reservationCategory: 'General',
        studyInterests: [],
        preferredCategories: [],
        documentsReady: [],
        digiLockerVerifiedDocs: [],
        isOnboarded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const updated: StudentProfileRecord = {
      ...profile,
      ...data,
      userId,
      updatedAt: new Date().toISOString()
    };

    if (updated.educationLevel && updated.course && updated.institution && updated.stateOrRegion) {
      updated.isOnboarded = true;
    }

    this.profiles.set(userId, updated);
    return updated;
  }

  // --- Scholarships ---
  public getScholarships(params: {
    query?: string;
    educationLevel?: string;
    course?: string;
    category?: string;
    reservationCategory?: string;
    verificationStatus?: string;
    lifecycleStatus?: string;
    maxIncome?: number;
    minFunding?: number;
    sortBy?: 'relevance' | 'deadline' | 'funding' | 'newest';
    page?: number;
    limit?: number;
    userId?: string;
  }) {
    let results = Array.from(this.scholarships.values());

    // Filter by lifecycleStatus
    if (params.lifecycleStatus) {
      results = results.filter(s => s.lifecycleStatus === params.lifecycleStatus);
    } else {
      results = results.filter(s => s.lifecycleStatus !== 'archived');
    }

    // Filter by verificationStatus
    if (params.verificationStatus && params.verificationStatus !== 'all') {
      results = results.filter(s => s.verificationStatus === params.verificationStatus);
    }

    // Filter by educationLevel
    if (params.educationLevel && params.educationLevel !== 'all') {
      const target = params.educationLevel.toLowerCase();
      results = results.filter(s =>
        s.educationLevels.some(l => l.toLowerCase() === target || l.toLowerCase() === 'any')
      );
    }

    // Filter by course
    if (params.course && params.course !== 'all') {
      const target = params.course.toLowerCase();
      results = results.filter(s =>
        s.eligibleCourses.some(c => c.toLowerCase().includes(target) || target.includes(c.toLowerCase()) || c.toLowerCase() === 'any')
      );
    }

    // Filter by Reservation Category (General, OBC, SC, ST, EWS)
    if (params.reservationCategory && params.reservationCategory !== 'all') {
      const targetCat = params.reservationCategory.toLowerCase();
      results = results.filter(s =>
        !s.eligibleCategories ||
        s.eligibleCategories.some(c => c.toLowerCase() === targetCat || c.toLowerCase() === 'all' || c.toLowerCase() === 'any')
      );
    }

    // Filter by category tag
    if (params.category && params.category !== 'all') {
      const target = params.category.toLowerCase();
      results = results.filter(s =>
        s.categoryTags.some(t => t.toLowerCase().includes(target))
      );
    }

    // Filter by minFunding (INR)
    if (params.minFunding && params.minFunding > 0) {
      results = results.filter(s => s.fundingAmount >= (params.minFunding || 0));
    }

    // Filter by maxIncome requirement (INR)
    if (params.maxIncome && params.maxIncome > 0) {
      results = results.filter(s => !s.maxAnnualIncome || s.maxAnnualIncome >= (params.maxIncome || 0));
    }

    // Keyword Search
    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.categoryTags.some(t => t.toLowerCase().includes(q)) ||
        s.eligibleCourses.some(c => c.toLowerCase().includes(q)) ||
        (s.sourceMetadata.portalSchemeCode && s.sourceMetadata.portalSchemeCode.toLowerCase().includes(q))
      );
    }

    // Sorting
    const sortBy = params.sortBy || 'relevance';
    if (sortBy === 'deadline') {
      results.sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime());
    } else if (sortBy === 'funding') {
      results.sort((a, b) => b.fundingAmount - a.fundingAmount);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      results.sort((a, b) => {
        if (a.verificationStatus === 'verified_official' && b.verificationStatus !== 'verified_official') return -1;
        if (b.verificationStatus === 'verified_official' && a.verificationStatus !== 'verified_official') return 1;
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
      });
    }

    // Evaluate eligibility for current user
    const studentProfile = params.userId ? this.getProfileByUserId(params.userId) : null;
    const userApplications = params.userId ? this.getApplicationsByStudent(params.userId) : [];

    const enrichedResults = results.map(scholarship => {
      const app = userApplications.find(a => a.scholarshipId === scholarship._id);
      const isSaved = params.userId ? this.isScholarshipSaved(params.userId, scholarship._id) : false;
      const eligibility = evaluateEligibility(scholarship, studentProfile, app?.trackerStatus);

      return {
        ...scholarship,
        isSaved,
        trackerStatus: app?.trackerStatus,
        eligibility
      };
    });

    const page = params.page || 1;
    const limit = params.limit || 12;
    const startIndex = (page - 1) * limit;
    const paginated = enrichedResults.slice(startIndex, startIndex + limit);

    return {
      scholarships: paginated,
      totalCount: enrichedResults.length,
      page,
      limit,
      totalPages: Math.ceil(enrichedResults.length / limit)
    };
  }

  public getScholarshipById(id: string, userId?: string) {
    const scholarship = this.scholarships.get(id);
    if (!scholarship) return null;

    const studentProfile = userId ? this.getProfileByUserId(userId) : null;
    const userApplications = userId ? this.getApplicationsByStudent(userId) : [];
    const app = userApplications.find(a => a.scholarshipId === scholarship._id);
    const isSaved = userId ? this.isScholarshipSaved(userId, scholarship._id) : false;

    const eligibility = evaluateEligibility(scholarship, studentProfile, app?.trackerStatus);

    return {
      ...scholarship,
      isSaved,
      trackerStatus: app?.trackerStatus,
      applicationRecord: app || null,
      eligibility
    };
  }

  public createScholarship(data: Omit<ScholarshipRecord, '_id' | 'createdAt' | 'updatedAt'>): ScholarshipRecord {
    const id = `sch_custom_${Date.now()}`;
    const record: ScholarshipRecord = {
      ...data,
      _id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.scholarships.set(id, record);
    return record;
  }

  public updateScholarship(id: string, data: Partial<ScholarshipRecord>): ScholarshipRecord | null {
    const existing = this.scholarships.get(id);
    if (!existing) return null;

    const updated: ScholarshipRecord = {
      ...existing,
      ...data,
      _id: id,
      updatedAt: new Date().toISOString()
    };
    this.scholarships.set(id, updated);
    return updated;
  }

  public deleteScholarship(id: string): boolean {
    return this.scholarships.delete(id);
  }

  // --- Saved Scholarships ---
  public getSavedScholarships(studentId: string) {
    const savedIds: string[] = [];
    for (const item of this.saved.values()) {
      if (item.studentId === studentId) {
        savedIds.push(item.scholarshipId);
      }
    }

    const studentProfile = this.getProfileByUserId(studentId);
    return savedIds
      .map(id => this.scholarships.get(id))
      .filter((s): s is ScholarshipRecord => Boolean(s))
      .map(s => {
        const eligibility = evaluateEligibility(s, studentProfile);
        return {
          ...s,
          isSaved: true,
          eligibility
        };
      });
  }

  public isScholarshipSaved(studentId: string, scholarshipId: string): boolean {
    return this.saved.has(`${studentId}_${scholarshipId}`);
  }

  public saveScholarship(studentId: string, scholarshipId: string) {
    const key = `${studentId}_${scholarshipId}`;
    if (this.saved.has(key)) return this.saved.get(key)!;

    const record: SavedScholarshipRecord = {
      _id: `saved_${studentId}_${scholarshipId}`,
      studentId,
      scholarshipId,
      createdAt: new Date().toISOString()
    };
    this.saved.set(key, record);
    return record;
  }

  public removeSavedScholarship(studentId: string, scholarshipId: string): boolean {
    const key = `${studentId}_${scholarshipId}`;
    return this.saved.delete(key);
  }

  // --- Application Tracker ---
  public getApplicationsByStudent(studentId: string): Array<ApplicationRecord & { scholarship: ScholarshipRecord | null }> {
    const apps: Array<ApplicationRecord & { scholarship: ScholarshipRecord | null }> = [];
    for (const app of this.applications.values()) {
      if (app.studentId === studentId) {
        const scholarship = this.scholarships.get(app.scholarshipId) || null;
        apps.push({
          ...app,
          scholarship
        });
      }
    }
    return apps.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public createOrUpdateApplication(
    studentId: string,
    scholarshipId: string,
    data: {
      trackerStatus?: ApplicationRecord['trackerStatus'];
      notes?: string;
      appliedDate?: string;
      checklistProgress?: ApplicationRecord['checklistProgress'];
    }
  ): ApplicationRecord {
    const key = `${studentId}_${scholarshipId}`;
    let app = this.applications.get(key);
    const scholarship = this.scholarships.get(scholarshipId);
    const profile = this.getProfileByUserId(studentId);

    if (!app) {
      const initialChecklist = (scholarship?.requiredDocuments || []).map(doc => {
        const isReady = (profile?.documentsReady || []).includes(doc);
        const isDigi = (scholarship?.digiLockerSupportedDocs || []).includes(doc) && (profile?.digiLockerVerifiedDocs || []).includes(doc);
        return {
          documentName: doc,
          isReady,
          isDigiLockerVerified: isDigi,
          notes: isDigi ? 'Verified via DigiLocker' : ''
        };
      });

      app = {
        _id: `app_${studentId}_${scholarshipId}`,
        studentId,
        scholarshipId,
        trackerStatus: data.trackerStatus || 'interested',
        notes: data.notes || '',
        appliedDate: data.appliedDate,
        deadlineDate: scholarship?.applicationDeadline,
        checklistProgress: data.checklistProgress || initialChecklist,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      app = {
        ...app,
        ...data,
        updatedAt: new Date().toISOString()
      };
    }

    this.applications.set(key, app);
    return app;
  }

  public updateChecklistItem(
    studentId: string,
    scholarshipId: string,
    documentName: string,
    isReady: boolean,
    notes?: string
  ): ApplicationRecord | null {
    const key = `${studentId}_${scholarshipId}`;
    const app = this.applications.get(key);
    if (!app) return null;

    let found = false;
    const updatedChecklist = app.checklistProgress.map(item => {
      if (item.documentName === documentName) {
        found = true;
        return { ...item, isReady, notes: notes !== undefined ? notes : item.notes };
      }
      return item;
    });

    if (!found) {
      updatedChecklist.push({ documentName, isReady, notes: notes || '' });
    }

    app.checklistProgress = updatedChecklist;
    app.updatedAt = new Date().toISOString();
    this.applications.set(key, app);
    return app;
  }

  public deleteApplication(studentId: string, scholarshipId: string): boolean {
    const key = `${studentId}_${scholarshipId}`;
    return this.applications.delete(key);
  }

  // --- Student Dashboard Metrics Aggregator ---
  public getDashboardMetrics(userId: string) {
    const profile = this.getProfileByUserId(userId);
    const allScholarships = Array.from(this.scholarships.values()).filter(s => s.lifecycleStatus === 'active');
    const userApps = this.getApplicationsByStudent(userId);
    const userSaved = this.getSavedScholarships(userId);

    let strongMatchesCount = 0;
    let needsInfoCount = 0;
    let matchingScholarshipsCount = 0;

    const evaluated = allScholarships.map(s => {
      const res = evaluateEligibility(s, profile);
      if (res.outcome === 'Strong Match') {
        strongMatchesCount++;
        matchingScholarshipsCount++;
      } else if (res.outcome === 'Needs Confirmation') {
        needsInfoCount++;
      }
      return { scholarship: s, eligibility: res };
    });

    const inProgressStatuses = ['interested', 'preparing_documents', 'ready_to_apply', 'applied', 'under_review'];
    const inProgressCount = userApps.filter(a => inProgressStatuses.includes(a.trackerStatus)).length;

    const now = new Date('2026-10-09T07:12:45.000Z').getTime();
    const upcomingDeadlines = allScholarships
      .map(s => {
        const diffDays = Math.ceil((new Date(s.applicationDeadline).getTime() - now) / (1000 * 60 * 60 * 24));
        return { scholarship: s, diffDays };
      })
      .filter(item => item.diffDays >= 0 && item.diffDays <= 21)
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 5)
      .map(item => ({
        ...item.scholarship,
        daysRemaining: item.diffDays
      }));

    const readyDocsCount = profile?.documentsReady?.length || 0;
    const digiLockerDocsCount = profile?.digiLockerVerifiedDocs?.length || 0;
    const essentialIndianDocs = [
      'Class 12th Marks Memo',
      'Income Certificate (Issued by Tehsildar / Revenue Authority)',
      'Bonafide / Enrollment Certificate from College',
      'Aadhaar Card (Identity Proof)',
      'MeeSeva Integrated Caste Certificate (Caste / EWS Proof)'
    ];
    const overallDocPercent = Math.min(100, Math.round((readyDocsCount / essentialIndianDocs.length) * 100));

    const recommended = evaluated
      .filter(item => item.eligibility.outcome === 'Strong Match')
      .slice(0, 4)
      .map(item => ({
        ...item.scholarship,
        eligibility: item.eligibility
      }));

    return {
      metrics: {
        totalMatching: matchingScholarshipsCount,
        strongMatches: strongMatchesCount,
        needsConfirmation: needsInfoCount,
        savedCount: userSaved.length,
        inProgressApplications: inProgressCount,
        upcomingDeadlinesCount: upcomingDeadlines.length,
        documentReadinessPercent: overallDocPercent,
        documentsReadyCount: readyDocsCount,
        digiLockerVerifiedCount: digiLockerDocsCount
      },
      upcomingDeadlines,
      recommendedScholarships: recommended,
      profileCompletion: {
        isOnboarded: profile?.isOnboarded || false,
        hasAcademicScores: Boolean(profile?.cgpa || profile?.scorePercent),
        hasIncomeData: Boolean(profile?.familyIncomeAnnual !== undefined && profile?.familyIncomeAnnual !== null),
        missingKeyFields: [
          !profile?.educationLevel ? 'Degree Level' : null,
          !profile?.course ? 'Course / Branch' : null,
          !profile?.cgpa && !profile?.scorePercent ? 'CGPA (10.0 scale)' : null,
          profile?.familyIncomeAnnual === undefined ? 'Annual Family Income (in Lakhs)' : null,
          !profile?.stateOrRegion ? 'State Domicile' : null
        ].filter(Boolean) as string[]
      }
    };
  }
}

export const dataStore = new ScholarSphereDataStore();
