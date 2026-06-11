import { scrapeFollowing, scrapeInstagramData } from "./apify";
import { computeStats } from "./analyze";
import {
  computeFollowingAnalysis,
  generateFollowingAIReport,
} from "./analyze-following";
import { generateAIReport } from "./ai";
import { setCachedResult } from "./cache";
import { completeJob, failJob, setJobStatus } from "./jobs";
import type { AnalysisResult } from "./types";

export async function runAnalysis(
  jobId: string,
  username: string
): Promise<void> {
  const limit = Number(process.env.ANALYSIS_LIMIT ?? 50);
  const followingLimit = Number(process.env.FOLLOWING_LIMIT ?? 100);

  try {
    setJobStatus(jobId, "scraping", 10, "게시물·릴스·팔로잉 수집 중...");

    const [{ profile, posts }, followingAccounts] = await Promise.all([
      scrapeInstagramData(username, limit, (message, progress) => {
        setJobStatus(jobId, "scraping", 10 + Math.round(progress * 0.35), message);
      }),
      scrapeFollowing(username, followingLimit, (message) => {
        setJobStatus(jobId, "following", 50, message);
      }),
    ]);

    setJobStatus(jobId, "analyzing", 75, "통계 분석 중...");
    const stats = computeStats(posts, profile);
    const followingBase = computeFollowingAnalysis(followingAccounts);

    setJobStatus(jobId, "ai_report", 88, "AI 성향 분석 중...");
    const [aiReport, followingAiReport] = await Promise.all([
      generateAIReport(posts, stats, username),
      generateFollowingAIReport(followingBase.stats, username),
    ]);

    aiReport.followingSummary = followingAiReport.summary;

    const result: AnalysisResult = {
      username: username.toLowerCase(),
      profile,
      posts,
      stats,
      aiReport,
      following: {
        stats: followingBase.stats,
        aiReport: followingAiReport,
      },
      analyzedAt: new Date().toISOString(),
      postCount: posts.filter((p) => p.type !== "reel").length,
      reelCount: posts.filter((p) => p.type === "reel").length,
    };

    await setCachedResult(result);
    completeJob(jobId, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    failJob(jobId, message);
  }
}
