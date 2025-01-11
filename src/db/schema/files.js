import { boolean, index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { shards } from "./shards";
import { timestamps } from "../utils/timestamp";

export const files = pgTable(
  "files",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    code: text("code"),
    readOnly: boolean("read_only").default(false),
    hidden: boolean("hidden").default(false),
    shardId: serial("shard_id").references(() => shards.id),
    ...timestamps,
  },
  (table) => [index("file_shard_id_index").on(table.shardId)],
);
