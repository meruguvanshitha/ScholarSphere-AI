import mongoose, { Schema, Document } from 'mongoose';

export interface IScholarship extends Document {
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
  eligibleCategories: string[]; // General, OBC, SC, ST, EWS, All
  eligibleRegions: string[];
  eligibleStudyYears: string[];
  requiredDocuments: string[];
  digiLockerSupportedDocs: string[];
  applicationOpeningDate: Date;
  applicationDeadline: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const ScholarshipSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fundingAmount: { type: Number, required: true, default: 0 },
    fundingFormatted: { type: String, required: true },
    fundingType: {
      type: String,
      enum: ['full_tuition', 'partial', 'stipend', 'grant', 'merit_award'],
      default: 'grant'
    },
    educationLevels: [{ type: String }],
    eligibleCourses: [{ type: String }],
    minScorePercent: { type: Number },
    minCgpa: { type: Number },
    maxAnnualIncome: { type: Number },
    eligibleCategories: [{ type: String, default: 'All' }],
    eligibleRegions: [{ type: String, default: 'All India' }],
    eligibleStudyYears: [{ type: String }],
    requiredDocuments: [{ type: String }],
    digiLockerSupportedDocs: [{ type: String }],
    applicationOpeningDate: { type: Date, default: Date.now },
    applicationDeadline: { type: Date, required: true },
    officialUrl: { type: String, required: true },
    sourceMetadata: {
      sourceName: { type: String, default: '' },
      sourceType: { type: String, default: 'government' },
      lastCheckedDate: { type: String, default: '' },
      verifiedBy: { type: String, default: '' },
      portalSchemeCode: { type: String, default: '' }
    },
    verificationStatus: {
      type: String,
      enum: ['verified_official', 'not_verified', 'verification_required', 'expired'],
      default: 'verified_official'
    },
    lifecycleStatus: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active'
    },
    isDemoData: { type: Boolean, default: false },
    categoryTags: [{ type: String }]
  },
  { timestamps: true }
);

// Text search index
ScholarshipSchema.index({ name: 'text', provider: 'text', description: 'text', categoryTags: 'text', eligibleCourses: 'text' });

export const ScholarshipModel =
  mongoose.models.Scholarship || mongoose.model<IScholarship>('Scholarship', ScholarshipSchema);
