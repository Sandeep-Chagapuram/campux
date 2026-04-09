import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true }
  },
  { timestamps: true }
);

export const Branch = mongoose.model("Branch", branchSchema);
