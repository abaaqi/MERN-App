import { useEffect, useState, useCallback } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import TaskCard from "./TaskCard";
import TaskFilter from "./TaskFilter";
import TaskForm from "./TaskForm";
import Modal from "../UI/Modal";
import Loader from "../UI/Loader";
import { getStatusConfig } from "../../utils/helpers";

const StatusColumn = ({ status, tasks, onEdit }) => {
  const config = getStatusConfig(status);
  const statusEmojis = {
    todo: "📋",
    "in-progress": "⚡",
    review: "👀",
    done: "✅",
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 min-h-[400px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span>{statusEmojis[status]}</span>
          <h3 className="font-semibold text-gray-700 text-sm">
            {config.label}
          </h3>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full 
            ${config.bg} ${config.color}`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">🌟</p>
            <p className="text-xs">No tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const { tasks, loading, fetchTasks, filters, stats } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [view, setView] = useState("board"); // board | list

  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    fetchTasks();
  };

  // Group tasks by status for board view
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    review: tasks.filter((t) => t.status === "review"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">
            {stats?.total || 0} total tasks • {stats?.done || 0} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="bg-gray-100 rounded-xl p-1 flex">
            {["board", "list"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${
                    view === v
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {v === "board" ? "🗂 Board" : "📋 List"}
              </button>
            ))}
          </div>
          {/* Create Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 
              hover:bg-indigo-700 text-white font-semibold rounded-xl 
              transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <TaskFilter />

      {/* Content */}
      {loading ? (
        <Loader text="Fetching your tasks..." />
      ) : tasks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 mb-6">
            {filters.search || filters.status || filters.priority
              ? "Try adjusting your filters"
              : "Create your first task to get started!"}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 
              text-white rounded-xl hover:bg-indigo-700 font-semibold transition-all"
          >
            <Plus size={18} />
            Create Task
          </button>
        </div>
      ) : view === "board" ? (
        /* Board View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <StatusColumn
              key={status}
              status={status}
              tasks={statusTasks}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingTask ? "Edit Task" : "Create New Task"}
        size="md"
      >
        <TaskForm
          task={editingTask}
          onSuccess={handleSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default TaskBoard;
