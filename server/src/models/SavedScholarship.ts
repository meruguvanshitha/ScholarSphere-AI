import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedScholarship extends Document {
  student: mongoose.Types.ObjectId;
  scholarship: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SavedScholarshipSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scholarship: { type: Schema.Types.ObjectId, ref: 'Scholarship', required: true }
  },
  { timestamps: true }
);

// Prevent duplicate saved entries for the same student and scholarship (Section 16 requirement)
SavedScholarshipSchema.index({ student: 1, scholarship: 1 }, { unique: true });

export const SavedScholarshipModel =
  mongoose.models.SavedScholarship || mongoose.model<ISavedScholarship>('SavedScholarship', SavedScholarshipSchema);
