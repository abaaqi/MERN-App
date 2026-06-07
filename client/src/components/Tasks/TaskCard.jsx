import { useState } from "react";
import {
  Calendar,
  Trash2,
  Edit,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import {
  formatDate,
  isOverdue,
  getPriorityConfig,
  getStatusConfig,
  getCategoryIcon,
} from "../../utils/helpers";

const TaskCard = ({ task, onEdit }) => {
  const { deleteTask, updateTaskStatus } = useTasks();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const overdue = isOverdue(task.dueDate, task.status);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this task?")) return;
    setDeleting(true);
    await deleteTask(task._id);
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    updateTaskStatus(task._id, e.target.value);
  };

  const statuses = [
    { value: "todo", label: "📋 To Do" },
    { value: "in-progress", label: "⚡ In Progress" },
    { value: "review", label: "👀 Review" },
    { value: "done", label: "✅ Done" },
  ];

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md 
        transition-all duration-200 overflow-hidden group
        ${deleting ? "opacity-50 scale-95" : ""}
        ${task.status === "done" ? "opacity-75" : ""}
        ${overdue ? "border-red-200" : "border-gray-100"}`}
    >
      {/* Priority color bar */}
      <div
        className={`h-1 w-full ${
          task.priority === "urgent"
            ? "bg-red-500"
            : task.priority === "high"
              ? "bg-orange-500"
              : task.priority === "medium"
                ? "bg-yellow-500"
                : "bg-green-500"
        }`}
      />

      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">
                {getCategoryIcon(task.category)}
              </span>
              <h3
                className={`font-semibold text-gray-800 truncate text-sm
                  ${task.status === "done" ? "line-through text-gray-400" : ""}`}
              >
                {task.title}
              </h3>
            </div>
          </div>

          {/* Actions (visible on hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 
                hover:text-indigo-600 transition-colors"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 
                hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 
                  rounded-md text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-3">
          {/* Status Selector */}
          <select
            value={task.status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs font-semibold px-2 py-1 rounded-lg border 
              cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400
              ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            {/* Priority Badge */}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full
              ${priorityConfig.bg} ${priorityConfig.color}`}
            >
              {priorityConfig.label}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <div
                className={`flex items-center gap-1 text-xs font-medium
                ${overdue ? "text-red-500" : "text-gray-500"}`}
              >
                <Calendar size={12} />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>

        {/* Expand Toggle */}
        {task.comments && task.comments.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="mt-3 w-full flex items-center justify-center gap-1 text-xs 
              text-gray-400 hover:text-gray-600 py-1 hover:bg-gray-50 
              rounded-lg transition-colors"
          >
            <MessageSquare size={12} />
            {task.comments.length} comment
            {task.comments.length !== 1 ? "s" : ""}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}

        {/* Comments Expanded */}
        {expanded && task.comments && (
          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
            {task.comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-indigo-600">
                  {comment.authorName}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
