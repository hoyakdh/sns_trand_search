import type {
  ContentTypeAnalysis,
  ContentTypeStat,
  InstagramPost,
  InstagramProfile,
} from "./types";

const TYPE_LABELS: Record<InstagramPost["type"], string> = {
  reel: "릴스",
  image: "이미지",
  video: "동영상",
  carousel: "캐러셀",
};

function avg(nums: number[]) {
  return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
}

export function computeContentTypeAnalysis(
  posts: InstagramPost[],
  profile: InstagramProfile
): ContentTypeAnalysis {
  const followers = profile.followersCount || 1;
  const groups = new Map<InstagramPost["type"], InstagramPost[]>();

  for (const post of posts) {
    const list = groups.get(post.type) ?? [];
    list.push(post);
    groups.set(post.type, list);
  }

  const types: ContentTypeStat[] = Array.from(groups.entries())
    .map(([type, items]) => {
      const avgLikes = avg(items.map((p) => p.likesCount));
      const avgComments = avg(items.map((p) => p.commentsCount));
      return {
        type,
        label: TYPE_LABELS[type],
        count: items.length,
        percentage: Math.round((items.length / Math.max(posts.length, 1)) * 100),
        avgLikes,
        avgComments,
        avgEngagementRate:
          Math.round(((avgLikes + avgComments) / followers) * 10000) / 100,
      };
    })
    .sort((a, b) => b.count - a.count);

  const reelRatio = Math.round(
    ((groups.get("reel")?.length ?? 0) / Math.max(posts.length, 1)) * 100
  );

  const best = [...types].sort((a, b) => b.avgEngagementRate - a.avgEngagementRate)[0];
  const bestPerformingType = best?.label ?? "—";

  const withCaption = posts.filter((p) => p.caption.trim().length > 0);
  const short = withCaption.filter((p) => p.caption.length < 50);
  const medium = withCaption.filter((p) => p.caption.length >= 50 && p.caption.length < 150);
  const long = withCaption.filter((p) => p.caption.length >= 150);

  const eng = (list: InstagramPost[]) =>
    avg(list.map((p) => p.likesCount + p.commentsCount));

  const shortEng = eng(short);
  const mediumEng = eng(medium);
  const longEng = eng(long);

  let captionLengthInsight = "캡션 길이와 참여율의 뚜렷한 패턴이 없습니다.";
  if (longEng > shortEng * 1.2 && long.length >= 3) {
    captionLengthInsight = "긴 캡션일수록 평균 참여가 높습니다.";
  } else if (shortEng > longEng * 1.2 && short.length >= 3) {
    captionLengthInsight = "짧은 캡션일수록 평균 참여가 높습니다.";
  } else if (mediumEng >= shortEng && mediumEng >= longEng && medium.length >= 3) {
    captionLengthInsight = "중간 길이 캡션(50~150자)이 가장 효과적입니다.";
  }

  return { types, reelRatio, bestPerformingType, captionLengthInsight };
}
