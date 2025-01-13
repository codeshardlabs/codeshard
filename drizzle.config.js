import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({
  path: ".env.local",
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
