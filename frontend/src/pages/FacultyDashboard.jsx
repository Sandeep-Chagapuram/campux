import { useEffect, useState } from "react";
import api from "../services/api";

const FacultyDashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const [scope, setScope] = useState({ branches: [], sections: [] });
  const [selected, setSelected] = useState({ date: today, branch: "", section: "", periodNumber: 1 });
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "" });

  useEffect(() => {
    const loadScope = async () => {
      const { data } = await api.get("/faculty/scope");
      setScope(data);
    };
    loadScope();
  }, []);

  useEffect(() => {
    if (!selected.section) return;
    const loadStudents = async () => {
      const { data } = await api.get(`/faculty/students/${selected.section}`);
      setStudents(data);
      const initialMap = {};
      data.forEach((student) => {
        initialMap[student._id] = "present";
      });
      setStatusMap(initialMap);
      setHasSubmitted(false);
    };
    loadStudents();
  }, [selected.section]);

  useEffect(() => {
    setHasSubmitted(false);
  }, [selected.date, selected.branch, selected.section, selected.periodNumber]);

  const submitAttendance = async () => {
    if (isSubmitting || hasSubmitted) return;
    const entries = students.map((student) => ({
      student: student._id,
      status: statusMap[student._id] || "present"
    }));
    try {
      setIsSubmitting(true);
      await api.post("/faculty/attendance", { ...selected, entries });
      setPopup({ show: true, message: "Attendance submitted successfully for this period." });
      setHasSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-slate-800">Faculty Dashboard</h2>
      <div className="grid md:grid-cols-4 gap-3 card p-4">
        <input
          type="date"
          className="input"
          value={selected.date}
          onChange={(e) => setSelected((prev) => ({ ...prev, date: e.target.value }))}
        />
        <select
          className="input"
          value={selected.branch}
          onChange={(e) => setSelected((prev) => ({ ...prev, branch: e.target.value }))}
        >
          <option value="">Select Branch</option>
          {scope.branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={selected.section}
          onChange={(e) => setSelected((prev) => ({ ...prev, section: e.target.value }))}
        >
          <option value="">Select Section</option>
          {scope.sections.map((section) => (
            <option key={section._id} value={section._id}>
              {section.name} (Sem {section.semester})
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          className="input"
          value={selected.periodNumber}
          onChange={(e) => setSelected((prev) => ({ ...prev, periodNumber: Number(e.target.value) }))}
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">Mark Attendance</h3>
        {students.map((student) => (
          <div key={student._id} className="flex justify-between items-center border-b py-2">
            <span>{student.user.fullName}</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 text-sm px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                <input
                  type="radio"
                  name={`attendance-${student._id}`}
                  checked={statusMap[student._id] === "present"}
                  onChange={() => setStatusMap((prev) => ({ ...prev, [student._id]: "present" }))}
                />
                Present
              </label>
              <label className="flex items-center gap-1 text-sm px-2 py-1 rounded-md bg-rose-50 border border-rose-200">
                <input
                  type="radio"
                  name={`attendance-${student._id}`}
                  checked={statusMap[student._id] === "absent"}
                  onChange={() => setStatusMap((prev) => ({ ...prev, [student._id]: "absent" }))}
                />
                Absent
              </label>
            </div>
          </div>
        ))}
        {students.length > 0 && (
          <button
            className={`mt-4 text-white px-4 py-2 rounded-lg ${
              isSubmitting || hasSubmitted ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
            onClick={submitAttendance}
            disabled={isSubmitting || hasSubmitted}
          >
            {isSubmitting ? "Submitting..." : hasSubmitted ? "Submitted" : "Submit Attendance"}
          </button>
        )}
      </div>

      {popup.show && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center border border-emerald-100">
            <h4 className="text-lg font-semibold text-emerald-700 mb-2">Success</h4>
            <p className="text-slate-700 mb-4">{popup.message}</p>
            <button
              className="btn-success"
              onClick={() => setPopup({ show: false, message: "" })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
