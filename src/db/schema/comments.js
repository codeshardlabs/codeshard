
import { relations } from "drizzle-orm";
import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { shards } from "./shards";
import { users } from "./users";

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	message: text('message'),
	userId: text('user_id').references(() => users.id),
	parentId: serial('parent_id').references(() => comments.id),
	shardId: serial('shard_id').references(() => shards.id),
}, (table) => [
	index('shard_id_index').onOnly(table.shardId)
]);

export const commentsRelations = relations(comments, ({ one }) => ({
	user: one(users, {
		fields: [comments.userId],
		references: [shards.id],
	}),
	parent: one(comments, {
		fields: [comments.parentId],
		references: [comments.id]
	})
}));

