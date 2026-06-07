import { useState, useEffect } from "react";
import { Calendar, Tag, AlertCircle } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { PRIORITIES, CATEGORIES } from "../../utils/helpers";

const TaskForm = ({ task, onSuccess, onCancel }) => {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    category: "other",
    dueDate: "",
    tags: [],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        category: task.category || "other",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        tags: task.tags || [],
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag) && formData.tags.length < 5) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    const submitData = {
      ...formData,
      dueDate: formData.dueDate || undefined,
    };

    const result = task
      ? await updateTask(task._id, submitData)
      : await createTask(submitData);

    if (result.success) onSuccess?.();
    setLoading(false);
  };

  const priorityColors = {
    low: "border-green-400 bg-green-50 text-green-700",
    medium: "border-yellow-400 bg-yellow-50 text-yellow-700",
    high: "border-orange-400 bg-orange-50 text-orange-700",
    urgent: "border-red-400 bg-red-50 text-red-700",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="What needs to be done?"
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            bg-gray-50 focus:bg-white transition-all text-gray-800"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add more details about this task..."
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            bg-gray-50 focus:bg-white transition-all text-gray-800 resize-none"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {formData.description.length}/500
        </p>
      </div>

      {/* Status & Priority Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-indigo-500 
              bg-gray-50 focus:bg-white transition-all text-gray-800"
          >
            <option value="todo">📋 To Do</option>
            <option value="in-progress">⚡ In Progress</option>
            <option value="review">👀 Review</option>
            <option value="done">✅ Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`w-full px-3 py-3 border-2 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-indigo-500 
              transition-all font-medium ${priorityColors[formData.priority]}`}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🟠 High</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
        </div>
      </div>

      {/* Category & Due Date Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-indigo-500 
              bg-gray-50 focus:bg-white transition-all text-gray-800"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              Due Date
            </div>
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-3 border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-indigo-500 
              bg-gray-50 focus:bg-white transition-all text-gray-800"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <div className="flex items-center gap-1">
            <Tag size={14} />
            Tags (press Enter to add)
          </div>
        </label>
        <div
          className="border border-gray-200 rounded-xl p-3 bg-gray-50 
          focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 
          focus-within:border-transparent transition-all"
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 
                  text-indigo-700 rounded-lg text-xs font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500 ml-0.5 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder={
              formData.tags.length >= 5 ? "Max 5 tags reached" : "Add a tag..."
            }
            disabled={formData.tags.length >= 5}
            className="w-full bg-transparent outline-none text-sm text-gray-700 
              placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 
            font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white 
            font-semibold rounded-xl transition-all disabled:opacity-60 
            disabled:cursor-not-allowed shadow-lg shadow-indigo-200 
            flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>{task ? "Update Task" : "Create Task"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
