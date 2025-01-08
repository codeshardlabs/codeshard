import { serial } from "drizzle-orm/mysql-core";
import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { comments } from "./comments";
import { dependencies } from "./dependencies";
import { files } from "./files";
import { likes } from "./likes";

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
    id: serial("id").primaryKey(),
    title: text("title"),
    userId: text("user_id").references(() => users.id),
    templateType: templateTypeEnum().default("react"),
    mode: modeEnum().default("normal"),
    type: typeEnum().default("public"),
});

export const postsRelations = relations(shards, ({  many }) => ({
    comments: many(comments),
    files: many(files),
    dependencies: many(dependencies),
    likes: many(likes)
}));
