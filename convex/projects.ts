import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { encryptString, decryptString } from "./crypto";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return await Promise.all(projects.map(async (p) => ({
      ...p,
      name: await decryptString(p.name),
      description: p.description ? await decryptString(p.description) : undefined,
    })));
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
    const encryptedName = await encryptString(args.name);
    const encryptedDescription = args.description ? await encryptString(args.description) : undefined;
    
    return await ctx.db.insert("projects", { 
      name: encryptedName, 
      color: args.color,
      description: encryptedDescription,
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
    const { id, description, ...updates } = args;
    const finalUpdates: any = { ...updates };
    
    if (description !== undefined) {
      finalUpdates.description = await encryptString(description);
    }
    
    await ctx.db.patch(id, finalUpdates);
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
