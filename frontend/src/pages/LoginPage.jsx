import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form.identifier, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center px-4">
      <form className="card p-7 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold">Sign in</h1>
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <input
          className="input"
          placeholder="Username or Email"
          type="text"
          value={form.identifier}
          onChange={(e) => setForm((prev) => ({ ...prev, identifier: e.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />
        <button className="w-full btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
