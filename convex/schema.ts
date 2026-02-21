import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userRoleValidator = v.union(
  v.literal("admin"),
  v.literal("patient")
);

export type UserRole = "admin" | "patient";

export default defineSchema({
  // User profiles with role-based access
  users: defineTable({
    betterAuthUserId: v.string(), // Links to Better Auth user
    email: v.string(),
    name: v.optional(v.string()),
    role: userRoleValidator,
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_betterAuthUserId", ["betterAuthUserId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),
});
