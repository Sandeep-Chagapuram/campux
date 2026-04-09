import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import FacultyDashboard from "./pages/FacultyDashboard";
import HomeRouter from "./pages/HomeRouter";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";

const App = () => (
  <div className="app-shell">
    <Navbar />
    <Routes>
      <Route path="/" element={<HomeRouter />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </div>
);

export default App;
