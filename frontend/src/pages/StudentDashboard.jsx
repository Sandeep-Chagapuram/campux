import { useEffect, useState } from "react";
import api from "../services/api";
import { downloadPdfFromResponse } from "../utils/downloadPdf";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestForm, setRequestForm] = useState({
    subject: "",
    body: "",
    fromDate: "",
    toDate: "",
    durationText: ""
  });
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const { data } = await api.get("/student/dashboard");
      setDashboard(data);
    };
    const loadRequests = async () => {
      const { data } = await api.get("/permissions/student");
      setRequests(data);
    };
    loadData();
    loadRequests();
  }, []);

  const submitPermissionRequest = async (event) => {
    event.preventDefault();
    await api.post("/permissions/student", requestForm);
    setRequestForm({ subject: "", body: "", fromDate: "", toDate: "", durationText: "" });
    setRequestMessage("Permission request submitted");
    const { data } = await api.get("/permissions/student");
    setRequests(data);
  };

  const downloadPdf = async (requestId) => {
    const response = await api.get(`/permissions/student/${requestId}/pdf`, {
      responseType: "blob"
    });
    await downloadPdfFromResponse(response, {
      filename: `permission-letter-${requestId}.pdf`,
      onError: (msg) => alert(msg)
    });
  };

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

      <div className="card p-5">
        <h3 className="text-lg font-semibold mb-3">Create Permission Request</h3>
        {requestMessage ? <p className="text-emerald-700 text-sm mb-2">{requestMessage}</p> : null}
        <form className="grid md:grid-cols-2 gap-3" onSubmit={submitPermissionRequest}>
          <input
            className="input"
            placeholder="Subject"
            value={requestForm.subject}
            onChange={(e) => setRequestForm((prev) => ({ ...prev, subject: e.target.value }))}
            required
          />
          <input
            className="input"
            placeholder="Duration (optional)"
            value={requestForm.durationText}
            onChange={(e) => setRequestForm((prev) => ({ ...prev, durationText: e.target.value }))}
          />
          <input
            type="date"
            className="input"
            value={requestForm.fromDate}
            onChange={(e) => setRequestForm((prev) => ({ ...prev, fromDate: e.target.value }))}
          />
          <input
            type="date"
            className="input"
            value={requestForm.toDate}
            onChange={(e) => setRequestForm((prev) => ({ ...prev, toDate: e.target.value }))}
          />
          <textarea
            className="input md:col-span-2 min-h-28"
            placeholder="Reason / Body"
            value={requestForm.body}
            onChange={(e) => setRequestForm((prev) => ({ ...prev, body: e.target.value }))}
            required
          />
          <button className="btn-primary md:col-span-2">Submit Request</button>
        </form>
      </div>

      <div className="card p-5">
        <h3 className="text-lg font-semibold mb-3">My Permission Requests</h3>
        {requests.length === 0 ? (
          <p className="text-slate-600 text-sm">No requests submitted yet.</p>
        ) : (
          <div className="space-y-2">
            {requests.map((req) => (
              <div key={req._id} className="border border-slate-200 rounded-lg p-3 flex justify-between gap-3">
                <div>
                  <p className="font-medium">{req.subject}</p>
                  <p className="text-sm text-slate-600">Status: {req.status}</p>
                </div>
                {req.status === "approved" ? (
                  <button className="btn-success" onClick={() => downloadPdf(req._id)}>
                    Download PDF
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
