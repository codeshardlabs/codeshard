import { relations } from "drizzle-orm";
import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { timestamps } from "../utils/timestamp";
import { shards } from "./shards";

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    message: text("message"),
    userId: text("user_id").references(() => users.id),
    shardId: serial("shard_id").references(() => shards.id),
    ...timestamps,
  },
  (table) => [index("comm_shard_id_index").on(table.shardId)],
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  replies: many(replies),
}));

export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  repliedBy: serial("comment_id").references(() => comments.id),
  repliedTo: serial("parent_id").references(() => comments.id),
});

export const repliesRelations = relations(replies, ({ one }) => ({
  comment: one(comments, {
    fields: [replies.repliedBy],
    references: [comments.id],
  }),
}));
