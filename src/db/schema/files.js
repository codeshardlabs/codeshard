
import { boolean, index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { shards } from "./shards";


export const files = pgTable("files", {
    id: serial("id").primaryKey(),
    name: text("name"),
    code: text("name"),
    readOnly: boolean("read_only").default(false),
    hidden: boolean("hidden").default(false),
    shardId: serial("shard_id").references(() => shards.id)
}, (table) => [
    index('shard_id_index').onOnly(table.shardId)
]);

