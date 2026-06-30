import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { encryptString, decryptString } from "./crypto";

async function verifyProjectOwner(ctx: any, projectId: any, userId: string) {
  const project = await ctx.db.get(projectId);
  if (!project || project.userId !== userId) {
    throw new Error("Unauthorized");
  }
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    return [];
  },
});

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== identity.subject) return [];

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    await verifyProjectOwner(ctx, args.projectId, identity.subject);

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Not found");
    
    await verifyProjectOwner(ctx, task.projectId, identity.subject);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const task = await ctx.db.get(args.id);
    if (!task) return;
    
    await verifyProjectOwner(ctx, task.projectId, identity.subject);
    await ctx.db.delete(args.id);
  },
});
