import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar";
import { getTasks, getTaskStats } from "../services/taskService";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import {
  FaTasks,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [taskRes, statsRes] = await Promise.all([
        getTasks(),
        getTaskStats(),
      ]);

      setTasks(taskRes.data.tasks);
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "Newest":
        return new Date(b.createdAt) - new Date(a.createdAt);

      case "Oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);

      case "Due Date":
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);

      case "Priority": {
        const priorityOrder = {
          High: 3,
          Medium: 2,
          Low: 1,
        };

        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      default:
        return 0;
    }
  });
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex flex-col items-center justify-center h-[80vh] gap-5">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>

          <h2 className="text-xl font-semibold text-gray-700">
            Loading Dashboard...
          </h2>

          <p className="text-gray-500">
            Please wait a moment.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Welcome */}

          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8">
            <h1 className="text-4xl font-bold">
              Welcome Back, 👋 {tasks.length > 0 ? "Let's be productive!" : ""}
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              Organize your daily work and stay productive.
            </p>
          </div>

          {/* Stats */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-500">Total Tasks</h2>
              <p className="text-4xl font-bold text-blue-600 mt-3">
                {stats.total}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-500">Pending</h2>
              <p className="text-4xl font-bold text-yellow-500 mt-3">
                {stats.pending}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-500">Completed</h2>
              <p className="text-4xl font-bold text-green-600 mt-3">
                {stats.completed}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-500">In Progress</h2>

              <p className="text-4xl font-bold text-blue-600 mt-3">
                {stats.inProgress}
              </p>
            </div>

          </div>
          <div className="my-8 grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border rounded-xl px-4 py-3 shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-white border rounded-xl px-4 py-3 shadow-sm"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Due Date">Due Date</option>
              <option value="Priority">Priority</option>
            </select>

          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">

            <div className="lg:col-span-2">
              <TaskForm
                onTaskCreated={fetchDashboardData}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
              />
            </div>

            <div className="lg:col-span-3">
              <TaskList
                tasks={sortedTasks}
                onTaskDeleted={fetchDashboardData}
                onEdit={setEditingTask}
              />
            </div>

          </div>
        </div> {/* max-w-7xl */}
      </div>   {/* min-h-screen */}
    </>
  );
}

export default Dashboard;