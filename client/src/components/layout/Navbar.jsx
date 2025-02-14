import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Tombola Draws
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/draws"
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
            >
              Draws
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
              >
                Admin
              </Link>
            )}
            <Link
              to="/profile"
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
