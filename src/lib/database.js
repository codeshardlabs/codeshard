import * as commentSchema from "@/src/db/schema/comments";
import * as dependencySchema from "@/src/db/schema/dependencies";
import * as fileSchema from "@/src/db/schema/files";
import * as likeSchema from "@/src/db/schema/likes";
import * as shardSchema from "@/src/db/schema/shards";
import * as userSchema from "@/src/db/schema/users";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema: {
    ...userSchema,
    ...commentSchema,
    ...dependencySchema,
    ...fileSchema,
    ...likeSchema,
    ...shardSchema,
  },
});

