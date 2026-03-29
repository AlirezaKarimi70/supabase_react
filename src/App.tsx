import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { supabase } from './lib/supabase-client'

function App() {
  const [newTask, setNewTask] = useState({ title: "", description: "" })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("tasks").insert(newTask).single();
    if (error) {
      console.error("Error inserting task:", error);
    } else {
      setNewTask({ title: "", description: "" });
      console.log("Task inserted successfully");
    }
  }
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
            <li style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Task 1:</strong> Description of Task 1
              </div>
              <div>
                <button style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: "4px" }}>Edit</button>
                <button style={{ padding: "0.25rem 0.5rem", backgroundColor: "#DC3545", color: "#fff", border: "none", borderRadius: "4px" }}>Delete</button>
              </div>
            </li>
            <li style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Task 2:</strong> Description of Task 2
              </div>
              <div>
                <button style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: "4px" }}>Edit</button>
                <button style={{ padding: "0.25rem 0.5rem", backgroundColor: "#DC3545", color: "#fff", border: "none", borderRadius: "4px" }}>Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
