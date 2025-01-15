import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/timestamp";
import { shards } from "./shards";

// users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  ...timestamps,
});

// separate followers join table
export const followers = pgTable("followers", {
  id: text("id").primaryKey(),
  followerId: text("follower_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
  followingId: text("following_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
  ...timestamps,
});

// relations
export const usersRelations = relations(users, ({ many }) => ({
  following: many(followers),
  followers: many(followers),
  shards: many(shards),
}));

export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(users, {
    fields: [followers.followerId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [followers.followingId],
    references: [users.id],
  }),
}));
