import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  text: string;
  order: number;
}

const AchievementSchema: Schema = new Schema({
  text: { type: String, required: true },
  order: { type: Number, default: 0 },
});

export default mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", AchievementSchema);
