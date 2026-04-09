import mongoose from "mongoose";

const attendanceLogSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    periodNumber: { type: Number, required: true, min: 1 },
    absentStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]
  },
  { timestamps: true }
);

attendanceLogSchema.index({ date: 1, branch: 1, section: 1, periodNumber: 1 }, { unique: true });

export const AttendanceLog = mongoose.model("AttendanceLog", attendanceLogSchema);
