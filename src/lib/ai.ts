import OpenAI from "openai";
import { z } from "zod";
import type { AIReport, AnalysisStats, InstagramPost } from "./types";

const AIReportSchema = z.object({
  categories: z.array(
    z.object({
      category: z.string(),
      percentage: z.number(),
    })
  ),
  keywords: z.array(z.string()),
  personaSummary: z.string(),
  contentStyle: z.string(),
});

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  여행: ["travel", "여행", "trip", "vacation", "backpacking", "hotel", "flight"],
  음식: ["food", "맛집", "foodie", "restaurant", "brunch", "dessert", "streetfood", "cafe", "coffee"],
  패션: ["ootd", "fashion", "style", "outfit", "wear"],
  피트니스: ["fitness", "gym", "workout", "yoga", "health"],
  뷰티: ["beauty", "makeup", "skincare", "cosmetic"],
  일상: ["daily", "vlog", "life", "데일리"],
  사진: ["photography", "photo", "camera", "sunset"],
  음악: ["music", "song", "concert", "playlist"],
  반려동물: ["dog", "cat", "pet", "puppy", "강아지", "고양이"],
  자연: ["nature", "beach", "mountain", "hiking", "forest", "ocean"],
};

function ruleBasedReport(
  posts: InstagramPost[],
  stats: AnalysisStats
): AIReport {
  const allTags = stats.hashtags.map((h) => h.tag.toLowerCase());
  const categoryScores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const tag of allTags) {
      if (keywords.some((kw) => tag.includes(kw))) {
        score += stats.hashtags.find((h) => h.tag === tag)?.count ?? 1;
      }
    }
    if (score > 0) categoryScores[category] = score;
  }

  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0) || 1;
  const categories = Object.entries(categoryScores)
    .map(([category, score]) => ({
      category,
      percentage: Math.round((score / totalScore) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  if (categories.length === 0) {
    categories.push({ category: "일반", percentage: 100 });
  }

  const topTags = stats.hashtags.slice(0, 8).map((h) => `#${h.tag}`);
  const topMusic = stats.music.slice(0, 3).map((m) => `${m.title} - ${m.artist}`);
  const reelRatio = Math.round(
    (posts.filter((p) => p.type === "reel").length / Math.max(posts.length, 1)) * 100
  );

  const keywords = [
    ...stats.hashtags.slice(0, 5).map((h) => h.tag),
    reelRatio > 50 ? "릴스 중심" : "피드 중심",
    stats.originalAudioRatio > 30 ? "오리지널 오디오" : "트렌드 음악",
  ].slice(0, 8);

  const personaSummary = `이 계정은 ${categories[0]?.category ?? "다양한"} 콘텐츠를 중심으로 활동합니다. `
    + `주요 해시태그는 ${topTags.slice(0, 3).join(", ")}이며, `
    + `평균 ${stats.engagement.avgLikes.toLocaleString()}개의 좋아요를 받습니다. `
    + (topMusic.length > 0
      ? `자주 사용하는 음악은 ${topMusic[0]} 등이며, `
      : "")
    + `릴스 비율은 약 ${reelRatio}%입니다.`;

  const contentStyle =
    reelRatio > 60
      ? "숏폼(릴스) 중심의 역동적인 콘텐츠 스타일"
      : reelRatio > 30
        ? "피드와 릴스를 균형 있게 활용하는 스타일"
        : "정성스러운 피드 중심의 콘텐츠 스타일";

  return { categories, keywords, personaSummary, contentStyle };
}

export async function generateAIReport(
  posts: InstagramPost[],
  stats: AnalysisStats,
  username: string
): Promise<AIReport> {
  if (!process.env.OPENAI_API_KEY) {
    return ruleBasedReport(posts, stats);
  }

  const topHashtags = stats.hashtags.slice(0, 15).map((h) => h.tag).join(", ");
  const topMusic = stats.music
    .slice(0, 5)
    .map((m) => `${m.title} - ${m.artist}`)
    .join(", ");
  const sampleCaptions = posts
    .slice(0, 5)
    .map((p) => p.caption.slice(0, 100))
    .join("\n");

  const prompt = `인스타그램 계정 @${username}의 콘텐츠를 분석해주세요.

주요 해시태그: ${topHashtags}
사용 음악: ${topMusic || "없음"}
평균 좋아요: ${stats.engagement.avgLikes}
평균 댓글: ${stats.engagement.avgComments}
오리지널 오디오 비율: ${stats.originalAudioRatio}%
샘플 캡션:
${sampleCaptions}

다음 JSON 형식으로 응답하세요:
{
  "categories": [{"category": "카테고리명", "percentage": 숫자}],
  "keywords": ["키워드1", "키워드2"],
  "personaSummary": "2-3문장의 페르소나 요약 (한국어)",
  "contentStyle": "콘텐츠 스타일 한 줄 설명 (한국어)"
}

categories는 관심사 카테고리 3-5개, percentage 합이 100이 되도록.
keywords는 성향을 나타내는 키워드 5-8개.
모든 텍스트는 한국어로 작성.`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return ruleBasedReport(posts, stats);

    const parsed = AIReportSchema.parse(JSON.parse(content));
    return parsed;
  } catch {
    return ruleBasedReport(posts, stats);
  }
}
