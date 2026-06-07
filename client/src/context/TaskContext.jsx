import { createContext, useContext, useState, useCallback } from "react";
import { tasksAPI } from "../services/api";
import toast from "react-hot-toast";

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    search: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const fetchTasks = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const { data } = await tasksAPI.getTasks({ ...filters, ...params });
        setTasks(data.tasks);
        setStats(data.stats);
        setPagination(data.pagination);
      } catch (error) {
        toast.error("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const createTask = async (taskData) => {
    try {
      const { data } = await tasksAPI.createTask(taskData);
      setTasks((prev) => [data.task, ...prev]);
      setStats((prev) => ({
        ...prev,
        [data.task.status]: (prev[data.task.status] || 0) + 1,
        total: (prev.total || 0) + 1,
      }));
      toast.success("Task created! 🎉");
      return { success: true, task: data.task };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
      return { success: false };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const { data } = await tasksAPI.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
      toast.success("Task updated!");
      return { success: true, task: data.task };
    } catch (error) {
      toast.error("Failed to update task");
      return { success: false };
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskToDelete = tasks.find((t) => t._id === id);
      await tasksAPI.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (taskToDelete) {
        setStats((prev) => ({
          ...prev,
          [taskToDelete.status]: Math.max(
            0,
            (prev[taskToDelete.status] || 1) - 1,
          ),
          total: Math.max(0, (prev.total || 1) - 1),
        }));
      }
      toast.success("Task deleted");
      return { success: true };
    } catch (error) {
      toast.error("Failed to delete task");
      return { success: false };
    }
  };

  const updateTaskStatus = async (id, status) => {
    const previousTask = tasks.find((t) => t._id === id);
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      await tasksAPI.updateStatus(id, status);
      if (previousTask) {
        setStats((prev) => ({
          ...prev,
          [previousTask.status]: Math.max(
            0,
            (prev[previousTask.status] || 1) - 1,
          ),
          [status]: (prev[status] || 0) + 1,
        }));
      }
    } catch (error) {
      // Rollback on failure
      setTasks((prev) => prev.map((t) => (t._id === id ? previousTask : t)));
      toast.error("Failed to update status");
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        pagination,
        loading,
        filters,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        updateFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
};
