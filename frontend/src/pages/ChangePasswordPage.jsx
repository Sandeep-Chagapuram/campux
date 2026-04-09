import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ChangePasswordPage = () => {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await changePassword(currentPassword, newPassword);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change password");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center px-4">
      <form className="card p-7 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold">Change Password</h1>
        <p className="text-sm text-slate-600">
          You must change your default password before accessing the dashboard.
        </p>
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <input
          className="input"
          placeholder="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="w-full btn-primary">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
