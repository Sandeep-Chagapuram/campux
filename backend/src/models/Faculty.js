import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    employeeId: { type: String, required: true, unique: true, trim: true, uppercase: true },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }]
  },
  { timestamps: true }
);

export const Faculty = mongoose.model("Faculty", facultySchema);
