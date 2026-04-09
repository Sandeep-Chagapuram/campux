import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    semester: { type: Number, required: true, min: 1, max: 8 }
  },
  { timestamps: true }
);

sectionSchema.index({ branch: 1, name: 1, semester: 1 }, { unique: true });

export const Section = mongoose.model("Section", sectionSchema);
