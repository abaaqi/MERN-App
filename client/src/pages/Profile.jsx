import { useState } from "react";
import { User, Mail, Edit, Save, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { stats } = useTasks();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile({ name });
    if (result.success) setEditing(false);
    setLoading(false);
  };

  const completionRate = stats?.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
            />
          </div>

          {/* Name */}
          {editing ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={loading}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                {loading ? "..." : <Save size={16} />}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setName(user?.name);
                }}
                className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <Edit size={15} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-500">
            <Mail size={16} />
            <span className="text-sm">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Task Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats?.total || 0, emoji: "📊" },
            { label: "Completed", value: stats?.done || 0, emoji: "✅" },
            {
              label: "In Progress",
              value: stats?.["in-progress"] || 0,
              emoji: "⚡",
            },
            { label: "Completion", value: `${completionRate}%`, emoji: "🎯" },
          ].map(({ label, value, emoji }) => (
            <div key={label} className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-2xl font-bold text-gray-800">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500 text-sm">Account Type</span>
            <span
              className="text-sm font-medium capitalize text-gray-800 
              bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg"
            >
              {user?.role}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500 text-sm">Member Since</span>
            <span className="text-sm font-medium text-gray-800">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
