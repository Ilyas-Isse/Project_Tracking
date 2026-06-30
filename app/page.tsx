"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Dashboard() {
  const projects = useQuery(api.projects.get);
  const tasks = useQuery(api.tasks.get);

  if (projects === undefined || tasks === undefined) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent animate-spin"></div>
          <p className="text-zinc-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => t.status !== "done");
  const recentProjects = [...projects].reverse().slice(0, 3);

  return (
    <div className="min-h-full p-4 sm:p-8 animate-slide-up">
      <div className="max-w-5xl mx-auto mt-6">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-rose))]">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 font-medium">Here's what's happening across your projects.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Tasks Widget */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Your Active Tasks</h2>
              <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-3 py-1 rounded-full text-sm font-bold">{activeTasks.length} pending</span>
            </div>
            
            <div className="glass rounded-3xl p-6 shadow-md space-y-3 min-h-[300px]">
              {activeTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-10">
                  <p>No active tasks! You are all caught up.</p>
                </div>
              ) : (
                activeTasks.map(task => {
                  const project = projects.find(p => p._id === task.projectId);
                  return (
                    <div key={task._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-black/30 border border-zinc-100 dark:border-zinc-800/50 hover:scale-[1.01] transition-transform shadow-sm gap-3">
                      <div>
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-lg">{task.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          {project && (
                            <span className="flex items-center gap-1.5 font-medium" style={{ color: `hsl(${project.color})` }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${project.color})` }}></span>
                              {project.name}
                            </span>
                          )}
                          <span className="text-zinc-400">&bull;</span>
                          <span className={`capitalize font-medium ${task.priority === 'high' ? 'text-rose-500' : task.priority === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>
                      <Link href={`/projects/${task.projectId}`} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-[hsl(var(--primary))] hover:text-white transition-colors text-sm font-semibold text-center whitespace-nowrap">
                        Go to Project
                      </Link>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Recent Projects Widget */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Recent Projects</h2>
              <Link href="/projects" className="text-sm font-semibold text-[hsl(var(--primary))] hover:underline">View all</Link>
            </div>
            
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <div className="glass rounded-3xl p-6 text-center text-zinc-400 shadow-sm">
                  <p className="mb-4 font-medium">No projects yet.</p>
                  <Link href="/projects" className="inline-block px-5 py-3 bg-[hsl(var(--primary))] text-white rounded-xl font-medium shadow-md hover:bg-[hsl(var(--primary-hover))] transition-colors">Create One</Link>
                </div>
              ) : (
                recentProjects.map(project => {
                  const projTasks = tasks.filter(t => t.projectId === project._id);
                  const doneTasks = projTasks.filter(t => t.status === "done").length;
                  const progress = projTasks.length === 0 ? 0 : Math.round((doneTasks / projTasks.length) * 100);
                  
                  return (
                    <Link key={project._id} href={`/projects/${project._id}`} className="block glass rounded-3xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group border-l-4" style={{ borderLeftColor: `hsl(${project.color})` }}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-lg group-hover:text-[hsl(var(--primary))] transition-colors">{project.name}</h3>
                        {project.status && (
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                            project.status === 'active' ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' :
                            project.status === 'on-hold' ? 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30' :
                            project.status === 'completed' ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' :
                            'text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800'
                          }`}>
                            {project.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-medium">{projTasks.length} tasks</p>
                      
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden shadow-inner">
                        <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${progress}%`, backgroundColor: `hsl(${project.color})` }}></div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
