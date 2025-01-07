import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";


export const users = pgTable({
    id: varchar(256).primaryKey(),
    followerId: varchar(256),
    followingId: varchar(256),
})

export const usersRelations = relations(users, ({ one }) => ({
	follower: one(users, {
		fields: [users.followerId],
		references: [users.id],
    }),
    following: one(users, {
        fields: [users.followingId],
        references: [users.id]
    })
}));

