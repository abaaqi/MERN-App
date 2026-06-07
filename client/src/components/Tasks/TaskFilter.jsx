import { Search, Filter, X, SortAsc, SortDesc } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { PRIORITIES, CATEGORIES } from "../../utils/helpers";

const TaskFilter = () => {
  const { filters, updateFilters, fetchTasks } = useTasks();

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    updateFilters(newFilters);
    // Debounced search is handled by useEffect in parent
  };

  const clearFilters = () => {
    updateFilters({
      status: "",
      priority: "",
      category: "",
      search: "",
      sortBy: "createdAt",
      order: "desc",
    });
  };

  const hasActiveFilters =
    filters.status || filters.priority || filters.category || filters.search;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl 
              text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
              bg-gray-50 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            bg-gray-50 text-gray-700 min-w-[130px]"
        >
          <option value="">All Status</option>
          <option value="todo">📋 To Do</option>
          <option value="in-progress">⚡ In Progress</option>
          <option value="review">👀 Review</option>
          <option value="done">✅ Done</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            bg-gray-50 text-gray-700 min-w-[130px]"
        >
          <option value="">All Priority</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            bg-gray-50 text-gray-700 min-w-[130px]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 
              bg-gray-50 text-gray-700"
          >
            <option value="createdAt">Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() =>
              handleChange("order", filters.order === "desc" ? "asc" : "desc")
            }
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 
              text-gray-600 transition-colors"
          >
            {filters.order === "desc" ? (
              <SortDesc size={16} />
            ) : (
              <SortAsc size={16} />
            )}
          </button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-600 
              hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
