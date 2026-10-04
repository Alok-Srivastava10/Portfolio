import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  techTags: string[];
  bullets: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema: Schema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "Present" },
    techTags: { type: [String], default: [] },
    bullets: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model<IExperience>("Experience", ExperienceSchema);
