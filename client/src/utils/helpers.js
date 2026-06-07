import {
  format,
  isToday,
  isTomorrow,
  isPast,
  formatDistanceToNow,
} from "date-fns";

export const formatDate = (date) => {
  if (!date) return "No due date";
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "MMM dd, yyyy");
};

export const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (date, status) => {
  if (!date || status === "done") return false;
  return isPast(new Date(date));
};

export const getPriorityConfig = (priority) => {
  const configs = {
    urgent: {
      label: "Urgent",
      color: "text-red-600",
      bg: "bg-red-100",
      dot: "bg-red-500",
    },
    high: {
      label: "High",
      color: "text-orange-600",
      bg: "bg-orange-100",
      dot: "bg-orange-500",
    },
    medium: {
      label: "Medium",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      dot: "bg-yellow-500",
    },
    low: {
      label: "Low",
      color: "text-green-600",
      bg: "bg-green-100",
      dot: "bg-green-500",
    },
  };
  return configs[priority] || configs.medium;
};

export const getStatusConfig = (status) => {
  const configs = {
    todo: {
      label: "To Do",
      color: "text-gray-600",
      bg: "bg-gray-100",
      border: "border-gray-300",
    },
    "in-progress": {
      label: "In Progress",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-300",
    },
    review: {
      label: "Review",
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-300",
    },
    done: {
      label: "Done",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-300",
    },
  };
  return configs[status] || configs.todo;
};

export const getCategoryIcon = (category) => {
  const icons = {
    work: "💼",
    personal: "👤",
    shopping: "🛒",
    health: "❤️",
    finance: "💰",
    other: "📌",
  };
  return icons[category] || "📌";
};

export const STATUSES = ["todo", "in-progress", "review", "done"];
export const PRIORITIES = ["low", "medium", "high", "urgent"];
export const CATEGORIES = [
  "work",
  "personal",
  "shopping",
  "health",
  "finance",
  "other",
];
