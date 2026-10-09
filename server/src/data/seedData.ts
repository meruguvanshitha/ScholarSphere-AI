export interface ScholarshipSeed {
  _id?: string;
  name: string;
  provider: string;
  description: string;
  fundingAmount: number;
  fundingFormatted: string;
  fundingType: 'full_tuition' | 'partial' | 'stipend' | 'grant' | 'merit_award';
  educationLevels: string[]; // 'undergraduate' | 'postgraduate' | 'diploma' | 'doctoral'
  eligibleCourses: string[]; // e.g. ['B.Tech Computer Science', 'Engineering', 'Medicine', 'Any']
  minScorePercent?: number; // e.g. 75%
  minCgpa?: number; // e.g. 7.5 on 10.0 scale
  maxAnnualIncome?: number; // e.g. 350000 (₹3.5 Lakhs)
  eligibleCategories: string[]; // ['General', 'OBC', 'SC', 'ST', 'EWS', 'All']
  eligibleRegions: string[]; // e.g. ['All India', 'Telangana', 'Maharashtra', 'Karnataka', 'Andhra Pradesh']
  eligibleStudyYears: string[]; // e.g. ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Any']
  requiredDocuments: string[];
  digiLockerSupportedDocs: string[]; // documents that can be fetched via DigiLocker API
  applicationOpeningDate: string;
  applicationDeadline: string; // ISO date string
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
}

export const INITIAL_SCHOLARSHIPS: ScholarshipSeed[] = [
  {
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation',
    description: 'Flagship pan-India scholarship supporting meritorious undergraduate students in degree programs across India. Provides financial grant up to ₹2,00,000 over the degree duration, plus leadership workshops, mentorship webinars, and an alumni network.',
    fundingAmount: 200000,
    fundingFormatted: '₹2,00,000 Total Grant',
    fundingType: 'merit_award',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['B.Tech Computer Science', 'B.Tech IT', 'B.Tech ECE', 'B.Tech Mechanical', 'B.Sc Data Science', 'Any'],
    minScorePercent: 60,
    minCgpa: 7.5,
    maxAnnualIncome: 1500000, // ₹15 Lakhs ceiling (priority to under ₹2.5 Lakhs)
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['1st Year', '2nd Year', '3rd Year'],
    requiredDocuments: [
      'Class 12th Marks Memo',
      'Bonafide / Enrollment Certificate from College',
      'Family Income Certificate (Tehsildar / Competent Authority)',
      'Aadhaar Card (Identity Proof)',
      'Passport Size Photograph'
    ],
    digiLockerSupportedDocs: [
      'Class 12th Marks Memo',
      'Aadhaar Card (Identity Proof)',
      'Family Income Certificate (Tehsildar / Competent Authority)'
    ],
    applicationOpeningDate: '2026-08-15T00:00:00.000Z',
    applicationDeadline: '2026-11-20T23:59:59.000Z',
    officialUrl: 'https://scholarships.reliancefoundation.org',
    sourceMetadata: {
      sourceName: 'Reliance Foundation Official Portal',
      sourceType: 'foundation',
      lastCheckedDate: '2026-10-04',
      verifiedBy: 'ScholarSphere National Verification Desk',
      portalSchemeCode: 'RF-UG-2026'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Merit-cum-Means', 'Undergraduate', 'Pan-India', 'B.Tech / Science']
  },
  {
    name: 'National Scholarship Portal (NSP) Post-Matric & Central Sector Scheme',
    provider: 'Department of Higher Education, Ministry of Education (Govt. of India)',
    description: 'Central sector scheme for meritorious college and university students who scored above the 80th percentile in the relevant stream in Class 12 Board exams. Disburses ₹12,000 per annum for graduation and ₹20,000 per annum for post-graduation directly via DBT.',
    fundingAmount: 60000,
    fundingFormatted: '₹20,000 / year (Direct DBT)',
    fundingType: 'grant',
    educationLevels: ['undergraduate', 'postgraduate'],
    eligibleCourses: ['Any', 'B.Tech Computer Science', 'B.Sc', 'B.Com', 'B.A', 'Engineering'],
    minScorePercent: 80,
    minCgpa: 8.0,
    maxAnnualIncome: 450000, // ₹4.5 Lakhs ceiling
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['1st Year', '2nd Year', '3rd Year', 'Final Year'],
    requiredDocuments: [
      'Class 12th Marks Memo',
      'Income Certificate (Issued by Tehsildar / Revenue Authority)',
      'Bonafide Student Certificate',
      'Bank Account Passbook (Aadhaar Seeded)',
      'Aadhaar Card'
    ],
    digiLockerSupportedDocs: [
      'Class 12th Marks Memo',
      'Income Certificate (Issued by Tehsildar / Revenue Authority)',
      'Aadhaar Card'
    ],
    applicationOpeningDate: '2026-07-20T00:00:00.000Z',
    applicationDeadline: '2026-10-15T23:59:59.000Z', // Closing soon! (~6 days)
    officialUrl: 'https://scholarships.gov.in',
    sourceMetadata: {
      sourceName: 'National Scholarship Portal (scholarships.gov.in)',
      sourceType: 'government',
      lastCheckedDate: '2026-10-06',
      verifiedBy: 'NSP Liaison Desk',
      portalSchemeCode: 'NSP-CSSS-2026'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Central Govt', 'DBT Transfer', 'Closing Soon', 'Merit-cum-Means']
  },
  {
    name: 'Tata Capital Pankh Scholarship Scheme for Professional Degrees',
    provider: 'Tata Capital Limited',
    description: 'CSR initiative by Tata Capital aimed at assisting financially challenged students pursuing professional courses (B.Tech, B.E., B.Sc, B.Com, Professional Diplomas). Offers tuition fee coverage up to 80% or up to ₹50,000.',
    fundingAmount: 50000,
    fundingFormatted: '₹50,000 Tuition Fee Grant',
    fundingType: 'partial',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['Engineering', 'B.Tech Computer Science', 'Medical', 'Commerce', 'Professional Degree'],
    minScorePercent: 60,
    minCgpa: 6.5,
    maxAnnualIncome: 250000, // ₹2.5 Lakhs ceiling
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['1st Year', '2nd Year', '3rd Year'],
    requiredDocuments: [
      'Previous Academic Marksheets (Class 12 or Semester)',
      'Income Proof (Salary Slip / Form 16 / Tehsildar Certificate)',
      'College Admission / Fee Receipt',
      'Government Identity Proof (Aadhaar / Voter ID)',
      'Bank Account Details'
    ],
    digiLockerSupportedDocs: [
      'Previous Academic Marksheets (Class 12 or Semester)',
      'Government Identity Proof (Aadhaar / Voter ID)'
    ],
    applicationOpeningDate: '2026-08-01T00:00:00.000Z',
    applicationDeadline: '2026-10-13T23:59:59.000Z', // Urgent! (~4 days)
    officialUrl: 'https://www.tatacapital.com/csr/pankh-scholarship.html',
    sourceMetadata: {
      sourceName: 'Tata Capital CSR Trust Registry',
      sourceType: 'corporate',
      lastCheckedDate: '2026-10-05',
      verifiedBy: 'ScholarSphere Corporate Verification'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Tata CSR', 'Need-Based', 'Urgent Deadline', 'Engineering & UG']
  },
  {
    name: 'TS ePASS Post-Matric Tuition Fee Reimbursement (RTF & MTF)',
    provider: 'Department of Higher Education & Welfare Departments, Govt. of Telangana',
    description: 'State government fee reimbursement and maintenance stipend for domicile students enrolled in accredited professional colleges (JNTU, OU, Kakatiya, etc.). Reimburses up to full convener quota tuition fees.',
    fundingAmount: 85000,
    fundingFormatted: '₹85,000 / year (Full Tuition RTF)',
    fundingType: 'full_tuition',
    educationLevels: ['undergraduate', 'postgraduate'],
    eligibleCourses: ['B.Tech Computer Science', 'Engineering', 'MCA', 'MBA', 'Pharmacy', 'Any'],
    minScorePercent: 50,
    minCgpa: 5.5,
    maxAnnualIncome: 200000, // ₹2.0 Lakhs (₹2.5L for SC/ST)
    eligibleCategories: ['SC', 'ST', 'OBC', 'EWS'],
    eligibleRegions: ['Telangana'],
    eligibleStudyYears: ['1st Year', '2nd Year', '3rd Year', 'Final Year'],
    requiredDocuments: [
      'MeeSeva Telangana Income Certificate (Issued in Current Financial Year)',
      'MeeSeva Integrated Caste Certificate (Caste / EWS Proof)',
      'SSC (10th) & Intermediate (12th) Memo',
      'College Bonafide & Allotment Order',
      'Aadhaar Card'
    ],
    digiLockerSupportedDocs: [
      'SSC (10th) & Intermediate (12th) Memo',
      'Aadhaar Card',
      'MeeSeva Telangana Income Certificate (Issued in Current Financial Year)'
    ],
    applicationOpeningDate: '2026-07-01T00:00:00.000Z',
    applicationDeadline: '2026-11-30T23:59:59.000Z',
    officialUrl: 'https://telanganaepass.cgg.gov.in',
    sourceMetadata: {
      sourceName: 'Telangana ePASS Portal (telanganaepass.cgg.gov.in)',
      sourceType: 'government',
      lastCheckedDate: '2026-09-28',
      verifiedBy: 'Telangana State Domicile Auditor'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Telangana State', 'Fee Reimbursement', 'SC/ST/OBC/EWS', 'RTF & MTF']
  },
  {
    name: 'Aditya Birla Capital Scholarship for Professional Courses',
    provider: 'Aditya Birla Capital Foundation',
    description: 'One-time scholarship grant designed to assist meritorious students from economically distressed backgrounds pursuing high-potential professional graduation courses in Indian colleges.',
    fundingAmount: 60000,
    fundingFormatted: '₹60,000 One-time Grant',
    fundingType: 'grant',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['B.Tech Computer Science', 'Engineering', 'MBBS', 'B.Arch', 'Professional Degree'],
    minScorePercent: 60,
    minCgpa: 6.5,
    maxAnnualIncome: 600000, // ₹6.0 Lakhs ceiling
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['1st Year', '2nd Year'],
    requiredDocuments: [
      'Class 12th Board Marksheet',
      'Income Certificate (Issued by competent government authority)',
      'College Identity Card or Bonafide Letter',
      'Bank Account Passbook / Cancelled Cheque',
      'Aadhaar Proof'
    ],
    digiLockerSupportedDocs: [
      'Class 12th Board Marksheet',
      'Aadhaar Proof'
    ],
    applicationOpeningDate: '2026-08-10T00:00:00.000Z',
    applicationDeadline: '2026-10-28T23:59:59.000Z',
    officialUrl: 'https://www.adityabirlacapital.com/csr',
    sourceMetadata: {
      sourceName: 'Aditya Birla Group CSR Portal',
      sourceType: 'corporate',
      lastCheckedDate: '2026-10-01',
      verifiedBy: 'ScholarSphere Corporate Verification'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Aditya Birla', 'Engineering & UG', 'Merit-cum-Means']
  },
  {
    name: 'Kotak Kanya Scholarship for Meritorious Girl Students',
    provider: 'Kotak Education Foundation',
    description: 'Premier scholarship for ambitious girls pursuing first-year professional degrees in Engineering, MBBS, Architecture, Design, or Integrated LLB from recognized institutes across India.',
    fundingAmount: 150000,
    fundingFormatted: '₹1,50,000 / year + Laptop Stipend',
    fundingType: 'merit_award',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['B.Tech Computer Science', 'Engineering', 'MBBS', 'Architecture', 'Integrated Law'],
    minScorePercent: 85,
    minCgpa: 8.5,
    maxAnnualIncome: 600000, // ₹6.0 Lakhs ceiling
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['1st Year', '2nd Year'],
    requiredDocuments: [
      'Class 12th Marksheet (Minimum 85% required)',
      'College Admission Fee Receipt & Entrance Rank Card',
      'Income Certificate from Tehsildar / SDM',
      'Aadhaar Card of Applicant and Parent',
      'Statement of Purpose (Vision Essay)'
    ],
    digiLockerSupportedDocs: [
      'Class 12th Marksheet (Minimum 85% required)',
      'Aadhaar Card of Applicant and Parent',
      'Income Certificate from Tehsildar / SDM'
    ],
    applicationOpeningDate: '2026-08-01T00:00:00.000Z',
    applicationDeadline: '2026-11-10T23:59:59.000Z',
    officialUrl: 'https://kotak.education/kanya-scholarship',
    sourceMetadata: {
      sourceName: 'Kotak Education Foundation Registry',
      sourceType: 'foundation',
      lastCheckedDate: '2026-09-24',
      verifiedBy: 'ScholarSphere Women in STEM Desk'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Women in Tech', 'Girls Scholarship', 'Professional Degrees', 'High Merit']
  },
  {
    name: 'HDFC Bank Parivartan’s ECSS Programme for Higher Education',
    provider: 'HDFC Bank Parivartan CSR',
    description: 'Educational crisis and merit scholarship program providing financial support to undergraduate and postgraduate students facing financial distress or bereavement to avoid dropping out of college.',
    fundingAmount: 75000,
    fundingFormatted: '₹75,000 Annual Grant',
    fundingType: 'grant',
    educationLevels: ['undergraduate', 'postgraduate'],
    eligibleCourses: ['Any', 'Engineering', 'Computer Science', 'Commerce', 'Management'],
    minScorePercent: 55,
    minCgpa: 6.0,
    maxAnnualIncome: 250000, // ₹2.5 Lakhs
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['Any'],
    requiredDocuments: [
      'Previous Year Marksheet',
      'Identity Proof (Aadhaar / Voter ID)',
      'Family Income Proof / Tehsildar Certificate',
      'College Fee Receipt & Admission Proof',
      'Bank Account Passbook Copy'
    ],
    digiLockerSupportedDocs: [
      'Identity Proof (Aadhaar / Voter ID)',
      'Previous Year Marksheet',
      'Family Income Proof / Tehsildar Certificate'
    ],
    applicationOpeningDate: '2026-07-15T00:00:00.000Z',
    applicationDeadline: '2026-10-18T23:59:59.000Z', // Approaching deadline
    officialUrl: 'https://www.hdfcbank.com/parivartan-scholarship',
    sourceMetadata: {
      sourceName: 'HDFC Parivartan Trust Portal',
      sourceType: 'corporate',
      lastCheckedDate: '2026-10-02',
      verifiedBy: 'ScholarSphere Banking Review'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['HDFC CSR', 'Crisis Support', 'Need-Based', 'All Streams']
  },
  {
    name: 'ONGC Scholarship Scheme for SC/ST/OBC Category Students',
    provider: 'ONGC Foundation',
    description: 'National affirmative action scholarship by Oil and Natural Gas Corporation supporting students from marginalized and socially disadvantaged categories enrolled in Engineering, MBBS, and Geophysics.',
    fundingAmount: 48000,
    fundingFormatted: '₹48,000 / year (₹4,000/mo)',
    fundingType: 'stipend',
    educationLevels: ['undergraduate', 'postgraduate'],
    eligibleCourses: ['B.Tech Computer Science', 'Engineering', 'Geology', 'Geophysics', 'MBBS'],
    minScorePercent: 60,
    minCgpa: 6.0,
    maxAnnualIncome: 200000, // ₹2.0 Lakhs ceiling
    eligibleCategories: ['SC', 'ST', 'OBC'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['1st Year', '2nd Year'],
    requiredDocuments: [
      'Caste Certificate issued by Tehsildar / Sub-Divisional Magistrate',
      'Income Certificate (Current Year)',
      '10th and 12th Marks Memo',
      'College Bonafide Certificate with Course Duration',
      'Bank Details & PAN/Aadhaar Copy'
    ],
    digiLockerSupportedDocs: [
      'Caste Certificate issued by Tehsildar / Sub-Divisional Magistrate',
      '10th and 12th Marks Memo',
      'Bank Details & PAN/Aadhaar Copy'
    ],
    applicationOpeningDate: '2026-08-01T00:00:00.000Z',
    applicationDeadline: '2026-11-15T23:59:59.000Z',
    officialUrl: 'https://ongcscholar.org',
    sourceMetadata: {
      sourceName: 'ONGC Foundation Central Portal',
      sourceType: 'government',
      lastCheckedDate: '2026-09-20',
      verifiedBy: 'ScholarSphere Affirmative Action Desk'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['PSU Government', 'SC/ST/OBC Priority', 'Engineering', 'Affirmative Action']
  },
  {
    name: 'AICTE Pragati Scholarship Scheme for Technical Degrees',
    provider: 'All India Council for Technical Education (AICTE)',
    description: 'Government empowerment scheme providing ₹50,000 per annum towards college fee, computer equipment, and books to girl students admitted to AICTE approved technical degree courses.',
    fundingAmount: 50000,
    fundingFormatted: '₹50,000 / year (Lump Sum)',
    fundingType: 'grant',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['B.Tech Computer Science', 'Engineering', 'Architecture', 'AICTE Approved Degrees'],
    minScorePercent: 60,
    minCgpa: 6.5,
    maxAnnualIncome: 800000, // ₹8.0 Lakhs ceiling
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['1st Year', '2nd Year'],
    requiredDocuments: [
      'Class 10th & 12th Marksheet',
      'AICTE College Admission Letter & Tuition Fee Receipt',
      'Family Income Certificate (below ₹8 Lakhs from Tehsildar)',
      'Aadhaar Seeded Bank Account Details',
      'Parental Declaration Form'
    ],
    digiLockerSupportedDocs: [
      'Class 10th & 12th Marksheet',
      'Family Income Certificate (below ₹8 Lakhs from Tehsildar)'
    ],
    applicationOpeningDate: '2026-09-01T00:00:00.000Z',
    applicationDeadline: '2026-12-10T23:59:59.000Z',
    officialUrl: 'https://www.aicte-pragati-saksham-gov.in',
    sourceMetadata: {
      sourceName: 'AICTE National Scholarship Portal',
      sourceType: 'government',
      lastCheckedDate: '2026-09-30',
      verifiedBy: 'AICTE Liaison Office'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['AICTE Govt', 'Girls in Engineering', 'Direct Transfer', 'Tuition Support']
  },
  {
    name: 'MahaDBT Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Grant',
    provider: 'Higher & Technical Education Department, Govt. of Maharashtra',
    description: 'Post-matric state fee concession scheme reimbursing 50% of tuition fees and exam fees for economically backward class (EBC/SEBC/OBC) students enrolled in recognized Maharashtra engineering and medical colleges.',
    fundingAmount: 65000,
    fundingFormatted: '₹65,000 (50% Fee Reimbursement)',
    fundingType: 'partial',
    educationLevels: ['undergraduate', 'postgraduate'],
    eligibleCourses: ['Engineering', 'B.Tech Computer Science', 'Medicine', 'Pharmacy', 'Architecture'],
    minScorePercent: 50,
    minCgpa: 5.5,
    maxAnnualIncome: 800000, // ₹8.0 Lakhs ceiling
    eligibleCategories: ['General', 'EWS', 'OBC'],
    eligibleRegions: ['Maharashtra'],
    eligibleStudyYears: ['Any'],
    requiredDocuments: [
      'Maharashtra Domicile Certificate (Issued by Tehsildar / Collector)',
      'Income Certificate (Issued by Tehsildar, below ₹8 Lakhs)',
      'CAP Allotment Letter for Professional Degree',
      'Previous Year Marksheet',
      'Aadhaar Linked Bank Passbook'
    ],
    digiLockerSupportedDocs: [
      'Maharashtra Domicile Certificate (Issued by Tehsildar / Collector)',
      'Income Certificate (Issued by Tehsildar, below ₹8 Lakhs)',
      'Previous Year Marksheet'
    ],
    applicationOpeningDate: '2026-08-01T00:00:00.000Z',
    applicationDeadline: '2026-11-25T23:59:59.000Z',
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    sourceMetadata: {
      sourceName: 'MahaDBT State Portal (mahadbt.maharashtra.gov.in)',
      sourceType: 'government',
      lastCheckedDate: '2026-09-18',
      verifiedBy: 'Maharashtra State Verification Officer'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Maharashtra State', 'MahaDBT', 'EBC/EWS Concession', 'Engineering']
  },
  {
    name: 'Santoor Women’s Scholarship for Higher Education',
    provider: 'Wipro Consumer Care & Azim Premji Foundation',
    description: 'Support program for young women from underprivileged backgrounds who completed 10th and 12th in government schools in Andhra Pradesh, Telangana, or Karnataka and wish to pursue higher education.',
    fundingAmount: 24000,
    fundingFormatted: '₹24,000 / year (Until Completion)',
    fundingType: 'grant',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['B.Tech Computer Science', 'B.Sc', 'B.A', 'B.Com', 'Diploma', 'Any'],
    minScorePercent: 60,
    minCgpa: 6.0,
    maxAnnualIncome: 300000, // ₹3.0 Lakhs
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['Telangana', 'Andhra Pradesh', 'Karnataka'],
    eligibleStudyYears: ['1st Year', '2nd Year', '3rd Year'],
    requiredDocuments: [
      'Government School 10th & 12th Study Certificates',
      'College Bonafide Certificate',
      'Family Income Proof',
      'Aadhaar Card copy',
      'Bank Account Passbook'
    ],
    digiLockerSupportedDocs: [
      'Aadhaar Card copy',
      'Government School 10th & 12th Study Certificates'
    ],
    applicationOpeningDate: '2026-07-01T00:00:00.000Z',
    applicationDeadline: '2026-10-31T23:59:59.000Z',
    officialUrl: 'https://www.santoorscholarship.com',
    sourceMetadata: {
      sourceName: 'Wipro Consumer Care CSR Registry',
      sourceType: 'corporate',
      lastCheckedDate: '2026-09-22',
      verifiedBy: 'ScholarSphere Southern Region Review'
    },
    verificationStatus: 'verified_official',
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Wipro CSR', 'Girls in Higher Education', 'South India', 'Government School Alum']
  },
  {
    name: 'Rural Agrarian Youth Technical Endowment (District Pilot)',
    provider: 'Gramin Vikas Higher Education Trust',
    description: 'Pilot grant for children of smallholder agrarian families in drought-prone rural talukas enrolled in professional engineering or agriculture degrees. Currently awaiting state department gazette notification.',
    fundingAmount: 40000,
    fundingFormatted: '₹40,000 / year (Stipend)',
    fundingType: 'partial',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['Engineering', 'Agriculture Sciences', 'B.Tech Computer Science'],
    minScorePercent: 65,
    minCgpa: 6.5,
    maxAnnualIncome: 200000, // ₹2.0 Lakhs
    eligibleCategories: ['All', 'OBC', 'SC', 'ST', 'EWS'],
    eligibleRegions: ['Rural Districts', 'Telangana', 'Maharashtra', 'Karnataka'],
    eligibleStudyYears: ['1st Year', '2nd Year'],
    requiredDocuments: [
      'Village Sarpanch / Mandal Revenue Officer (MRO) Domicile Certificate',
      'Pattadar Passbook / Agricultural Landholding Affidavit',
      'Intermediate Marks Memo',
      'Bonafide Certificate'
    ],
    digiLockerSupportedDocs: [
      'Intermediate Marks Memo'
    ],
    applicationOpeningDate: '2026-08-15T00:00:00.000Z',
    applicationDeadline: '2026-11-28T23:59:59.000Z',
    officialUrl: 'https://example.gov.in/rural-agrarian-pilot',
    sourceMetadata: {
      sourceName: 'Mandal Gazette Draft Registry',
      sourceType: 'foundation',
      lastCheckedDate: '2026-09-15',
      verifiedBy: 'Pending District Revenue Liaison'
    },
    verificationStatus: 'verification_required', // Needs source verification demo scenario
    lifecycleStatus: 'active',
    isDemoData: true,
    categoryTags: ['Rural Youth', 'Agrarian Family', 'Pending Verification', 'State Pilot']
  },
  {
    name: 'Summer 2026 AICTE Tech Internship Stipend (Concluded Scheme)',
    provider: 'All India Council for Technical Education',
    description: 'Summer fellowship stipend for technical students completing industrial research attachments. Notice: This cycle concluded on July 31, 2026 and registrations are officially closed.',
    fundingAmount: 15000,
    fundingFormatted: '₹15,000 Stipend (Closed)',
    fundingType: 'stipend',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['Computer Science', 'Engineering', 'Any'],
    minScorePercent: 60,
    minCgpa: 6.0,
    maxAnnualIncome: 600000,
    eligibleCategories: ['All'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['Any'],
    requiredDocuments: ['Internship Allotment Letter', 'College NOC'],
    digiLockerSupportedDocs: [],
    applicationOpeningDate: '2026-04-01T00:00:00.000Z',
    applicationDeadline: '2026-07-31T23:59:59.000Z', // EXPIRED RECORD (Scenario 5)
    officialUrl: 'https://internship.aicte-india.org',
    sourceMetadata: {
      sourceName: 'AICTE Internship Archives',
      sourceType: 'government',
      lastCheckedDate: '2026-08-01',
      verifiedBy: 'ScholarSphere Archives'
    },
    verificationStatus: 'expired',
    lifecycleStatus: 'archived',
    isDemoData: true,
    categoryTags: ['Expired Record', 'AICTE Archives', 'Closed Scheme']
  },
  {
    name: 'Prime Minister’s Special Scholarship Scheme (PMSSS - Upcoming)',
    provider: 'Ministry of Education & J&K Higher Education Council',
    description: 'Upcoming admission cycle grant for students from Jammu & Kashmir and Ladakh studying in premier technical institutions across India. Draft review pending approval.',
    fundingAmount: 130000,
    fundingFormatted: '₹1,30,000 / year (Draft Call)',
    fundingType: 'full_tuition',
    educationLevels: ['undergraduate'],
    eligibleCourses: ['Engineering', 'B.Tech Computer Science', 'Nursing', 'Architecture'],
    minScorePercent: 60,
    minCgpa: 6.5,
    maxAnnualIncome: 800000,
    eligibleCategories: ['All', 'General', 'OBC', 'SC', 'ST'],
    eligibleRegions: ['All India'],
    eligibleStudyYears: ['1st Year'],
    requiredDocuments: ['Domicile Certificate', '12th Class Marksheet', 'Income Certificate', 'Aadhaar Card'],
    digiLockerSupportedDocs: ['12th Class Marksheet', 'Aadhaar Card'],
    applicationOpeningDate: '2026-11-01T00:00:00.000Z', // Future opening date
    applicationDeadline: '2027-01-31T23:59:59.000Z',
    officialUrl: 'https://www.aicte-jk-scholarship-gov.in',
    sourceMetadata: {
      sourceName: 'PMSSS Pre-release Board Gazettes',
      sourceType: 'government',
      lastCheckedDate: '2026-10-02',
      verifiedBy: 'Pending Admin Publication'
    },
    verificationStatus: 'not_verified',
    lifecycleStatus: 'draft',
    isDemoData: true,
    categoryTags: ['Future Opening', 'PMSSS', 'Draft Policy', 'Technical Degree']
  }
];

export const DEMO_USERS_AND_PROFILES = [
  {
    user: {
      _id: 'user_aarav_btech',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@college.edu.in',
      role: 'student',
      isDemo: true
    },
    profile: {
      userId: 'user_aarav_btech',
      educationLevel: 'undergraduate',
      course: 'B.Tech Computer Science & Engineering',
      specialization: 'Artificial Intelligence & Machine Learning',
      yearOfStudy: '3rd Year',
      institution: 'Osmania University College of Engineering, Hyderabad',
      cgpa: 8.8, // 10.0 scale
      scorePercent: 88,
      academicAchievements: 'Dean\'s Merit List, Winner of Smart India Hackathon (SIH) 2025 State Round',
      stateOrRegion: 'Telangana',
      country: 'India',
      familyIncomeAnnual: 350000, // ₹3.5 Lakhs
      incomeRange: '₹3.0 Lakhs - ₹5.0 Lakhs / year',
      reservationCategory: 'EWS', // Economically Weaker Section
      studyInterests: ['Computer Science', 'Artificial Intelligence', 'Data Science'],
      preferredCategories: ['Merit-cum-Means', 'Engineering & UG', 'Fee Reimbursement'],
      documentsReady: [
        'Class 12th Marks Memo',
        'SSC (10th) & Intermediate (12th) Memo',
        'Income Certificate (Issued by Tehsildar / Revenue Authority)',
        'Bonafide / Enrollment Certificate from College',
        'Aadhaar Card (Identity Proof)',
        'MeeSeva Integrated Caste Certificate (Caste / EWS Proof)'
      ],
      digiLockerVerifiedDocs: [
        'Class 12th Marks Memo',
        'Aadhaar Card (Identity Proof)',
        'SSC (10th) & Intermediate (12th) Memo'
      ],
      isOnboarded: true
    },
    scenarioDescription: 'Strong Match Scenario: Aarav is in B.Tech CSE (3rd Year), holds a CGPA of 8.8 / 10.0, annual income of ₹3.5 Lakhs, and EWS category in Telangana. He satisfies all rules for the Reliance Foundation UG Scholarship and NSP Post-Matric Scheme.'
  },
  {
    user: {
      _id: 'user_priya_incomplete',
      name: 'Priya Patel',
      email: 'priya.patel@gujaratuniv.edu.in',
      role: 'student',
      isDemo: true
    },
    profile: {
      userId: 'user_priya_incomplete',
      educationLevel: 'undergraduate',
      course: 'B.Tech Information Technology',
      specialization: 'Cloud Computing',
      yearOfStudy: '2nd Year',
      institution: 'Gujarat Technological University (GTU), Ahmedabad',
      cgpa: 8.4,
      scorePercent: 82,
      academicAchievements: 'College TechFest Web Lead',
      stateOrRegion: 'Gujarat',
      country: 'India',
      familyIncomeAnnual: undefined, // Missing income field!
      incomeRange: 'Prefer not to say / Pending Tehsildar Certificate',
      reservationCategory: 'OBC',
      studyInterests: ['Information Technology', 'Software Engineering'],
      preferredCategories: ['Engineering & UG'],
      documentsReady: [
        'Class 12th Marks Memo',
        'Bonafide / Enrollment Certificate from College',
        'Aadhaar Card (Identity Proof)'
      ],
      digiLockerVerifiedDocs: [
        'Class 12th Marks Memo',
        'Aadhaar Card (Identity Proof)'
      ],
      isOnboarded: false // Incomplete onboarding
    },
    scenarioDescription: 'Needs Confirmation Scenario: Priya has a strong 8.4 CGPA in B.Tech IT, but her annual family income certificate is unstated, triggering an honest "Needs Confirmation" rather than a false qualification.'
  },
  {
    user: {
      _id: 'user_rahul_humanities',
      name: 'Rahul Verma',
      email: 'rahul.verma@du.ac.in',
      role: 'student',
      isDemo: true
    },
    profile: {
      userId: 'user_rahul_humanities',
      educationLevel: 'undergraduate',
      course: 'B.A. History & Political Science',
      specialization: 'Modern Indian History',
      yearOfStudy: '2nd Year',
      institution: 'Hindu College, University of Delhi',
      cgpa: 6.8, // 6.8 / 10.0
      scorePercent: 66,
      academicAchievements: 'Debating Society Secretary',
      stateOrRegion: 'Delhi NCR',
      country: 'India',
      familyIncomeAnnual: 550000, // ₹5.5 Lakhs
      incomeRange: '₹5.0 Lakhs - ₹7.0 Lakhs / year',
      reservationCategory: 'General',
      studyInterests: ['History', 'Political Science', 'Civil Services'],
      preferredCategories: ['Humanities', 'General Merit'],
      documentsReady: [
        'Class 12th Marks Memo',
        'Aadhaar Card (Identity Proof)'
      ],
      digiLockerVerifiedDocs: [
        'Aadhaar Card (Identity Proof)'
      ],
      isOnboarded: true
    },
    scenarioDescription: 'Criteria Mismatch Scenario: Rahul is enrolled in B.A. Humanities with a 6.8 CGPA. When checking technical B.Tech grants like Reliance or Tata Pankh, the system clearly explains the stream and score mismatches.'
  },
  {
    user: {
      _id: 'user_admin_ramanujam',
      name: 'Dr. K. S. Ramanujam (Director of Aid)',
      email: 'director.aid@scholarsphere.gov.in',
      role: 'admin',
      isDemo: true
    },
    profile: {
      userId: 'user_admin_ramanujam',
      educationLevel: 'doctoral',
      course: 'Higher Education Policy & Governance',
      specialization: 'Affirmative Action & Financial Aid Management',
      yearOfStudy: 'Final Year',
      institution: 'National Higher Education Accreditation Council',
      cgpa: 9.8,
      scorePercent: 96,
      academicAchievements: 'Chief Director, National Scholarship & DigiLocker Verification Liaison',
      stateOrRegion: 'Telangana',
      country: 'India',
      familyIncomeAnnual: 1200000,
      incomeRange: 'Above ₹10 Lakhs',
      reservationCategory: 'General',
      studyInterests: ['Policy', 'DBT Infrastructure', 'Digital Public Goods'],
      preferredCategories: ['Administration'],
      documentsReady: ['Aadhaar Card', 'Identity Proof'],
      digiLockerVerifiedDocs: ['Aadhaar Card'],
      isOnboarded: true
    },
    scenarioDescription: 'Administrator Scenario: Demonstrates administrative CRUD, DigiLocker verification review, lifecycle drafting, and database seed resets.'
  }
];
