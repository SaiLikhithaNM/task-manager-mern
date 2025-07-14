import React, { useState, useEffect } from "react";
import axios from "axios";

const baseURL = "http://localhost:4000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    axios.get(baseURL).then((res) => setTasks(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!title) return alert("Task name is required");

    const taskData = { title, description, deadline };

    if (editTask) {
      const res = await axios.put(`${baseURL}/${editTask._id}`, taskData);
      setTasks(tasks.map((t) => (t._id === res.data._id ? res.data : t)));
    } else {
      const res = await axios.post(baseURL, taskData);
      setTasks([...tasks, res.data]);
    }

    setTitle("");
    setDescription("");
    setDeadline("");
    setEditTask(null);
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDeadline(task.deadline ? task.deadline.substring(0, 10) : "");
    setEditTask(task);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${baseURL}/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const handleToggleComplete = async (id, current) => {
    const res = await axios.put(`${baseURL}/${id}`, { completed: !current });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setEditTask(null);
  };

  const isDueSoon = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(dateStr);
    deadline.setHours(0, 0, 0, 0);

    const diff = (deadline - today) / (1000 * 60 * 60 * 24);
    return diff === 0 || diff === 1;
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>🗂️ Task Manager</h2>

      <input
        type="text"
        placeholder="Task Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          display: "block",
          marginBottom: "10px",
          width: "100%",
          height: "60px",
        }}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />

      <button onClick={handleSubmit}>
        {editTask ? "Update Task" : "Add Task"}
      </button>
      {editTask && (
        <button onClick={handleCancel} style={{ marginLeft: "10px" }}>
          Go Back
        </button>
      )}

      <ul style={{ marginTop: "20px", padding: 0, listStyle: "none" }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              marginBottom: "15px",
              backgroundColor: isDueSoon(task.deadline)
                ? "#fff3cd"
                : "#f9f9f9",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <div onClick={() => handleToggleComplete(task._id, task.completed)} style={{ cursor: "pointer" }}>
              <strong style={{ fontSize: "1.1em", textDecoration: task.completed ? "line-through" : "none" }}>
                {task.title}
              </strong>

              {task.description && (
                <p style={{ margin: "4px 0", fontStyle: "italic", color: "#333" }}>
                  {task.description}
                </p>
              )}

              {task.deadline && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85em",
                    color: isDueSoon(task.deadline) ? "red" : "#555",
                  }}
                >
                  📅 Due: {new Date(task.deadline).toLocaleDateString()}
                </p>
              )}
            </div>

            <div style={{ marginTop: "5px" }}>
              <button onClick={() => handleEdit(task)}>✏️ Edit</button>
              <button
                onClick={() => handleDelete(task._id)}
                style={{ marginLeft: "10px" }}
              >
                ❌ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
