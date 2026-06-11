import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { shareLinks } from "./db/schema";
import { getCachedResult } from "./cache";
import type { AnalysisResult } from "./types";

const SHARE_TTL_DAYS = 7;

function generateToken(): string {
  return randomBytes(16).toString("hex");
}

export async function createShareLink(username: string): Promise<string | null> {
  const result = await getCachedResult(username);
  if (!result) return null;

  const db = getDb();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SHARE_TTL_DAYS * 24 * 60 * 60 * 1000);
  const token = generateToken();

  await db.insert(shareLinks).values({
    token,
    username: username.toLowerCase(),
    createdAt: now,
    expiresAt,
  });

  return token;
}

export async function getSharedResult(token: string): Promise<AnalysisResult | null> {
  const db = getDb();
  const now = new Date();

  const rows = await db
    .select()
    .from(shareLinks)
    .where(eq(shareLinks.token, token));

  const link = rows[0];
  if (!link || link.expiresAt <= now) return null;

  return getCachedResult(link.username);
}
