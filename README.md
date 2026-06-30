# Simple Project Tracing

![Live Demo](https://img.shields.io/badge/Live_Demo-Available-success?style=for-the-badge)

**Live Link:** [https://project-tracking-lyart.vercel.app/](https://project-tracking-lyart.vercel.app/)

## Overview
Simple Project Tracing is a premium, distraction-free productivity application built to help you manage your workspaces, projects, and tasks effectively. It features a beautiful, responsive, and dynamic UI powered by Next.js and Tailwind CSS, with real-time data synchronization and secure data storage using Convex.

### Key Features
- **Project Management:** Create, color-code, and organize your projects with statuses and due dates.
- **Task Kanban Board:** Manage tasks inside your projects using a straightforward To-Do, In Progress, and Done workflow.
- **Real-Time Data:** Changes reflect immediately across all devices thanks to the Convex backend.
- **Enhanced Security:** Application-level AES-GCM encryption is applied to sensitive project and task fields before they are stored in the database.
- **Beautiful UI:** Glassmorphism design, micro-animations, and support for both Light and Dark modes.

## How to Use

1. **Dashboard:** Start by viewing all your existing projects on the main dashboard.
2. **Create a Project:** Click "New Project" to add a workspace. You can set a custom color, description, and due date.
3. **Manage Tasks:** Click on any project card to open its task board. From here, you can add new tasks and set their priority (Low, Medium, High).
4. **Track Progress:** Use the dropdown on a task to move it between "To Do", "In Progress", and "Done" columns.
5. **Update Project Status:** From the project view, you can change the project's overall status (Planning, Active, On Hold, Completed).

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend/Database:** Convex (Serverless Backend)
- **Deployment:** Vercel
