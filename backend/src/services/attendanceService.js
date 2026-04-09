import { Attendance } from "../models/Attendance.js";
import { AttendanceLog } from "../models/AttendanceLog.js";
import { Student } from "../models/Student.js";

export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const calculateAttendanceStats = async (studentId) => {
  const records = await Attendance.find({ "entries.student": studentId }).select("entries");
  let totalPeriods = 0;
  let attendedPeriods = 0;

  records.forEach((record) => {
    record.entries.forEach((entry) => {
      if (String(entry.student) === String(studentId)) {
        totalPeriods += 1;
        if (entry.status === "present") attendedPeriods += 1;
      }
    });
  });

  const percentage = totalPeriods ? (attendedPeriods / totalPeriods) * 100 : 0;
  const maxAbsencesAllowed = Math.floor(totalPeriods * 0.25);
  const absencesTaken = totalPeriods - attendedPeriods;
  const leavesRemaining = Math.max(0, maxAbsencesAllowed - absencesTaken);

  return { totalPeriods, attendedPeriods, percentage, leavesRemaining };
};

export const upsertAttendanceAndLog = async ({
  date,
  branch,
  section,
  periodNumber,
  faculty,
  entries
}) => {
  const attendanceDoc = await Attendance.findOneAndUpdate(
    { date, branch, section, periodNumber },
    { date, branch, section, periodNumber, faculty, entries },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const absentStudentIds = entries.filter((entry) => entry.status === "absent").map((e) => e.student);

  await AttendanceLog.findOneAndUpdate(
    { date, branch, section, periodNumber },
    { date, branch, section, periodNumber, absentStudents: absentStudentIds },
    { upsert: true, new: true }
  );

  return attendanceDoc;
};

export const getStudentsBySection = async (sectionId) =>
  Student.find({ section: sectionId }).populate("user", "fullName email");
