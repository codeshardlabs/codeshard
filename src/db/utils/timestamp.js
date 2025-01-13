import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updatedAt: timestamp("updated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
};
