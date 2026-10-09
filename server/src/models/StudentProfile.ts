import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    educationLevel: { type: String, default: 'undergraduate' },
    course: { type: String, default: 'B.Tech Computer Science & Engineering' },
    specialization: { type: String, default: '' },
    yearOfStudy: { type: String, default: '1st Year' },
    institution: { type: String, default: '' },
    cgpa: { type: Number },
    scorePercent: { type: Number },
    academicAchievements: { type: String, default: '' },
    stateOrRegion: { type: String, default: 'Telangana' },
    country: { type: String, default: 'India' },
    familyIncomeAnnual: { type: Number },
    incomeRange: { type: String, default: '' },
    reservationCategory: { type: String, default: 'General' },
    studyInterests: [{ type: String }],
    preferredCategories: [{ type: String }],
    documentsReady: [{ type: String }],
    digiLockerVerifiedDocs: [{ type: String }],
    isOnboarded: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const StudentProfileModel =
  mongoose.models.StudentProfile || mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
