import { boolean, index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { shards } from "./shards";
import { timestamps } from "../utils/timestamp";
import { relations } from "drizzle-orm";

export const files = pgTable(
  "files",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    code: text("code"),
    hash: integer("hash").default(0),
    readOnly: boolean("read_only").default(false),
    hidden: boolean("hidden").default(false),
    shardId: serial("shard_id")
      .references(() => shards.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [index("file_shard_id_index").on(table.shardId)],
);

export const filesRelations = relations(files, ({ one }) => ({
  shard: one(shards, {
    fields: [files.shardId],
    references: [shards.id],
  }),
}));
