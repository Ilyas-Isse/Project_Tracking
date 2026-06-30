import { mutation } from "./_generated/server";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();

    if (user !== null) {
      // Update if details changed
      if (user.name !== identity.name || user.email !== identity.email) {
        await ctx.db.patch(user._id, { name: identity.name, email: identity.email });
      }
      return user._id;
    }

    // New user
    return await ctx.db.insert("users", {
      userId: identity.subject,
      name: identity.name,
      email: identity.email,
    });
  },
});
