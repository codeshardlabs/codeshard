
import { relations } from "drizzle-orm";
import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { timestamps } from "../utils/timestamp";
import { shards } from "./shards";

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	message: text('message'),
	userId: text('user_id').references(() => users.id),
	parentId: serial('parent_id').references(() => comments.id),
	shardId: serial('shard_id').references(() => shards.id),
	...timestamps
}, (table) => [
	index('comm_shard_id_index').on(table.shardId)
]);

export const commentsRelations = relations(comments, ({ one }) => ({
	user: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
	parent: one(comments, {
		fields: [comments.parentId],
		references: [comments.id]
	})
}));

