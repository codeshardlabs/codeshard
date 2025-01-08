
import { pgTable, text, boolean, serial, index } from "drizzle-orm/pg-core";
import { shards } from "./shards";

export const dependencies = pgTable("dependencies", {
    id: serial("id").primaryKey(),
    name: text("name"),
    version: text("version"),
    isDevDependency : boolean("is_dev_dependency"),
    shardId: serial("shard_id").references(() => shards.id)
}, (table) => [
    index('shard_id_index').onOnly(table.shardId)
]);
