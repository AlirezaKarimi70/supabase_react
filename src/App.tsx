import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { supabase } from './lib/supabase-client'
interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
}
function App() {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("tasks").insert(newTask).single();
    if (error) {
      console.error("Error inserting task:", error);
      return
    } else {
      setNewTask({ title: "", description: "" });
      console.log("Task inserted successfully");
    }
  }
  const fetchTasks = async () => {
    const { error, data } = await supabase.from("tasks").select("*").order("created_at", { ascending: true });
    if (error) {
      console.error("Error reading task:", error);
      return
    } else {
      setTasks(data);
      console.log("Tasks fetched successfully");
    }
  }

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Error deleting task:", error);
      return
    } else {

      console.log("Task deleted successfully");
    }
  }
  const updateTask = async (id: number, updatedTask: { title: string; description: string }) => {
    const { error } = await supabase.from("tasks").update(updatedTask).eq("id", id);
    if (error) {
      console.error("Error updating task:", error);
      return;
    } else {
      console.log("Task updated successfully");
    }
  }
  useEffect(() => { fetchTasks() }, []);
  return (
    <>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
        <h2> Task Manager Crud</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <input type="text"
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, title: e.target.value }))

            }
            placeholder='Enter Task' style={{ padding: "0.5rem", width: "100%", marginBottom: "0.5rem" }} />
          <textarea
            placeholder='Enter Description'
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, description: e.target.value }))

            }
            style={{ padding: "0.5rem", width: "100%", marginBottom: "0.5rem" }}></textarea>
          <button type='submit' style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}>Add Task</button>
        </form>
        {/* Task List */}
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "4px" }}>
          <h3>Task List</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {tasks.map((task) => (
              <li key={task.id} style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{task.title}:</strong> {task.description}
                </div>
                <div>
                  <button style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: "4px" }}
                    onClick={() => updateTask(task.id, { title: "Updated Title", description: "Updated Description" })}
                  >Edit</button>
                  <button style={{ padding: "0.25rem 0.5rem", backgroundColor: "#DC3545", color: "#fff", border: "none", borderRadius: "4px" }} onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
            }

          </ul>
        </div>
      </div>
    </>
  )

}
export default App
