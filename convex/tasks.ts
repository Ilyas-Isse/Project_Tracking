import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { encryptString, decryptString } from "./crypto";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    return await Promise.all(tasks.map(async (t) => ({
      ...t,
      title: await decryptString(t.title)
    })));
  },
});

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks").withIndex("by_project", q => q.eq("projectId", args.projectId)).collect();
    return await Promise.all(tasks.map(async (t) => ({
      ...t,
      title: await decryptString(t.title)
    })));
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const encryptedTitle = await encryptString(args.title);
    return await ctx.db.insert("tasks", {
      projectId: args.projectId,
      title: encryptedTitle,
      status: "todo",
      priority: args.priority,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
