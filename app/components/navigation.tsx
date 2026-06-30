"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);

const FocusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

export default function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize theme globally
    const savedTheme = localStorage.getItem("antigravity_pm_theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const navItems = [
    { href: "/", label: "Dashboard", icon: DashboardIcon },
    { href: "/projects", label: "Projects", icon: FolderIcon },
    { href: "/analytics", label: "Analytics", icon: ChartIcon },
    { href: "/focus", label: "Focus", icon: FocusIcon },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  if (!mounted) return null;

  return (
    <nav className="w-full sm:w-24 lg:w-64 flex-shrink-0 border-t sm:border-t-0 sm:border-r border-zinc-200 dark:border-zinc-800/60 bg-white/70 dark:bg-black/40 backdrop-blur-3xl z-50 flex flex-row sm:flex-col justify-around sm:justify-start pt-2 sm:pt-10 pb-4 sm:pb-8 px-2 sm:px-4 gap-1 sm:gap-6 fixed bottom-0 sm:relative sm:h-screen shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:shadow-none">
      <div className="hidden lg:flex items-center gap-3 px-4 mb-8 mt-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-rose))] flex items-center justify-center shadow-lg shadow-[hsl(var(--primary))]/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400">Simple Project Tracing</span>
      </div>

      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === "/projects" && pathname.startsWith("/projects"));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center justify-center lg:justify-start gap-4 px-2 py-3 lg:px-5 lg:py-4 rounded-2xl transition-all duration-300 ${
              isActive 
                ? "bg-white dark:bg-zinc-800 shadow-sm text-[hsl(var(--primary))] scale-[1.02] border border-zinc-100 dark:border-zinc-700/50" 
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/40 border border-transparent"
            }`}
          >
            <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-110"}`} />
            <span className={`hidden lg:block font-semibold tracking-wide text-sm ${isActive ? "text-zinc-900 dark:text-white" : ""}`}>{item.label}</span>
          </Link>
        );
      })}

      <div className="hidden lg:flex flex-1 flex-col justify-end items-start px-2 mt-auto">
        <SignedIn>
          <div className="flex items-center w-full py-3 px-3 hover:bg-white/50 dark:hover:bg-zinc-800/40 rounded-2xl transition-all duration-300">
            <UserButton showName appearance={{ elements: { userButtonBox: "flex-row-reverse w-full justify-between", userButtonOuterIdentifier: "text-zinc-700 dark:text-zinc-200 font-semibold" } }} />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full bg-[hsl(var(--primary))] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-[hsl(var(--primary))]/20 hover:scale-[1.02] transition-transform">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
      
      {/* Mobile Auth Button */}
      <div className="sm:hidden flex items-center justify-center pl-2 border-l border-zinc-200 dark:border-zinc-800">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[hsl(var(--primary))] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}
