import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Star,
  Tag,
  Settings,
  X,
  BarChart2,
} from "lucide-react";
import { useTasks } from "../../context/TaskContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { stats } = useTasks();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      to: "/tasks",
      icon: CheckSquare,
      label: "All Tasks",
      count: stats?.total,
    },
    {
      to: "/tasks?status=in-progress",
      icon: Clock,
      label: "In Progress",
      count: stats?.["in-progress"],
    },
    { to: "/tasks?priority=urgent", icon: Star, label: "Urgent" },
    { to: "/analytics", icon: BarChart2, label: "Analytics" },
  ];

  const categories = [
    { label: "Work", emoji: "💼", color: "bg-blue-100 text-blue-700" },
    { label: "Personal", emoji: "👤", color: "bg-green-100 text-green-700" },
    { label: "Health", emoji: "❤️", color: "bg-red-100 text-red-700" },
    { label: "Finance", emoji: "💰", color: "bg-yellow-100 text-yellow-700" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 
          shadow-lg z-40 transition-transform duration-300 pt-16
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static 
          lg:shadow-none lg:pt-0`}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <X size={18} />
        </button>

        <div className="p-4 overflow-y-auto h-full">
          {/* Navigation */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Menu
            </p>
            <nav className="space-y-1">
              {navItems.map(({ to, icon: Icon, label, count }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm 
                    font-medium transition-all duration-150 group
                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {label}
                  </div>
                  {count !== undefined && count > 0 && (
                    <span
                      className="bg-indigo-100 text-indigo-700 text-xs font-semibold 
                      px-2 py-0.5 rounded-full"
                    >
                      {count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Categories
            </p>
            <div className="space-y-1">
              {categories.map(({ label, emoji, color }) => (
                <NavLink
                  key={label}
                  to={`/tasks?category=${label.toLowerCase()}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                    font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${color}`}
                  >
                    {emoji}
                  </span>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Settings */}
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
              font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
