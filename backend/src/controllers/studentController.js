import { Student } from "../models/Student.js";
import { calculateAttendanceStats } from "../services/attendanceService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id })
    .populate("branch", "name code")
    .populate("section", "name semester")
    .populate("user", "fullName email");

  if (!student) throw new ApiError(404, "Student profile not found");

  const stats = await calculateAttendanceStats(student._id);

  res.status(200).json({
    student,
    attendance: {
      ...stats,
      percentage: Number(stats.percentage.toFixed(2))
    }
  });
});
