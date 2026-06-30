import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createTask, updateTask } from "../../services/taskService";

function TaskForm({
  onTaskCreated,
  editingTask,
  setEditingTask,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate
          ? editingTask.dueDate.split("T")[0]
          : "",
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);

        toast.success("Task Updated Successfully");

        setEditingTask(null);
      } else {
        await createTask(formData);

        toast.success("Task Created Successfully");
      }

      resetForm();
      onTaskCreated();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editingTask ? "✏️ Edit Task" : "➕ Add New Task"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Task Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Priority, Status, Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          {editingTask && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                resetForm();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-white px-8 py-3 rounded-xl font-semibold shadow-md"
          >
            {editingTask ? "Update Task" : "+ Add Task"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default TaskForm;