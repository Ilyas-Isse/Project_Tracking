"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Analytics() {
  const projects = useQuery(api.projects.get);
  const tasks = useQuery(api.tasks.get);

  if (projects === undefined || tasks === undefined) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent animate-spin"></div>
          <p className="text-zinc-500 font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const highPriority = tasks.filter(t => t.priority === "high" && t.status !== "done").length;

  return (
    <div className="min-h-full flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl mt-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-rose))]">
          Analytics Dashboard
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Projects" value={totalProjects} color="var(--primary)" />
          <StatCard title="Total Tasks" value={totalTasks} color="var(--accent-emerald)" />
          <StatCard title="In Progress" value={inProgressTasks} color="var(--accent-amber)" />
          <StatCard title="Completion Rate" value={`${completionRate}%`} color="var(--accent-blue)" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-zinc-800 dark:text-zinc-100">Overall Progress</h2>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-emerald))] transition-all duration-1000 ease-out"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-sm font-medium">You have completed {completedTasks} out of {totalTasks} tasks.</p>
          </div>

          <div className="glass rounded-3xl p-8 shadow-lg flex flex-col justify-center border-t-4 border-[hsl(var(--accent-rose))]">
            <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-100">Priority Insights</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-4">You have <strong className="text-rose-500">{highPriority}</strong> high priority tasks remaining.</p>
            {highPriority > 0 && <p className="text-sm text-zinc-400">Time to focus and clear them out!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <div className="glass rounded-3xl p-6 flex flex-col items-start justify-center shadow-md relative overflow-hidden group hover:scale-[1.02] transition-transform">
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 transition-transform group-hover:scale-150" style={{ background: `hsl(${color})` }}></div>
      <p className="text-zinc-500 dark:text-zinc-400 font-semibold mb-2 relative z-10">{title}</p>
      <p className="text-4xl font-bold relative z-10 text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}
