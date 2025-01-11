import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { shards } from "./shards";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { timestamps } from "../utils/timestamp";

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    shardId: serial("shard_id").references(() => shards.id),
    likedBy: text("liked_by").references(() => users.id),
    ...timestamps,
  },
  (table) => [index("like_shard_id_index").on(table.shardId)],
);

const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.likedBy],
    references: [users.id],
  }),
}));
