import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    userId: v.string(), // Clerk user ID
    name: v.string(),
    color: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("planning"), v.literal("active"), v.literal("on-hold"), v.literal("completed")),
    dueDate: v.optional(v.number()), // Unix timestamp
  }).index("by_user", ["userId"]),
  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  }).index("by_project", ["projectId"]),
});
