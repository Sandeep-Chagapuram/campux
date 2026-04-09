import mongoose from "mongoose";

const permissionRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    fromDate: { type: Date, default: null },
    toDate: { type: Date, default: null },
    durationText: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvalId: { type: String, unique: true, sparse: true, default: null, index: true },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" }
  },
  { timestamps: true }
);

export const PermissionRequest = mongoose.model("PermissionRequest", permissionRequestSchema);
