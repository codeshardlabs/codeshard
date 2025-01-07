import { pgTable, varchar } from "drizzle-orm/pg-core";


export const users = pgTable({
    id: varchar(256).primaryKey(),
    followerId: varchar(256),
    followingId: varchar(256),
})