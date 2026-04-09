import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-slate-900/95 text-white px-6 py-3 flex justify-between items-center border-b border-slate-700 sticky top-0 z-40">
      <Link to="/" className="font-semibold tracking-wide">
        College Management
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-slate-200">{user.fullName}</span>
            <button className="bg-rose-500 hover:bg-rose-600 px-3 py-1.5 rounded-lg transition" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
