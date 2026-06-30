import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const create = mutation({
  args: { 
    name: v.string(), 
    color: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", { 
      name: args.name, 
      color: args.color,
      description: args.description,
      dueDate: args.dueDate,
      status: "planning" // Default status
    });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    status: v.optional(v.union(v.literal("planning"), v.literal("active"), v.literal("on-hold"), v.literal("completed"))),
    dueDate: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  }
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks").withIndex("by_project", q => q.eq("projectId", args.id)).collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    for (const p of projects) {
      await ctx.db.delete(p._id);
    }
    const tasks = await ctx.db.query("tasks").collect();
    for (const t of tasks) {
      await ctx.db.delete(t._id);
    }
  }
});
