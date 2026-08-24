import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Lecture date is required (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      index: true
    },
    day: {
      type: String,
      required: [true, 'Day is required'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: {
      type: String, // Format: HH:mm (24h)
      required: [true, 'Start time is required'],
      match: [/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format']
    },
    endTime: {
      type: String, // Format: HH:mm (24h)
      required: [true, 'End time is required'],
      match: [/^\d{2}:\d{2}$/, 'End time must be in HH:mm format']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    subjectCode: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher is required'],
      index: true
    },
    year: {
      type: String,
      required: [true, 'Target year is required'],
      enum: ['FE', 'SE', 'TE', 'BE']
    },
    branch: {
      type: String,
      required: [true, 'Target branch is required'],
      trim: true
    },
    classNumber: {
      type: Number,
      required: [true, 'Target class number is required']
    },
    batch: {
      type: Number,
      default: null // null means the entire class attends, or specific batch number
    },
    room: {
      type: String,
      required: [true, 'Room number/code is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying teacher schedule
timetableSchema.index({ teacherId: 1, date: 1, startTime: 1 });

// Compound index for querying student class schedule
timetableSchema.index({ year: 1, branch: 1, classNumber: 1, date: 1 });

export const Timetable = mongoose.model('Timetable', timetableSchema);
