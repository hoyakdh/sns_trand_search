import { eq, gt } from "drizzle-orm";
import type { AnalysisResult } from "./types";
import { getDb } from "./db";
import { analysisCache } from "./db/schema";

function getCacheTtlMs(): number {
  const hours = Number(process.env.CACHE_TTL_HOURS ?? 24);
  return hours * 60 * 60 * 1000;
}

export async function getCachedResult(
  username: string
): Promise<AnalysisResult | null> {
  const db = getDb();
  const now = new Date();

  const rows = await db
    .select()
    .from(analysisCache)
    .where(eq(analysisCache.username, username.toLowerCase()));

  const row = rows[0];
  if (!row || row.expiresAt <= now) return null;

  return JSON.parse(row.result) as AnalysisResult;
}

export async function setCachedResult(result: AnalysisResult): Promise<void> {
  const db = getDb();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + getCacheTtlMs());

  await db
    .insert(analysisCache)
    .values({
      username: result.username.toLowerCase(),
      result: JSON.stringify(result),
      createdAt: now,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: analysisCache.username,
      set: {
        result: JSON.stringify(result),
        createdAt: now,
        expiresAt,
      },
    });
}

export async function getRecentAnalyses(limit = 10): Promise<
  { username: string; analyzedAt: string }[]
> {
  const db = getDb();
  const now = new Date();

  const rows = await db
    .select()
    .from(analysisCache)
    .where(gt(analysisCache.expiresAt, now));

  return rows
    .map((row) => {
      const result = JSON.parse(row.result) as AnalysisResult;
      return { username: result.username, analyzedAt: result.analyzedAt };
    })
    .sort(
      (a, b) =>
        new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
    )
    .slice(0, limit);
}
