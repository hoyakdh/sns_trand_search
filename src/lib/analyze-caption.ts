import type { CaptionToneAnalysis, InstagramPost, WordStat } from "./types";

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "this", "that", "are", "was", "have",
  "https", "http", "com", "www", "instagram", "reels", "reel",
  "이", "그", "저", "것", "수", "등", "및", "the",
]);

const CASUAL_MARKERS = ["ㅋ", "ㅎ", "!", "~", "😂", "🤣", "💕", "🔥", "✨"];
const FORMAL_MARKERS = ["습니다", "합니다", "드립니다", "안내", "공지", "소개합니다"];

const EMOJI_REGEX = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/#[\w가-힣]+/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\w가-힣\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

export function computeCaptionToneAnalysis(posts: InstagramPost[]): CaptionToneAnalysis {
  const captions = posts.map((p) => p.caption).filter((c) => c.trim().length > 0);
  const allText = captions.join(" ");

  const wordCounts = new Map<string, number>();
  for (const caption of captions) {
    for (const word of new Set(extractWords(caption))) {
      wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
    }
  }

  const topWords: WordStat[] = Array.from(wordCounts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const emojiCounts = new Map<string, number>();
  for (const caption of captions) {
    const emojis = caption.match(EMOJI_REGEX) ?? [];
    for (const emoji of emojis) {
      emojiCounts.set(emoji, (emojiCounts.get(emoji) ?? 0) + 1);
    }
  }

  const topEmojis = Array.from(emojiCounts.entries())
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const koreanChars = (allText.match(/[가-힣]/g) ?? []).length;
  const englishChars = (allText.match(/[a-zA-Z]/g) ?? []).length;
  const totalChars = koreanChars + englishChars || 1;

  const koreanRatio = Math.round((koreanChars / totalChars) * 100);
  const englishRatio = Math.round((englishChars / totalChars) * 100);

  let casualScore = 0;
  let formalScore = 0;
  let questionCount = 0;

  for (const caption of captions) {
    if (caption.includes("?") || caption.includes("？")) questionCount++;
    if (CASUAL_MARKERS.some((m) => caption.includes(m))) casualScore++;
    if (FORMAL_MARKERS.some((m) => caption.includes(m))) formalScore++;
  }

  const questionRatio =
    captions.length > 0 ? Math.round((questionCount / captions.length) * 100) : 0;

  let tone: CaptionToneAnalysis["tone"] = "mixed";
  if (casualScore > formalScore * 1.5) tone = "casual";
  else if (formalScore > casualScore * 1.5) tone = "formal";

  const avgCaptionLength =
    captions.length > 0
      ? Math.round(captions.reduce((s, c) => s + c.length, 0) / captions.length)
      : 0;

  const toneLabel =
    tone === "casual" ? "캐주얼하고 친근한" : tone === "formal" ? "격식 있는" : "캐주얼과 격식이 혼합된";

  const langLabel =
    koreanRatio > 70
      ? "한국어 중심"
      : englishRatio > 70
        ? "영어 중심"
        : "한영 혼용";

  const toneSummary =
    `${toneLabel} 말투이며, ${langLabel} 캡션입니다. `
    + `평균 ${avgCaptionLength}자, `
    + (questionRatio > 30
      ? "질문형 캡션을 자주 사용해 참여를 유도합니다."
      : "서술형 캡션 위주로 작성합니다.");

  return {
    topWords,
    topEmojis,
    koreanRatio,
    englishRatio,
    tone,
    questionRatio,
    avgCaptionLength,
    toneSummary,
  };
}
