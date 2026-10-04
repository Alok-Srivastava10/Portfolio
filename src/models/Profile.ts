import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  email: string;
  phone: string;
  location?: string;
  socials: {
    linkedin?: string;
    github?: string;
    leetcode?: string;
    gfg?: string;
    twitter?: string;
  };
  profileImageUrl?: string;
  resumeUrl?: string;
  accentColor?: string;
  secondaryAccentColor?: string;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  tagline: { type: String, required: true },
  summary: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String },
  socials: {
    linkedin: { type: String },
    github: { type: String },
    leetcode: { type: String },
    gfg: { type: String },
    twitter: { type: String },
  },
  profileImageUrl: { type: String },
  resumeUrl: { type: String },
  accentColor: { type: String, default: "#3730A3" }, // Default indigo
  secondaryAccentColor: { type: String, default: "#C2703D" }, // Default warm terracotta/amber
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
