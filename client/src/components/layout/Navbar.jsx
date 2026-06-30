import {
  FaTasks,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white text-blue-700 p-3 rounded-xl shadow-md">
            <FaTasks size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Smart Task Manager
            </h1>

            <p className="text-blue-100 text-sm">
              Organize your daily work efficiently
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          {/* User Info */}
          <div className="hidden md:flex flex-col text-right">
            <span className="text-blue-100 text-sm">
              {greeting}
            </span>

            <span className="text-white font-semibold">
              {user?.name}
            </span>
          </div>

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-lg shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-md"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;