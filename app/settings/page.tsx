"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

export default function Settings() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const clearDatabase = useMutation(api.projects.clearAll);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("antigravity_pm_theme");
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  }, []);

  const selectTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("antigravity_pm_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const clearData = async () => {
    if (window.confirm("Are you sure you want to delete ALL projects and tasks from the database? This cannot be undone.")) {
      try {
        await clearDatabase();
        alert("All database data has been cleared.");
      } catch (err) {
        alert("Failed to clear database.");
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-full flex flex-col items-center p-4 sm:p-8 animate-slide-up">
      <div className="w-full max-w-2xl mt-12">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-rose))]">
          Settings
        </h1>
        
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-lg space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-zinc-200 dark:border-zinc-800/50 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">Appearance</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Select your preferred theme</p>
            </div>
            
            <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl gap-1">
              <button 
                onClick={() => selectTheme("light")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-medium ${
                  theme === "light" 
                    ? "bg-white text-zinc-900 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                }`}
              >
                <SunIcon className="w-4 h-4" /> Light
              </button>
              <button 
                onClick={() => selectTheme("dark")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-medium ${
                  theme === "dark" 
                    ? "bg-zinc-700 text-white shadow-sm" 
                    : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/50"
                }`}
              >
                <MoonIcon className="w-4 h-4" /> Dark
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">Danger Zone</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Permanently delete all workspaces from the Convex DB</p>
            </div>
            <button 
              onClick={clearData}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors font-medium"
            >
              <TrashIcon className="w-5 h-5" /> Clear Data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
