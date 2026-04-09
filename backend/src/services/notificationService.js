import { Student } from "../models/Student.js";
import { calculateAttendanceStats } from "./attendanceService.js";
import { sendEmail } from "./emailService.js";
import { sendWhatsAppWithDelay } from "./whatsappService.js";

export const sendDailyStudentReports = async () => {
  const students = await Student.find().populate("user", "fullName email");
  const reportDate = new Date().toLocaleDateString("en-GB");
  for (const student of students) {
    const stats = await calculateAttendanceStats(student._id);
    await sendEmail({
      to: student.user.email,
      subject: "Daily Attendance Report",
      html: `
        <h3>Attendance Summary</h3>
        <p>Hello ${student.user.fullName},</p>
        <p>Roll Number: ${student.rollNumber}</p>
        <p>Date: ${reportDate}</p>
        <p>Total periods: ${stats.totalPeriods}</p>
        <p>Attended periods: ${stats.attendedPeriods}</p>
        <p>Attendance percentage: ${stats.percentage.toFixed(2)}%</p>
        <p>Leaves remaining (for >=75%): ${stats.leavesRemaining}</p>
      `
    });
  }
};

export const notifyParentsForAbsences = async ({ absentStudents, periodNumber, date }) => {
  const attendanceDate = new Date(date).toLocaleDateString("en-GB");
  for (const student of absentStudents) {
    const message = `Alert: ${student.user.fullName} (Roll No: ${student.rollNumber}) was absent on ${attendanceDate} in period ${periodNumber}.`;

    if (student.parentEmail) {
      await sendEmail({
        to: student.parentEmail,
        subject: "Absence Alert",
        html: `<p>${message}</p>`
      });
    }

    if (student.parentPhone) {
      await sendWhatsAppWithDelay(student.parentPhone, message);
    }
  }
};
