import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { shards } from "./shards";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { timestamps } from "../utils/timestamp";

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    shardId: serial("shard_id")
      .references(() => shards.id, { onDelete: "cascade" })
      .notNull(),
    likedBy: text("liked_by")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [index("like_shard_id_index").on(table.shardId)],
);

export const likesRelations = relations(likes, ({ one }) => ({
  shard: one(shards, {
    fields: [likes.shardId],
    references: [shards.id],
  }),
}));
