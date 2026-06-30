import { toast } from "react-toastify";
import { deleteTask } from "../../services/taskService";
import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaFlag,
} from "react-icons/fa";

function TaskList({ tasks, onTaskDeleted, onEdit }) {
  const priorityColors = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-600",
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(id);

      toast.success("Task Deleted Successfully");

      onTaskDeleted();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />

        <h2 className="text-2xl font-bold text-gray-700">
          No Tasks Found
        </h2>

        <p className="text-gray-500 mt-2">
          Create your first task to stay organized 🚀
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        My Tasks
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {task.title}
            </h3>

            <p className="text-gray-500 leading-relaxed">
              {task.description || "No Description"}
            </p>

            <div className="flex justify-between items-center mt-5">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColors[task.priority]}`}
              >
                <FaFlag className="inline mr-1" />
                {task.priority}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[task.status]}`}
              >
                {task.status}
              </span>
            </div>

            <p className="mt-5 flex items-center gap-2 text-gray-500 text-sm">
              <FaCalendarAlt />
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No Due Date"}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onEdit(task)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 hover:scale-105 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                <FaEdit />
                Edit
              </button>

              <button
                onClick={() => handleDelete(task._id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;