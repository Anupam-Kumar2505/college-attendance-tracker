import mongoose from 'mongoose';

const leaveApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
      index: true
    },
    startDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Start date is required (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'],
      index: true
    },
    endDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'End date is required (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'],
      index: true
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true
    },
    details: {
      type: String,
      default: '',
      trim: true
    },
    proofFileName: {
      type: String,
      required: [true, 'Original proof file name is required'],
      trim: true
    },
    proofMimeType: {
      type: String,
      required: [true, 'Proof MIME type is required'],
      default: 'application/pdf'
    },
    proofFilePath: {
      type: String,
      required: [true, 'Stored proof file path is required'],
      trim: true
    },
    proofFileSize: {
      type: Number,
      required: [true, 'Proof file size is required']
    }
  },
  {
    timestamps: true
  }
);

// Compound index for student leave ranges
leaveApplicationSchema.index({ studentId: 1, startDate: 1, endDate: 1 });

// Compound index for querying leaves intersecting a given date range
leaveApplicationSchema.index({ startDate: 1, endDate: 1 });

export const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
