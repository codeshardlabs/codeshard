
import { relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { shards } from "./shards";

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	message: text('message'),
	userId: integer('user_id'),
	shardId: integer('shard_id'),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(shards, {
		fields: [comments.shardId],
		references: [shards.id],
	}),
}));

