import { Faculty } from "../models/Faculty.js";
import { Student } from "../models/Student.js";
import { User } from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import {
  getStudentsBySection,
  startOfDay,
  upsertAttendanceAndLog
} from "../services/attendanceService.js";
import { notifyParentsForAbsences } from "../services/notificationService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getFacultyScope = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({ user: req.user._id }).populate("branches sections");
  if (!faculty) throw new ApiError(404, "Faculty profile not found");
  res.status(200).json(faculty);
});

export const getStudentsForAttendance = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const students = await getStudentsBySection(sectionId);
  res.status(200).json(students);
});

export const markAttendance = asyncHandler(async (req, res) => {
  const { branch, section, periodNumber, date: selectedDate, entries } = req.body;
  const faculty = await Faculty.findOne({ user: req.user._id });
  if (!faculty) throw new ApiError(404, "Faculty profile not found");

  const parsedDate = new Date(selectedDate);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "Invalid attendance date");
  }

  const date = startOfDay(parsedDate);
  const attendance = await upsertAttendanceAndLog({
    date,
    branch,
    section,
    periodNumber,
    faculty: faculty._id,
    entries
  });

  const absentStudentIds = entries.filter((entry) => entry.status === "absent").map((entry) => entry.student);
  const absentStudents = await Student.find({ _id: { $in: absentStudentIds } }).populate("user", "fullName");

  await notifyParentsForAbsences({ absentStudents, periodNumber, date });

  res.status(200).json(attendance);
});

export const createStudentByFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({ user: req.user._id });
  if (!faculty) throw new ApiError(404, "Faculty profile not found");

  const {
    fullName,
    email,
    phone,
    rollNumber,
    registrationNumber,
    branch,
    section,
    parentName,
    parentPhone,
    parentEmail
  } = req.body;

  const canManageSection = faculty.sections.some((id) => String(id) === String(section));
  if (!canManageSection) {
    throw new ApiError(403, "Faculty can only add students in assigned sections");
  }

  const defaultPassword = email;
  const user = await User.create({
    fullName,
    username: email,
    email,
    password: defaultPassword,
    mustChangePassword: true,
    phone,
    role: ROLES.STUDENT
  });

  const student = await Student.create({
    user: user._id,
    rollNumber,
    registrationNumber,
    branch,
    section,
    parentName,
    parentPhone,
    parentEmail
  });

  res.status(201).json({
    student,
    defaultCredentials: { username: email, password: defaultPassword }
  });
});
