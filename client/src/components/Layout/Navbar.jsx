import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, User, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="bg-white border-b border-gray-200 px-4 py-3 flex items-center 
      justify-between sticky top-0 z-40 shadow-sm"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <Menu size={20} />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-sm">✅</span>
          </div>
          <span className="font-bold text-gray-800 text-lg hidden sm:block">
            TaskFlow
          </span>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 
              transition-colors"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
              {user?.name}
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg 
                border border-gray-100 py-1 z-20"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {user?.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm 
                    text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm 
                    text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
