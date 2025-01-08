import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { shards } from "./shards";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const likes = pgTable("likes", {
    shardId: serial("shard_id").references(() => shards.id).primaryKey(),
    likedBy: text("liked_by").references(() => users.id)
}, (table) => [
    index('shard_id_index').onOnly(table.shardId)
])

const likesRelations = relations(likes, ({one}) => ({
    user: one(users, {
        fields: [likes.likedBy],
        references: [users.id]
    })
}))
