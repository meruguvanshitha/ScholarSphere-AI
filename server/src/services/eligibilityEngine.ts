export interface StudentProfileData {
  educationLevel?: string;
  course?: string;
  specialization?: string;
  yearOfStudy?: string;
  institution?: string;
  cgpa?: number; // 10.0 scale
  scorePercent?: number;
  academicAchievements?: string;
  stateOrRegion?: string;
  country?: string;
  familyIncomeAnnual?: number;
  incomeRange?: string;
  reservationCategory?: string; // 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  studyInterests?: string[];
  preferredCategories?: string[];
  documentsReady?: string[];
  digiLockerVerifiedDocs?: string[];
  isOnboarded?: boolean;
}

export interface ScholarshipData {
  _id?: string;
  name: string;
  provider: string;
  description: string;
  fundingAmount: number;
  fundingFormatted: string;
  fundingType: string;
  educationLevels: string[];
  eligibleCourses: string[];
  minScorePercent?: number;
  minCgpa?: number;
  maxAnnualIncome?: number;
  eligibleCategories?: string[]; // Reservation categories
  eligibleRegions: string[];
  eligibleStudyYears: string[];
  requiredDocuments: string[];
  digiLockerSupportedDocs?: string[];
  applicationOpeningDate: string;
  applicationDeadline: string;
  officialUrl: string;
  verificationStatus: string;
  lifecycleStatus: string;
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
    eligibilityFitScore: number; // 0-100
    eligibilityFitLabel: string;
    documentReadinessScore: number; // 0-100
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
    applicationReadinessScore: number; // 0-100
    applicationReadinessLabel: string;
  };
}

// Current date anchor for realistic calculations (October 9, 2026 local time)
const REFERENCE_DATE = new Date('2026-10-09T07:12:45.000Z');

export function formatInrLakhs(amount: number): string {
  if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(amount % 100000 === 0 ? 1 : 2);
    return `₹${lakhs} Lakhs (${amount.toLocaleString('en-IN')})`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function evaluateEligibility(
  scholarship: ScholarshipData,
  profile?: StudentProfileData | null,
  trackerStatus?: string
): EligibilityResult {
  const satisfied: string[] = [];
  const notSatisfied: string[] = [];
  const missing: string[] = [];

  // If student is not logged in or has no profile at all
  if (!profile) {
    missing.push('Student academic and financial profile not provided. Please sign in to verify eligibility.');
    return {
      scholarshipId: scholarship._id || '',
      outcome: 'Needs Confirmation',
      statusColor: 'amber',
      requirementsSatisfied: [],
      requirementsNotSatisfied: [],
      missingInformation: missing,
      plainLanguageExplanation: 'Sign in with your student profile to evaluate your branch, 10.0-scale CGPA, state domicile, and annual family income against this scholarship scheme.',
      recommendedNextSteps: ['Sign in or create an account', 'Complete the 4-step onboarding profile'],
      readinessDimensions: calculateReadiness(scholarship, undefined, undefined, trackerStatus)
    };
  }

  // 1. Education Level Check
  if (scholarship.educationLevels && scholarship.educationLevels.length > 0) {
    if (!profile.educationLevel) {
      missing.push(`Current education level is not specified (scheme requires: ${scholarship.educationLevels.join(', ')}).`);
    } else {
      const studentLevel = profile.educationLevel.toLowerCase().trim();
      const isLevelMatch = scholarship.educationLevels.some(l => l.toLowerCase() === studentLevel || l.toLowerCase() === 'any');
      if (isLevelMatch) {
        satisfied.push(`Degree level matches: enrolled in ${profile.educationLevel} program.`);
      } else {
        notSatisfied.push(`Degree level mismatch: you are enrolled in ${profile.educationLevel}, while this scheme requires ${scholarship.educationLevels.join(' or ')}.`);
      }
    }
  }

  // 2. Course / Discipline Check
  if (scholarship.eligibleCourses && scholarship.eligibleCourses.length > 0) {
    const isAnyCourse = scholarship.eligibleCourses.some(c => c.toLowerCase() === 'any');
    if (!isAnyCourse) {
      if (!profile.course) {
        missing.push(`Course / Branch of study is missing (open to: ${scholarship.eligibleCourses.join(', ')}).`);
      } else {
        const studentCourse = profile.course.toLowerCase();
        const studentSpecialization = (profile.specialization || '').toLowerCase();
        const isCourseMatch = scholarship.eligibleCourses.some(c => {
          const reqCourse = c.toLowerCase();
          return studentCourse.includes(reqCourse) || reqCourse.includes(studentCourse) ||
                 (studentSpecialization && studentSpecialization.includes(reqCourse)) ||
                 (reqCourse.includes('engineering') && studentCourse.includes('b.tech')) ||
                 (reqCourse.includes('b.tech') && studentCourse.includes('engineering'));
        });

        if (isCourseMatch) {
          satisfied.push(`Branch of study matches: ${profile.course}${profile.specialization ? ` (${profile.specialization})` : ''} is an eligible discipline.`);
        } else {
          notSatisfied.push(`Stream mismatch: enrolled in ${profile.course}, whereas this scheme is designated for ${scholarship.eligibleCourses.join(', ')}.`);
        }
      }
    } else {
      satisfied.push('Discipline requirement: Open to students of all degree branches.');
    }
  }

  // 3. Academic Score / Percentage / CGPA Check (10.0 scale)
  let scoreChecked = false;
  if (scholarship.minCgpa !== undefined && scholarship.minCgpa > 0) {
    scoreChecked = true;
    if (profile.cgpa === undefined || profile.cgpa === null) {
      missing.push(`CGPA on 10.0 scale is not recorded in your profile (minimum cutoff is ${scholarship.minCgpa.toFixed(1)} / 10.0).`);
    } else if (profile.cgpa >= scholarship.minCgpa) {
      satisfied.push(`Academic CGPA satisfied: your CGPA of ${profile.cgpa.toFixed(2)}/10.0 meets the minimum cutoff of ${scholarship.minCgpa.toFixed(1)}/10.0.`);
    } else {
      notSatisfied.push(`CGPA below minimum cutoff: your current CGPA is ${profile.cgpa.toFixed(2)}/10.0, below the required ${scholarship.minCgpa.toFixed(1)}/10.0.`);
    }
  }

  if (scholarship.minScorePercent !== undefined && scholarship.minScorePercent > 0 && !scoreChecked) {
    if (profile.scorePercent === undefined || profile.scorePercent === null) {
      missing.push(`Academic percentage is not specified (minimum cutoff is ${scholarship.minScorePercent}%).`);
    } else if (profile.scorePercent >= scholarship.minScorePercent) {
      satisfied.push(`Academic marks satisfied: your score (${profile.scorePercent}%) meets the minimum threshold of ${scholarship.minScorePercent}%.`);
    } else {
      notSatisfied.push(`Academic marks below threshold: your score is ${profile.scorePercent}%, below the required ${scholarship.minScorePercent}%.`);
    }
  }

  // 4. Financial Income Ceiling Check (INR / Lakhs)
  if (scholarship.maxAnnualIncome !== undefined && scholarship.maxAnnualIncome < 99999990) {
    if (profile.familyIncomeAnnual === undefined || profile.familyIncomeAnnual === null) {
      missing.push(`Family annual income is unstated (scheme has an income ceiling of ${formatInrLakhs(scholarship.maxAnnualIncome)}/year).`);
    } else if (profile.familyIncomeAnnual <= scholarship.maxAnnualIncome) {
      satisfied.push(`Need-based criteria satisfied: annual family income (${formatInrLakhs(profile.familyIncomeAnnual)}) is within the ceiling of ${formatInrLakhs(scholarship.maxAnnualIncome)}.`);
    } else {
      notSatisfied.push(`Income exceeds ceiling: family annual income (${formatInrLakhs(profile.familyIncomeAnnual)}) exceeds the scheme limit of ${formatInrLakhs(scholarship.maxAnnualIncome)}.`);
    }
  } else if (scholarship.maxAnnualIncome !== undefined && scholarship.maxAnnualIncome >= 99999990) {
    satisfied.push('Financial criteria: Pure merit-based award with no family income cap.');
  }

  // 5. Reservation / Category Check (General, OBC, SC, ST, EWS)
  if (scholarship.eligibleCategories && scholarship.eligibleCategories.length > 0) {
    const isAllCategories = scholarship.eligibleCategories.some(c => c.toLowerCase() === 'all' || c.toLowerCase() === 'any');
    if (!isAllCategories) {
      if (!profile.reservationCategory) {
        missing.push(`Social / Reservation category not specified (scheme is reserved for: ${scholarship.eligibleCategories.join(', ')}).`);
      } else {
        const studentCategory = profile.reservationCategory.toLowerCase();
        const isCategoryMatch = scholarship.eligibleCategories.some(c => c.toLowerCase() === studentCategory);
        if (isCategoryMatch) {
          satisfied.push(`Reservation category verified: registered under ${profile.reservationCategory} category.`);
        } else {
          notSatisfied.push(`Category restriction: scheme is open to ${scholarship.eligibleCategories.join(', ')}, while your profile indicates ${profile.reservationCategory}.`);
        }
      }
    } else {
      satisfied.push('Category eligibility: Open to all categories (General, OBC, SC, ST, EWS).');
    }
  }

  // 6. Geographic / State Domicile Check
  if (scholarship.eligibleRegions && scholarship.eligibleRegions.length > 0) {
    const isAllRegions = scholarship.eligibleRegions.some(r => r.toLowerCase() === 'all' || r.toLowerCase() === 'all india');
    if (!isAllRegions) {
      if (!profile.stateOrRegion) {
        missing.push(`State of domicile is missing (scheme requires domicile in: ${scholarship.eligibleRegions.join(', ')}).`);
      } else {
        const studentRegion = profile.stateOrRegion.toLowerCase();
        const isRegionMatch = scholarship.eligibleRegions.some(r => r.toLowerCase() === studentRegion || studentRegion.includes(r.toLowerCase()));
        if (isRegionMatch) {
          satisfied.push(`State domicile verified: resident of ${profile.stateOrRegion}.`);
        } else {
          notSatisfied.push(`State domicile restriction: designated exclusively for residents of ${scholarship.eligibleRegions.join(', ')}, while your profile indicates ${profile.stateOrRegion}.`);
        }
      }
    } else {
      satisfied.push('Geographic eligibility: Pan-India open scheme (All States & UTs).');
    }
  }

  // 7. Year of Study Check
  if (scholarship.eligibleStudyYears && scholarship.eligibleStudyYears.length > 0) {
    const isAnyYear = scholarship.eligibleStudyYears.some(y => y.toLowerCase() === 'any');
    if (!isAnyYear) {
      if (!profile.yearOfStudy) {
        missing.push(`Year of study is missing (scheme is open to: ${scholarship.eligibleStudyYears.join(', ')}).`);
      } else {
        const studentYear = profile.yearOfStudy.toLowerCase();
        const isYearMatch = scholarship.eligibleStudyYears.some(y => y.toLowerCase() === studentYear);
        if (isYearMatch) {
          satisfied.push(`Study year requirement satisfied: enrolled in ${profile.yearOfStudy}.`);
        } else {
          notSatisfied.push(`Study year mismatch: open for ${scholarship.eligibleStudyYears.join(', ')}, while you are in ${profile.yearOfStudy}.`);
        }
      }
    } else {
      satisfied.push('Study year: Open to students in any year of college.');
    }
  }

  // Deterministic 3-State Outcome
  let outcome: 'Strong Match' | 'Needs Confirmation' | 'Does Not Match';
  let statusColor: 'emerald' | 'amber' | 'rose';
  let plainLanguageExplanation = '';
  const recommendedNextSteps: string[] = [];

  if (notSatisfied.length > 0) {
    outcome = 'Does Not Match';
    statusColor = 'rose';
    plainLanguageExplanation = `You do not satisfy ${notSatisfied.length} mandatory requirement${notSatisfied.length > 1 ? 's' : ''} for this scheme (${notSatisfied[0]}).`;
    recommendedNextSteps.push('Review alternative schemes in your dashboard that match your branch and scores');
    recommendedNextSteps.push('Check other scholarships from this provider with different income or stream criteria');
  } else if (missing.length > 0) {
    outcome = 'Needs Confirmation';
    statusColor = 'amber';
    plainLanguageExplanation = `You satisfy ${satisfied.length} known criteria, but ${missing.length} required field${missing.length > 1 ? 's' : ''} need confirmation before eligibility can be certified.`;
    recommendedNextSteps.push(`Update your profile with missing details: ${missing.map(m => m.split(' ')[0]).join(', ')}`);
    recommendedNextSteps.push('Ensure your Income Certificate is verified from MeeSeva / Tehsildar office');
  } else {
    outcome = 'Strong Match';
    statusColor = 'emerald';
    plainLanguageExplanation = `Congratulations! You meet all ${satisfied.length} verified mandatory criteria for this scheme based on your branch, CGPA, income bracket, and state domicile.`;
    recommendedNextSteps.push('Review the required documents and sync with DigiLocker where available');
    recommendedNextSteps.push('Add to Application Tracker to monitor the closing deadline');
    recommendedNextSteps.push('Visit the official portal to begin your online submission');
  }

  const readinessDimensions = calculateReadiness(scholarship, profile, outcome, trackerStatus);

  return {
    scholarshipId: scholarship._id || '',
    outcome,
    statusColor,
    requirementsSatisfied: satisfied,
    requirementsNotSatisfied: notSatisfied,
    missingInformation: missing,
    plainLanguageExplanation,
    recommendedNextSteps,
    readinessDimensions
  };
}

function calculateReadiness(
  scholarship: ScholarshipData,
  profile?: StudentProfileData | null,
  outcome?: 'Strong Match' | 'Needs Confirmation' | 'Does Not Match',
  trackerStatus?: string
) {
  // Dimension 1: Eligibility Fit
  let eligibilityFitScore = 20;
  let eligibilityFitLabel = 'Criteria Mismatch';
  if (outcome === 'Strong Match') {
    eligibilityFitScore = 100;
    eligibilityFitLabel = 'Strong Fit (All Rules Satisfied)';
  } else if (outcome === 'Needs Confirmation') {
    eligibilityFitScore = 60;
    eligibilityFitLabel = 'Needs Confirmation (Details Missing)';
  } else if (!outcome) {
    eligibilityFitScore = 40;
    eligibilityFitLabel = 'Profile Required';
  }

  // Dimension 2: Document Readiness
  const requiredDocs = scholarship.requiredDocuments || [];
  const readyDocs = profile?.documentsReady || [];
  const digiLockerDocs = profile?.digiLockerVerifiedDocs || [];
  const supportedDigiLocker = scholarship.digiLockerSupportedDocs || [];

  const readyList = requiredDocs.filter(doc => readyDocs.includes(doc));
  const missingList = requiredDocs.filter(doc => !readyDocs.includes(doc));
  const totalCount = requiredDocs.length;
  const readyCount = readyList.length;
  const docScore = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 100;

  let documentReadinessLabel = `${readyCount} of ${totalCount} ready (${docScore}%)`;
  if (totalCount === 0) documentReadinessLabel = 'No documents specified';

  const digiLockerReadyCount = requiredDocs.filter(doc => supportedDigiLocker.includes(doc) && digiLockerDocs.includes(doc)).length;

  // Dimension 3: Deadline Urgency
  const now = REFERENCE_DATE.getTime();
  const deadlineTime = new Date(scholarship.applicationDeadline).getTime();
  const openTime = scholarship.applicationOpeningDate ? new Date(scholarship.applicationOpeningDate).getTime() : now;
  const diffDays = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24));

  let deadlineUrgencyStatus: 'expired' | 'closing_soon' | 'approaching' | 'open' | 'future_opening' = 'open';
  if (openTime > now) {
    deadlineUrgencyStatus = 'future_opening';
  } else if (diffDays < 0 || scholarship.verificationStatus === 'expired') {
    deadlineUrgencyStatus = 'expired';
  } else if (diffDays <= 7) {
    deadlineUrgencyStatus = 'closing_soon';
  } else if (diffDays <= 21) {
    deadlineUrgencyStatus = 'approaching';
  } else {
    deadlineUrgencyStatus = 'open';
  }

  const deadlineFormatted = new Date(scholarship.applicationDeadline).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Dimension 4: Application Readiness
  let applicationReadinessScore = 15;
  let applicationReadinessLabel = 'Not Started';
  if (trackerStatus === 'applied') {
    applicationReadinessScore = 90;
    applicationReadinessLabel = 'Application Submitted';
  } else if (trackerStatus === 'under_review') {
    applicationReadinessScore = 95;
    applicationReadinessLabel = 'Scrutiny / Under Review';
  } else if (trackerStatus === 'awarded') {
    applicationReadinessScore = 100;
    applicationReadinessLabel = 'Sanctioned / Disbursed (DBT)';
  } else if (trackerStatus === 'ready_to_apply') {
    applicationReadinessScore = 80;
    applicationReadinessLabel = 'Ready to Apply Online';
  } else if (trackerStatus === 'preparing_documents') {
    applicationReadinessScore = 50;
    applicationReadinessLabel = 'Gathering Certificates';
  } else if (trackerStatus === 'interested') {
    applicationReadinessScore = 30;
    applicationReadinessLabel = 'Bookmarked in Tracker';
  }

  return {
    eligibilityFitScore,
    eligibilityFitLabel,
    documentReadinessScore: docScore,
    documentReadinessLabel,
    documentsReadyCount: readyCount,
    documentsTotalCount: totalCount,
    readyDocumentsList: readyList,
    missingDocumentsList: missingList,
    digiLockerVerifiedCount: digiLockerDocs.length,
    digiLockerReadyCount,
    deadlineUrgencyStatus,
    daysRemaining: diffDays,
    deadlineFormatted,
    applicationReadinessScore,
    applicationReadinessLabel
  };
}
