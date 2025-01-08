// import mongoose from "mongoose";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/postgres-js";

const client = neon(process.env.DATABASE_URL);

 export const db = drizzle(client);
