import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomeRouter = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.mustChangePassword) return <Navigate to="/change-password" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "faculty") return <Navigate to="/faculty" replace />;
  if (user.role === "student") return <Navigate to="/student" replace />;
  return <Navigate to="/login" replace />;
};

export default HomeRouter;
