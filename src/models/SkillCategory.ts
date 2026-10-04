import mongoose, { Schema, Document } from "mongoose";

export interface ISkillCategory extends Document {
  category: string;
  skills: string[];
  order: number;
}

const SkillCategorySchema: Schema = new Schema({
  category: { type: String, required: true },
  skills: { type: [String], default: [] },
  order: { type: Number, default: 0 },
});

export default mongoose.models.SkillCategory || mongoose.model<ISkillCategory>("SkillCategory", SkillCategorySchema);
