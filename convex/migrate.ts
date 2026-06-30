import { mutation } from "./_generated/server";
import { encryptString } from "./crypto";

// Helper to check if a string is already encrypted
// Our encryption format is `hex:hex`
function isEncrypted(text: string) {
  if (!text) return false;
  const parts = text.split(":");
  return parts.length === 2 && /^[0-9a-f]+$/.test(parts[0]) && /^[0-9a-f]+$/.test(parts[1]);
}

export const encryptExistingData = mutation({
  args: {},
  handler: async (ctx) => {
    let encryptedProjectsCount = 0;
    let encryptedTasksCount = 0;

    // Encrypt Projects
    const projects = await ctx.db.query("projects").collect();
    for (const project of projects) {
      const updates: any = {};
      if (project.name && !isEncrypted(project.name)) {
        updates.name = await encryptString(project.name);
      }
      if (project.description && !isEncrypted(project.description)) {
        updates.description = await encryptString(project.description);
      }
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(project._id, updates);
        encryptedProjectsCount++;
      }
    }

    // Encrypt Tasks
    const tasks = await ctx.db.query("tasks").collect();
    for (const task of tasks) {
      const updates: any = {};
      if (task.title && !isEncrypted(task.title)) {
        updates.title = await encryptString(task.title);
      }
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(task._id, updates);
        encryptedTasksCount++;
      }
    }

    return {
      message: "Migration completed successfully.",
      encryptedProjects: encryptedProjectsCount,
      encryptedTasks: encryptedTasksCount,
    };
  },
});
