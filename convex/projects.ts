import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { encryptString, decryptString } from "./crypto";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return []; // Return empty array if not logged in
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to create project");
    }

    const encryptedName = await encryptString(args.name);
    const encryptedDescription = args.description ? await encryptString(args.description) : undefined;
    
    return await ctx.db.insert("projects", { 
      userId: identity.subject,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const project = await ctx.db.get(args.id);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const project = await ctx.db.get(args.id);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    for (const p of projects) {
      const tasks = await ctx.db.query("tasks").withIndex("by_project", q => q.eq("projectId", p._id)).collect();
      for (const t of tasks) {
        await ctx.db.delete(t._id);
      }
      await ctx.db.delete(p._id);
    }
  }
});
