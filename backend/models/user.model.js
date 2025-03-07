import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String, // Changed to String to handle leading zeros
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'recruiter'],
    required: true,
  },
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String },
    resumeOriginalName: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    profilePhoto: { type: String, default: "" }
  }
}, { timestamps: true }); // Fixed placement of timestamps

export const User = mongoose.model('User', userSchema);
