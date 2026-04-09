import mongoose from "mongoose";

const attendanceEntrySchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    status: { type: String, enum: ["present", "absent"], required: true }
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    periodNumber: { type: Number, required: true, min: 1 },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    entries: { type: [attendanceEntrySchema], default: [] }
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1, branch: 1, section: 1, periodNumber: 1 }, { unique: true });
attendanceSchema.index({ section: 1, date: 1 });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
