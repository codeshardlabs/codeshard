import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";


export const users = pgTable({
    id: text("id").primaryKey(),
    // actual database foregin key constraints
    followerId: text("follower_id").references(() => users.id),
    followingId: text("following_id").references(() => users.id)
})

// application level abstraction
export const usersRelations = relations(users, ({one, many}) => ({
    follower: one(users, {
        fields: [users.followerId],
        references: [users.id]
    }),
    following: one(users, {
        fields: [users.followingId],
        references: [users.id]
    }),
    shards: many(shards)
}))
