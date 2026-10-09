import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentChecklistItem {
  documentName: string;
  isReady: boolean;
  notes?: string;
}

export interface IApplication extends Document {
  student: mongoose.Types.ObjectId;
  scholarship: mongoose.Types.ObjectId;
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
  appliedDate?: Date;
  deadlineDate?: Date;
  checklistProgress: IDocumentChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scholarship: { type: Schema.Types.ObjectId, ref: 'Scholarship', required: true },
    trackerStatus: {
      type: String,
      enum: [
        'interested',
        'preparing_documents',
        'ready_to_apply',
        'applied',
        'under_review',
        'awarded',
        'rejected',
        'withdrawn'
      ],
      default: 'interested'
    },
    notes: { type: String, default: '' },
    appliedDate: { type: Date },
    deadlineDate: { type: Date },
    checklistProgress: [
      {
        documentName: { type: String, required: true },
        isReady: { type: Boolean, default: false },
        notes: { type: String, default: '' }
      }
    ]
  },
  { timestamps: true }
);

// Prevent duplicate tracker entries for the same student and scholarship (Section 11 requirement)
ApplicationSchema.index({ student: 1, scholarship: 1 }, { unique: true });

export const ApplicationModel =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
