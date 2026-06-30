"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const BackIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

export default function ProjectBoard() {
  const params = useParams();
  const projectId = params.id as Id<"projects">;

  const projects = useQuery(api.projects.get);
  const projectTasks = useQuery(api.tasks.getByProject, { projectId });
  
  const updateProject = useMutation(api.projects.updateProject);
  const createTask = useMutation(api.tasks.create);
  const updateTaskStatus = useMutation(api.tasks.updateStatus);
  const removeTask = useMutation(api.tasks.remove);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");

  if (projects === undefined || projectTasks === undefined) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent animate-spin"></div>
          <p className="text-zinc-500 font-medium">Loading Board...</p>
        </div>
      </div>
    );
  }

  const project = projects.find(p => p._id === projectId);

  if (!project) return <div className="p-8 text-center text-zinc-500">Project not found.</div>;

  const handleProjectStatusChange = async (newStatus: any) => {
    await updateProject({
      id: project._id,
      status: newStatus
    });
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await createTask({
      projectId,
      title: newTaskTitle.trim(),
      priority: newTaskPriority
    });
    
    setNewTaskTitle("");
  };

  const updateStatus = async (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    await updateTaskStatus({
      id: taskId as Id<"tasks">,
      status: newStatus
    });
  };

  const deleteTask = async (taskId: string) => {
    await removeTask({ id: taskId as Id<"tasks"> });
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" }
  ] as const;

  return (
    <div className="min-h-full p-4 sm:p-8 animate-slide-up flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="p-3 glass rounded-xl text-zinc-500 hover:text-[hsl(var(--primary))] transition-colors shadow-sm hover:shadow-md">
            <BackIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3 mb-1">
              <span className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: `hsl(${project.color})` }}></span>
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xl">{project.description}</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
          {project.dueDate && (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Due Date</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {new Date(project.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'})}
              </span>
            </div>
          )}
          
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Status</span>
            <select 
              value={project.status || "planning"}
              onChange={(e) => handleProjectStatusChange(e.target.value)}
              className="text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-[hsl(var(--primary))] cursor-pointer outline-none transition-shadow"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 mb-8 shadow-sm">
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-5 py-3 rounded-xl bg-white/60 dark:bg-black/20 border border-zinc-200 dark:border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] text-zinc-900 dark:text-white font-medium"
          />
          <div className="flex gap-4">
            <select 
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="px-4 py-3 rounded-xl bg-white/60 dark:bg-black/20 border border-zinc-200 dark:border-zinc-700/50 focus:outline-none text-zinc-700 dark:text-zinc-300 font-medium"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button type="submit" disabled={!newTaskTitle.trim()} className="px-5 py-3 rounded-xl bg-[hsl(var(--primary))] text-white font-bold shadow-md hover:bg-[hsl(var(--primary-hover))] transition-colors disabled:opacity-50 whitespace-nowrap">
              Add Task
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {columns.map(col => {
          const colTasks = projectTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="glass rounded-3xl p-5 flex flex-col bg-white/40 dark:bg-black/10 border border-zinc-100 dark:border-zinc-800/40">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-lg uppercase tracking-wide">{col.title}</h3>
                <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold px-2.5 py-1 rounded-full">{colTasks.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                {colTasks.map(task => (
                  <div key={task._id} className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 relative group animate-pop-in hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <p className={`font-semibold text-zinc-800 dark:text-zinc-100 ${task.status === 'done' ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
                        {task.title}
                      </p>
                      <button onClick={() => deleteTask(task._id)} className="text-zinc-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${
                        task.priority === 'high' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 
                        task.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {task.priority}
                      </span>
                      
                      <select 
                        value={task.status}
                        onChange={(e) => updateStatus(task._id, e.target.value as any)}
                        className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-[hsl(var(--primary))] font-medium cursor-pointer"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
