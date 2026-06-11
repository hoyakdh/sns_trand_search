import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import * as schema from "./schema";

const DB_PATH = join(process.cwd(), "data", "cache.db");

function createDb() {
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(DB_PATH);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS analysis_cache (
      username TEXT PRIMARY KEY,
      result TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `);

  return drizzle(sqlite, { schema });
}

let db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!db) {
    db = createDb();
  }
  return db;
}
