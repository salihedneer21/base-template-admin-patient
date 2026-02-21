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

  // Patient-specific profile data (only for users with patient role)
  patientProfiles: defineTable({
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    dob: v.optional(v.string()), // ISO date string (YYYY-MM-DD)
    gender: v.optional(
      v.union(
        v.literal("male"),
        v.literal("female"),
        v.literal("other"),
        v.literal("prefer_not_to_say")
      )
    ),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zip: v.optional(v.string()),
    emergencyContactName: v.optional(v.string()),
    emergencyContactPhone: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
});
