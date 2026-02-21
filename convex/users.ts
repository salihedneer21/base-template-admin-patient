import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { userRoleValidator } from "./schema";

// Get current user by Better Auth user ID
export const getCurrentUser = query({
  args: { betterAuthUserId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      betterAuthUserId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      role: userRoleValidator,
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_betterAuthUserId", (q) =>
        q.eq("betterAuthUserId", args.betterAuthUserId)
      )
      .unique();
    return user;
  },
});

// Get user by ID
export const getById = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      betterAuthUserId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      role: userRoleValidator,
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// List all users (admin only)
export const listAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      betterAuthUserId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      role: userRoleValidator,
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// List users by role
export const listByRole = query({
  args: { role: userRoleValidator },
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      betterAuthUserId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      role: userRoleValidator,
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

// Create a new user with role
export const create = mutation({
  args: {
    betterAuthUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: userRoleValidator,
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_betterAuthUserId", (q) =>
        q.eq("betterAuthUserId", args.betterAuthUserId)
      )
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      betterAuthUserId: args.betterAuthUserId,
      email: args.email,
      name: args.name,
      role: args.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    return userId;
  },
});

// Update user role (admin only)
export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: userRoleValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// Toggle user active status (admin only)
export const toggleActive = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    await ctx.db.patch(args.userId, {
      isActive: !user.isActive,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const updates: { name?: string; updatedAt: number } = {
      updatedAt: Date.now(),
    };
    if (args.name !== undefined) {
      updates.name = args.name;
    }
    await ctx.db.patch(args.userId, updates);
    return null;
  },
});

// Delete user (admin only)
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Delete associated patient profile if exists
    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (patientProfile) {
      await ctx.db.delete(patientProfile._id);
    }

    await ctx.db.delete(args.userId);
    return null;
  },
});
