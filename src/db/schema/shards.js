import { serial } from "drizzle-orm/mysql-core";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

const templateTypeEnum = pgEnum('template_type', [
    "static",
    "angular",
    "react",
    "react-ts",
    "solid",
    "svelte",
    "test-ts",
    "vanilla-ts",
    "vanilla",
    "vue",
    "vue-ts",
    "node",
    "nextjs",
    "astro",
    "vite",
    "vite-react",
    "vite-react-ts",
])

const modeEnum = pgEnum('mode', [
    'normal',
    'collaboration'
]);

const typeEnum = pgEnum('type', [
    'public',
    'private',
    'forked'
]);

export const shards = pgTable("shards", {
    id: serial().primaryKey(),
    title: varchar(256),
    userId: varchar(256),
    templateType: templateTypeEnum(),
    mode: modeEnum().default("normal"),
    type: typeEnum().default("public")
});