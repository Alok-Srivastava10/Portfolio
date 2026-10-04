import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  institution: string;
  degree: string;
  field: string;
  cgpaOrGrade?: string;
  location?: string;
  startDate: string;
  endDate: string;
  order: number;
}

const EducationSchema: Schema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  cgpaOrGrade: { type: String },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  order: { type: Number, default: 0 },
});

export default mongoose.models.Education || mongoose.model<IEducation>("Education", EducationSchema);
