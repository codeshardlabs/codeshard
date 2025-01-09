// import mongoose from "mongoose";
import * as commentSchema from "@/db/schema/comments";
import * as dependencySchema from "@/db/schema/dependencies";
import * as fileSchema from "@/db/schema/files";
import * as likeSchema from "@/db/schema/likes";
import * as shardSchema from "@/db/schema/shards";
import * as userSchema from "@/db/schema/users";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/postgres-js";


const client = neon(process.env.DATABASE_URL);

 export const db = drizzle(client, {
    schema: {
        ...userSchema,
        ...commentSchema,
        ...dependencySchema,
        ...fileSchema,
        ...likeSchema,
        ...shardSchema
    }
 });
