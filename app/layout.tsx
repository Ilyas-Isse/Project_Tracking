import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/navigation";
import ConvexClientProvider from "./ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Project Tracing",
  description: "A beautiful, distraction-free productivity app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col sm:flex-row bg-zinc-50 dark:bg-[#09090b] transition-colors duration-300 overflow-hidden relative">
        {/* Global Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[hsl(var(--primary))] opacity-10 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-[hsl(var(--accent-rose))] opacity-10 blur-[100px] pointer-events-none z-0"></div>
        
        <ConvexClientProvider>
          <Navigation />
          <main className="flex-1 overflow-y-auto pb-24 sm:pb-0 relative z-10">
            {children}
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
