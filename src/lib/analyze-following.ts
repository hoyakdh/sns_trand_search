import type {
  FollowingAccount,
  FollowingAIReport,
  FollowingAnalysis,
  FollowingCategoryStat,
  FollowingKeywordStat,
  FollowingStats,
} from "./types";

const CATEGORY_RULES: { category: string; keywords: string[] }[] = [
  { category: "여행", keywords: ["travel", "trip", "tour", "wander", "여행", "hotel", "airbnb", "backpack", "adventure", "explore"] },
  { category: "음식/맛집", keywords: ["food", "restaurant", "chef", "recipe", "맛집", "foodie", "eats", "dining", "cook", "kitchen"] },
  { category: "카페", keywords: ["cafe", "coffee", "카페", "brunch", "bakery", "dessert"] },
  { category: "패션/뷰티", keywords: ["fashion", "style", "ootd", "beauty", "makeup", "vogue", "wear", "skincare"] },
  { category: "사진/영상", keywords: ["photo", "photography", "camera", "film", "video", "creator", "content"] },
  { category: "피트니스", keywords: ["fitness", "gym", "workout", "yoga", "health", "sport", "running", "hiking", "trail"] },
  { category: "브랜드/비즈니스", keywords: ["official", "brand", "shop", "store", "company", "business", "service"] },
  { category: "미디어", keywords: ["news", "magazine", "media", "network", "tv", "radio"] },
];

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "your", "our", "all", "more", "life",
  "daily", "official", "account", "instagram", "link", "bio", "dm", "collab",
]);

function classifyAccount(account: FollowingAccount): string {
  const text = `${account.username} ${account.fullName} ${account.biography}`.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.category;
    }
  }

  if (account.isBusiness) return "브랜드/비즈니스";
  if (account.followersCount > 100000) return "인플루언서";
  return "일반 계정";
}

function extractBioKeywords(accounts: FollowingAccount[]): FollowingKeywordStat[] {
  const counts = new Map<string, number>();

  for (const account of accounts) {
    const words = `${account.fullName} ${account.biography}`
      .toLowerCase()
      .replace(/[^\w가-힣\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

    for (const word of new Set(words)) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

function computeCategoryStats(accounts: FollowingAccount[]): FollowingCategoryStat[] {
  const counts = new Map<string, number>();

  for (const account of accounts) {
    const category = classifyAccount(account);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  const total = accounts.length || 1;

  return Array.from(counts.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeFollowingStats(accounts: FollowingAccount[]): FollowingStats {
  const total = accounts.length;
  const verified = accounts.filter((a) => a.isVerified).length;
  const business = accounts.filter((a) => a.isBusiness).length;
  const avgFollowers =
    total > 0
      ? Math.round(accounts.reduce((s, a) => s + a.followersCount, 0) / total)
      : 0;

  const topAccounts = [...accounts]
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 15);

  return {
    totalAnalyzed: total,
    verifiedRatio: total > 0 ? Math.round((verified / total) * 100) : 0,
    businessRatio: total > 0 ? Math.round((business / total) * 100) : 0,
    avgFollowers,
    categories: computeCategoryStats(accounts),
    topAccounts,
    bioKeywords: extractBioKeywords(accounts),
  };
}

function ruleBasedFollowingReport(stats: FollowingStats): FollowingAIReport {
  const topCategory = stats.categories[0]?.category ?? "다양한";
  const topKeywords = stats.bioKeywords.slice(0, 5).map((k) => k.keyword);

  let networkType = "다양한 관심사의 계정을 팔로우";
  if (stats.verifiedRatio > 20) networkType = "인증된 공식·유명 계정 중심";
  else if (stats.businessRatio > 30) networkType = "브랜드·비즈니스 계정 중심";
  else if (stats.categories[0]?.percentage > 40) networkType = `${topCategory} 분야 집중형`;

  const summary =
    `분석한 ${stats.totalAnalyzed}개 팔로잉 중 ${topCategory} 관련 계정이 가장 많습니다. `
    + `인증 계정 비율 ${stats.verifiedRatio}%, 비즈니스 계정 ${stats.businessRatio}%이며, `
    + `팔로잉 평균 팔로워 수는 ${stats.avgFollowers.toLocaleString()}명입니다.`;

  return {
    summary,
    interests: topKeywords.length > 0 ? topKeywords : [topCategory],
    networkType,
  };
}

export function computeFollowingAnalysis(accounts: FollowingAccount[]): FollowingAnalysis {
  const stats = computeFollowingStats(accounts);
  const aiReport = ruleBasedFollowingReport(stats);
  return { stats, aiReport };
}

export async function generateFollowingAIReport(
  stats: FollowingStats,
  username: string
): Promise<FollowingAIReport> {
  if (!process.env.OPENAI_API_KEY) {
    return ruleBasedFollowingReport(stats);
  }

  const categories = stats.categories.map((c) => `${c.category} ${c.percentage}%`).join(", ");
  const keywords = stats.bioKeywords.slice(0, 10).map((k) => k.keyword).join(", ");
  const topAccounts = stats.topAccounts
    .slice(0, 5)
    .map((a) => `@${a.username} (${a.followersCount.toLocaleString()} followers)`)
    .join(", ");

  const prompt = `인스타그램 @${username} 계정의 팔로잉(팔로우하는 계정) 분석 결과입니다.

분석 수: ${stats.totalAnalyzed}개
카테고리 분포: ${categories}
바이오 키워드: ${keywords}
인증 계정 비율: ${stats.verifiedRatio}%
비즈니스 계정 비율: ${stats.businessRatio}%
평균 팔로워: ${stats.avgFollowers}
주요 팔로잉: ${topAccounts}

다음 JSON으로 응답:
{
  "summary": "2-3문장 팔로잉 성향 요약 (한국어)",
  "interests": ["관심사1", "관심사2", ...],
  "networkType": "네트워크 유형 한 줄 (예: 여행 인플루언서 중심)"
}`;

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return ruleBasedFollowingReport(stats);

    return JSON.parse(content) as FollowingAIReport;
  } catch {
    return ruleBasedFollowingReport(stats);
  }
}
