import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    parentName: { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    parentEmail: { type: String, trim: true, lowercase: true }
  },
  { timestamps: true }
);

studentSchema.index({ branch: 1, section: 1 });

export const Student = mongoose.model("Student", studentSchema);
