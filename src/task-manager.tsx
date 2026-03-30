import React, { useEffect, useState, type ChangeEvent } from 'react'
import { supabase } from './lib/supabase-client'
import type { Session } from '@supabase/supabase-js';
interface Task {
    id: number;
    title: string;
    description: string;
    created_at: string;
}
const TaskManager = ({ session }: { session: Session }) => {
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskImage, setTaskImage] = useState<File | null>(null);

    const uploadImage = async (file: File): Promise<string | null> => {
        const filePath = `${file.name}-${Date.now()}`;

        const { error } = await supabase.storage
            .from("task-images")
            .upload(filePath, file);

        if (error) {
            console.error("Error uploading image:", error.message);
            return null;
        }

        const { data } = await supabase.storage
            .from("task-images")
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let imageUrl: string | null = null;
        if (taskImage) {
            imageUrl = await uploadImage(taskImage);
        }
        const { error, data } = await supabase.from("tasks")
            .insert({ ...newTask, email: session.user.email, user_id: session.user.id, image_url: imageUrl }).select().single();
        if (error) {
            console.error("Error inserting task:", error);
            return
        } else {
            // setTasks((prev) => [...prev, data])
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
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setTaskImage(e.target.files[0]);
        }
    };
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
                    <input type="file" accept="image/*" onChange={handleFileChange} />
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

export default TaskManager