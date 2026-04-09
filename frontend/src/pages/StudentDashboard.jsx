import { useEffect, useState } from "react";
import api from "../services/api";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await api.get("/student/dashboard");
      setDashboard(data);
    };
    loadData();
  }, []);

  if (!dashboard) return <div className="max-w-6xl mx-auto p-6">Loading student data...</div>;

  const { student, attendance } = dashboard;
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-5">
      <h2 className="text-3xl font-bold text-slate-800">Student Dashboard</h2>
      <div className="card p-5 space-y-1">
        <p>
          <strong>Name:</strong> {student.user.fullName}
        </p>
        <p>
          <strong>Roll Number:</strong> {student.rollNumber}
        </p>
        <p>
          <strong>Branch:</strong> {student.branch.name}
        </p>
        <p>
          <strong>Section:</strong> {student.section.name}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-blue-50/60 border-blue-100">Total periods: {attendance.totalPeriods}</div>
        <div className="card p-4 bg-emerald-50/60 border-emerald-100">Attended: {attendance.attendedPeriods}</div>
        <div className="card p-4 bg-indigo-50/60 border-indigo-100">Attendance %: {attendance.percentage.toFixed(2)}</div>
        <div className="card p-4 bg-amber-50/60 border-amber-100">Leaves remaining: {attendance.leavesRemaining}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
