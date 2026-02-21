import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

const genderValidator = v.union(
  v.literal("male"),
  v.literal("female"),
  v.literal("other"),
  v.literal("prefer_not_to_say")
);

const patientProfileValidator = v.object({
  _id: v.id("patientProfiles"),
  _creationTime: v.number(),
  userId: v.id("users"),
  firstName: v.string(),
  lastName: v.string(),
  dob: v.optional(v.string()),
  gender: v.optional(genderValidator),
  phone: v.optional(v.string()),
  address: v.optional(v.string()),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  zip: v.optional(v.string()),
  emergencyContactName: v.optional(v.string()),
  emergencyContactPhone: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

// Get patient profile by user ID
export const getByUserId = query({
  args: { userId: v.id("users") },
  returns: v.union(patientProfileValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

// Get patient profile by ID
export const getById = query({
  args: { profileId: v.id("patientProfiles") },
  returns: v.union(patientProfileValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.profileId);
  },
});

// List all patient profiles (admin only)
export const listAll = query({
  args: {},
  returns: v.array(patientProfileValidator),
  handler: async (ctx) => {
    return await ctx.db.query("patientProfiles").collect();
  },
});

// Create patient profile
export const create = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    dob: v.optional(v.string()),
    gender: v.optional(genderValidator),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zip: v.optional(v.string()),
    emergencyContactName: v.optional(v.string()),
    emergencyContactPhone: v.optional(v.string()),
  },
  returns: v.id("patientProfiles"),
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("patientProfiles", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update patient profile
export const update = mutation({
  args: {
    profileId: v.id("patientProfiles"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dob: v.optional(v.string()),
    gender: v.optional(genderValidator),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zip: v.optional(v.string()),
    emergencyContactName: v.optional(v.string()),
    emergencyContactPhone: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { profileId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    await ctx.db.patch(profileId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
    return null;
  },
});
