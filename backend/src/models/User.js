import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    role: {
      type: String,
      enum: {
        values: ['TEACHER', 'STUDENT'],
        message: '{VALUE} is not a valid role'
      },
      required: [true, 'Role is required']
    },
    // Teacher specific fields
    employeeId: {
      type: String,
      trim: true,
      default: null
    },
    department: {
      type: String,
      trim: true,
      default: null
    },
    subjects: {
      type: [String],
      default: []
    },
    // Student specific fields
    studentId: {
      type: String,
      trim: true,
      default: null
    },
    rollNo: {
      type: String,
      trim: true,
      default: null
    },
    sapId: {
      type: String,
      trim: true,
      default: null
    },
    year: {
      type: String,
      enum: ['FE', 'SE', 'TE', 'BE'],
      default: null
    },
    branch: {
      type: String,
      trim: true,
      default: null
    },
    classNumber: {
      type: Number,
      default: null
    },
    batch: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Remove passwordHash and __v when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);
