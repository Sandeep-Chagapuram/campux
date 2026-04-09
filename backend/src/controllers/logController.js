import { AttendanceLog } from "../models/AttendanceLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDailyLogs = asyncHandler(async (req, res) => {
  const { date, branch, section } = req.query;
  const query = {};
  if (date) query.date = new Date(date);
  if (branch) query.branch = branch;
  if (section) query.section = section;

  const logs = await AttendanceLog.find(query)
    .populate("branch", "name code")
    .populate("section", "name semester")
    .populate({
      path: "absentStudents",
      populate: { path: "user", select: "fullName email" }
    })
    .sort({ periodNumber: 1 });

  res.status(200).json(logs);
});
