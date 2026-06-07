import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import TaskCard from "../components/Tasks/TaskCard";
import Loader from "../components/UI/Loader";

const StatCard = ({ label, value, icon: Icon, color, bgColor, trend }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 
    flex items-center gap-4 hover:shadow-md transition-all`}
  >
    <div
      className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
    >
      <Icon className={color} size={22} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, loading, fetchTasks } = useTasks();

  useEffect(() => {
    fetchTasks({ limit: 6 });
  }, []);

  const recentTasks = tasks.slice(0, 6);
  const completionRate = stats?.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    {
      label: "Total Tasks",
      value: stats?.total || 0,
      icon: CheckSquare,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      label: "In Progress",
      value: stats?.["in-progress"] || 0,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Completed",
      value: stats?.done || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Pending Review",
      value: stats?.review || 0,
      icon: AlertCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 
        text-white shadow-xl shadow-indigo-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-indigo-200 text-sm">
              {stats?.total === 0
                ? "You have no tasks yet. Create your first one!"
                : `You've completed ${completionRate}% of your tasks. Keep it up!`}
            </p>
          </div>
          <div className="hidden md:block">
            <div
              className="w-20 h-20 bg-white/10 rounded-2xl flex items-center 
              justify-center text-4xl backdrop-blur-sm"
            >
              {completionRate >= 80 ? "🏆" : completionRate >= 50 ? "🚀" : "💪"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {stats?.total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-indigo-200 mb-1.5">
              <span>Overall Progress</span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
          <Link
            to="/tasks"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 
              text-sm font-semibold transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading tasks..." />
        ) : recentTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-400 mb-5 text-sm">
              Start by creating your first task
            </p>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 
                text-white rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-all"
            >
              <Plus size={16} />
              Create Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={() => {}} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Status Overview */}
      {stats?.total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Status Overview
          </h2>
          <div className="space-y-3">
            {[
              { label: "To Do", key: "todo", color: "bg-gray-400" },
              {
                label: "In Progress",
                key: "in-progress",
                color: "bg-blue-500",
              },
              { label: "Review", key: "review", color: "bg-purple-500" },
              { label: "Done", key: "done", color: "bg-green-500" },
            ].map(({ label, key, color }) => {
              const count = stats?.[key] || 0;
              const percentage = stats?.total ? (count / stats.total) * 100 : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{label}</span>
                    <span className="text-gray-500">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${color} rounded-full h-2 transition-all duration-700`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
