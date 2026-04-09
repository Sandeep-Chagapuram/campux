import { useEffect, useState } from "react";
import api from "../services/api";
import { downloadPdfFromResponse } from "../utils/downloadPdf";

const AdminDashboard = () => {
  const [data, setData] = useState({ branches: [], sections: [], students: [], faculty: [] });
  const [branchForm, setBranchForm] = useState({ name: "", code: "" });
  const [sectionForm, setSectionForm] = useState({ name: "", branch: "", semester: 1 });
  const [facultyForm, setFacultyForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    employeeId: "",
    branches: [],
    sections: []
  });
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    registrationNumber: "",
    branch: "",
    section: "",
    parentName: "",
    parentPhone: "",
    parentEmail: ""
  });
  const [periodsPerDay, setPeriodsPerDay] = useState(8);
  const [message, setMessage] = useState("");
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [permissionFilter, setPermissionFilter] = useState("pending");
  const [permissionRequests, setPermissionRequests] = useState([]);

  const loadData = async () => {
    const { data: response } = await api.get("/admin/master-data");
    setData(response);
  };

  const loadPermissionRequests = async (status = permissionFilter) => {
    const { data: response } = await api.get(`/permissions/admin?status=${status}`);
    setPermissionRequests(response);
  };

  useEffect(() => {
    loadData();
    loadPermissionRequests("pending");
  }, []);

  const addBranch = async (event) => {
    event.preventDefault();
    await api.post("/admin/branches", branchForm);
    setBranchForm({ name: "", code: "" });
    setMessage("Branch added");
    await loadData();
  };

  const addSection = async (event) => {
    event.preventDefault();
    await api.post("/admin/sections", { ...sectionForm, semester: Number(sectionForm.semester) });
    setSectionForm({ name: "", branch: "", semester: 1 });
    setMessage("Section added");
    await loadData();
  };

  const addFaculty = async (event) => {
    event.preventDefault();
    const payload = {
      ...facultyForm,
      branches: facultyForm.branches,
      sections: facultyForm.sections
    };
    if (editingFacultyId) {
      await api.put(`/admin/faculty/${editingFacultyId}`, payload);
      setMessage("Faculty details updated");
    } else {
      const { data: response } = await api.post("/admin/faculty", payload);
      setMessage(
        `Faculty added. Default login: ${response.defaultCredentials.username} / ${response.defaultCredentials.password}`
      );
    }
    setFacultyForm({
      fullName: "",
      email: "",
      phone: "",
      employeeId: "",
      branches: [],
      sections: []
    });
    setEditingFacultyId(null);
    await loadData();
  };

  const addStudent = async (event) => {
    event.preventDefault();
    if (editingStudentId) {
      await api.put(`/admin/students/${editingStudentId}`, studentForm);
      setMessage("Student details updated");
    } else {
      const { data: response } = await api.post("/admin/students", studentForm);
      setMessage(
        `Student added. Default login: ${response.defaultCredentials.username} / ${response.defaultCredentials.password}`
      );
    }
    setStudentForm({
      fullName: "",
      email: "",
      phone: "",
      rollNumber: "",
      registrationNumber: "",
      branch: "",
      section: "",
      parentName: "",
      parentPhone: "",
      parentEmail: ""
    });
    setEditingStudentId(null);
    await loadData();
  };

  const updatePeriods = async () => {
    await api.put("/admin/config/periods", { periodsPerDay: Number(periodsPerDay) });
    alert("Period configuration updated");
  };

  const handleMultiSelect = (event, key, setter) => {
    const values = Array.from(event.target.selectedOptions, (option) => option.value);
    setter((prev) => ({ ...prev, [key]: values }));
  };

  const decidePermission = async (id, decision) => {
    await api.patch(`/admin/${id}/decision`, { decision });
    setMessage(`Permission request ${decision}`);
    await loadPermissionRequests(permissionFilter);
  };

  const downloadPermissionPdf = async (id) => {
    const response = await api.get(`/permissions/admin/${id}/pdf`, { responseType: "blob" });
    await downloadPdfFromResponse(response, {
      filename: `permission-letter-${id}.pdf`,
      onError: (msg) => alert(msg)
    });
  };

  const startEditFaculty = (faculty) => {
    setEditingFacultyId(faculty._id);
    setFacultyForm({
      fullName: faculty.user?.fullName || "",
      email: faculty.user?.email || "",
      phone: faculty.user?.phone || "",
      employeeId: faculty.employeeId || "",
      branches: (faculty.branches || []).map((item) => (typeof item === "string" ? item : item._id)),
      sections: (faculty.sections || []).map((item) => (typeof item === "string" ? item : item._id))
    });
  };

  const startEditStudent = (student) => {
    setEditingStudentId(student._id);
    setStudentForm({
      fullName: student.user?.fullName || "",
      email: student.user?.email || "",
      phone: student.user?.phone || "",
      rollNumber: student.rollNumber || "",
      registrationNumber: student.registrationNumber || "",
      branch: typeof student.branch === "string" ? student.branch : student.branch?._id || "",
      section: typeof student.section === "string" ? student.section : student.section?._id || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      parentEmail: student.parentEmail || ""
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-slate-800">Admin Dashboard</h2>
      {message ? <div className="card p-3 bg-emerald-50 text-emerald-800 border-emerald-200">{message}</div> : null}

      <section className="card p-4">
        <h3 className="font-medium mb-3">Add Branch</h3>
        <form className="flex gap-2" onSubmit={addBranch}>
          <input
            className="border p-2 rounded"
            placeholder="Branch name"
            value={branchForm.name}
            onChange={(e) => setBranchForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Code"
            value={branchForm.code}
            onChange={(e) => setBranchForm((prev) => ({ ...prev, code: e.target.value }))}
            required
          />
          <button className="btn-primary">Save</button>
        </form>
      </section>

      <section className="card p-4">
        <h3 className="font-medium mb-3">Add Section</h3>
        <form className="grid md:grid-cols-4 gap-2" onSubmit={addSection}>
          <input
            className="border p-2 rounded"
            placeholder="Section (A/B/C)"
            value={sectionForm.name}
            onChange={(e) => setSectionForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <select
            className="border p-2 rounded"
            value={sectionForm.branch}
            onChange={(e) => setSectionForm((prev) => ({ ...prev, branch: e.target.value }))}
            required
          >
            <option value="">Select Branch</option>
            {data.branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.code} - {branch.name}
              </option>
            ))}
          </select>
          <input
            className="border p-2 rounded"
            type="number"
            min={1}
            max={8}
            value={sectionForm.semester}
            onChange={(e) => setSectionForm((prev) => ({ ...prev, semester: e.target.value }))}
            required
          />
          <button className="btn-primary">Save</button>
        </form>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{editingFacultyId ? "Edit Faculty" : "Add Faculty"}</h3>
          {editingFacultyId ? (
            <button
              type="button"
              className="text-sm text-slate-600 underline"
              onClick={() => {
                setEditingFacultyId(null);
                setFacultyForm({
                  fullName: "",
                  email: "",
                  phone: "",
                  employeeId: "",
                  branches: [],
                  sections: []
                });
              }}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
        <form className="grid md:grid-cols-2 gap-2" onSubmit={addFaculty}>
          <input
            className="border p-2 rounded"
            placeholder="Full name"
            value={facultyForm.fullName}
            onChange={(e) => setFacultyForm((prev) => ({ ...prev, fullName: e.target.value }))}
            required
          />
          <input
            className="border p-2 rounded"
            type="email"
            placeholder="Email"
            value={facultyForm.email}
            onChange={(e) => setFacultyForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={facultyForm.phone}
            onChange={(e) => setFacultyForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Employee ID"
            value={facultyForm.employeeId}
            onChange={(e) => setFacultyForm((prev) => ({ ...prev, employeeId: e.target.value }))}
            required
          />
          <select
            multiple
            className="border p-2 rounded min-h-28"
            value={facultyForm.branches}
            onChange={(e) => handleMultiSelect(e, "branches", setFacultyForm)}
          >
            {data.branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.code} - {branch.name}
              </option>
            ))}
          </select>
          <select
            multiple
            className="border p-2 rounded min-h-28"
            value={facultyForm.sections}
            onChange={(e) => handleMultiSelect(e, "sections", setFacultyForm)}
          >
            {data.sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name} (Sem {section.semester})
              </option>
            ))}
          </select>
          <button className="btn-primary md:col-span-2">
            {editingFacultyId ? "Update Faculty" : "Add Faculty"}
          </button>
        </form>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{editingStudentId ? "Edit Student" : "Add Student"}</h3>
          {editingStudentId ? (
            <button
              type="button"
              className="text-sm text-slate-600 underline"
              onClick={() => {
                setEditingStudentId(null);
                setStudentForm({
                  fullName: "",
                  email: "",
                  phone: "",
                  rollNumber: "",
                  registrationNumber: "",
                  branch: "",
                  section: "",
                  parentName: "",
                  parentPhone: "",
                  parentEmail: ""
                });
              }}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
        <form className="grid md:grid-cols-3 gap-2" onSubmit={addStudent}>
          <input
            className="border p-2 rounded"
            placeholder="Full name"
            value={studentForm.fullName}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, fullName: e.target.value }))}
            required
          />
          <input
            className="border p-2 rounded"
            type="email"
            placeholder="Email"
            value={studentForm.email}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={studentForm.phone}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Roll Number"
            value={studentForm.rollNumber}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, rollNumber: e.target.value }))}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Registration Number"
            value={studentForm.registrationNumber}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, registrationNumber: e.target.value }))}
            required
          />
          <select
            className="border p-2 rounded"
            value={studentForm.branch}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, branch: e.target.value }))}
            required
          >
            <option value="">Select Branch</option>
            {data.branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.code} - {branch.name}
              </option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={studentForm.section}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, section: e.target.value }))}
            required
          >
            <option value="">Select Section</option>
            {data.sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name} (Sem {section.semester})
              </option>
            ))}
          </select>
          <input
            className="border p-2 rounded"
            placeholder="Parent Name"
            value={studentForm.parentName}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, parentName: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Parent Phone"
            value={studentForm.parentPhone}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, parentPhone: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            type="email"
            placeholder="Parent Email"
            value={studentForm.parentEmail}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, parentEmail: e.target.value }))}
          />
          <button className="btn-primary md:col-span-3">
            {editingStudentId ? "Update Student" : "Add Student"}
          </button>
        </form>
      </section>

      <section className="card p-4">
        <h3 className="font-medium mb-3">Period Configuration</h3>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded"
            type="number"
            min={1}
            max={12}
            value={periodsPerDay}
            onChange={(e) => setPeriodsPerDay(e.target.value)}
          />
          <button className="btn-success" onClick={updatePeriods}>
            Update
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-2">Branches ({data.branches.length})</h3>
          {data.branches.map((branch) => (
            <p key={branch._id} className="text-sm">
              {branch.code} - {branch.name}
            </p>
          ))}
        </div>
        <div className="card p-4">
          <h3 className="font-medium mb-2">Sections ({data.sections.length})</h3>
          {data.sections.map((section) => (
            <p key={section._id} className="text-sm">
              {section.name} (Sem {section.semester}) - {section.branch?.code || "-"}
            </p>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-2">Faculty ({data.faculty.length})</h3>
          {data.faculty.map((faculty) => (
            <div key={faculty._id} className="flex items-center justify-between text-sm border-b py-1">
              <span>
                {faculty.user?.fullName} - {faculty.user?.email}
              </span>
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => startEditFaculty(faculty)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
        <div className="card p-4">
          <h3 className="font-medium mb-2">Students ({data.students.length})</h3>
          {data.students.map((student) => (
            <div key={student._id} className="flex items-center justify-between text-sm border-b py-1">
              <span>
                {student.user?.fullName} - {student.user?.email}
              </span>
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => startEditStudent(student)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Digital Permission Requests</h3>
          <select
            className="input max-w-44"
            value={permissionFilter}
            onChange={async (e) => {
              const value = e.target.value;
              setPermissionFilter(value);
              await loadPermissionRequests(value);
            }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {permissionRequests.length === 0 ? (
          <p className="text-sm text-slate-600">No permission requests found.</p>
        ) : (
          <div className="space-y-2">
            {permissionRequests.map((request) => (
              <div key={request._id} className="border border-slate-200 rounded-lg p-3 flex justify-between gap-3">
                <div>
                  <p className="font-medium">{request.subject}</p>
                  <p className="text-sm text-slate-600">
                    {request.student?.user?.fullName} ({request.student?.rollNumber}) - {request.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {request.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        className="btn-success"
                        onClick={() => decidePermission(request._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg"
                        onClick={() => decidePermission(request._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                  {request.status === "approved" ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => downloadPermissionPdf(request._id)}
                    >
                      Download PDF
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
