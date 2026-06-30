"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
);

const PRESET_COLORS = [
  "250 84% 54%", // Primary Indigo
  "343 81% 59%", // Rose
  "38 92% 50%",  // Amber
  "142 71% 45%", // Emerald
  "217 91% 60%", // Blue
  "280 65% 60%", // Purple
];

export default function Projects() {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);
  const removeProject = useMutation(api.projects.remove);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectDueDate, setNewProjectDueDate] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  if (projects === undefined) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent animate-spin"></div>
          <p className="text-zinc-500 font-medium">Loading Projects...</p>
        </div>
      </div>
    );
  }

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    await createProject({
      name: newProjectName.trim(),
      color: selectedColor,
      description: newProjectDesc.trim() || undefined,
      dueDate: newProjectDueDate ? new Date(newProjectDueDate).getTime() : undefined,
    });
    
    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectDueDate("");
    setIsModalOpen(false);
  };

  const deleteProject = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this project and all its tasks?")) {
      await removeProject({ id: id as Id<"projects"> });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30";
      case "on-hold": return "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30";
      case "completed": return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
      default: return "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800"; // planning
    }
  };

  return (
    <div className="min-h-full p-4 sm:p-8 animate-slide-up">
      <div className="max-w-6xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-rose))] mb-2">
              Projects
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage all your workspaces.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[hsl(var(--primary))] text-white rounded-xl shadow-lg shadow-[hsl(var(--primary))]/30 hover:scale-105 transition-transform font-semibold"
          >
            <PlusIcon className="w-5 h-5" /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Link key={project._id} href={`/projects/${project._id}`} className="group relative flex flex-col glass rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden border-t-4" style={{ borderTopColor: `hsl(${project.color})` }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-10 -mt-10 transition-transform group-hover:scale-150 pointer-events-none" style={{ background: `hsl(${project.color})` }}></div>
              
              <div className="flex justify-between items-start mb-2 relative z-10">
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{project.name}</h2>
                {project.status && (
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                )}
              </div>
              
              {project.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 relative z-10">{project.description}</p>
              )}

              <div className="mt-auto pt-4 flex items-center justify-between relative z-10">
                <div className="text-xs font-semibold text-zinc-400">
                  {project.dueDate ? `Due ${new Date(project.dueDate).toLocaleDateString()}` : "No due date"}
                </div>
                <p className="text-[hsl(var(--primary))] text-sm font-bold group-hover:translate-x-1 transition-transform">Open &rarr;</p>
              </div>
              
              <button 
                onClick={(e) => deleteProject(e, project._id)}
                className="absolute bottom-6 right-16 p-2 rounded-lg bg-white/50 dark:bg-black/20 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full glass rounded-3xl p-12 flex flex-col items-center justify-center text-zinc-400 border-dashed border-2 border-zinc-300 dark:border-zinc-700">
              <FolderIcon className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-medium text-lg">No projects found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-3xl p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6">Create New Project</h2>
            <form onSubmit={addProject}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-2">Project Name *</label>
                <input 
                  type="text" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] text-zinc-900 dark:text-white font-medium shadow-inner"
                  placeholder="e.g. Website Redesign"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-2">Description</label>
                <textarea 
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] text-zinc-900 dark:text-white font-medium shadow-inner min-h-[80px]"
                  placeholder="Brief details about the project..."
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-2">Due Date</label>
                <input 
                  type="date" 
                  value={newProjectDueDate}
                  onChange={(e) => setNewProjectDueDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] text-zinc-900 dark:text-white font-medium shadow-inner"
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-3">Project Color</label>
                <div className="flex gap-3">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-offset-2 dark:ring-offset-black ring-[hsl(var(--primary))]' : 'hover:scale-110'}`}
                      style={{ backgroundColor: `hsl(${color})` }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-xl text-zinc-500 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                <button type="submit" disabled={!newProjectName.trim()} className="px-5 py-2 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold shadow-md hover:bg-[hsl(var(--primary-hover))] disabled:opacity-50 transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
