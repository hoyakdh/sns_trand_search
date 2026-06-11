import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const analysisCache = sqliteTable("analysis_cache", {
  username: text("username").primaryKey(),
  result: text("result").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const shareLinks = sqliteTable("share_links", {
  token: text("token").primaryKey(),
  username: text("username").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
