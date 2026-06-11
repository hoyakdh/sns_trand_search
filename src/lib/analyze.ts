import type {
  AnalysisStats,
  EngagementStats,
  HashtagStat,
  InstagramPost,
  InstagramProfile,
  MusicStat,
  TimeSlotStat,
} from "./types";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function getDayLabel(day: number): string {
  return DAY_LABELS[day] ?? "?";
}

export function computeHashtagStats(posts: InstagramPost[]): HashtagStat[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.hashtags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;

  return Array.from(counts.entries())
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

export function computeMusicStats(posts: InstagramPost[]): MusicStat[] {
  const counts = new Map<string, { title: string; artist: string; count: number; isOriginalAudio: boolean }>();

  for (const post of posts) {
    if (!post.music) continue;
    const key = `${post.music.title}::${post.music.artist}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, { ...post.music, count: 1 });
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function computeTimeSlotStats(posts: InstagramPost[]): TimeSlotStat[] {
  const slots = new Map<string, number>();

  for (const post of posts) {
    const date = new Date(post.timestamp);
    const day = date.getDay();
    const hour = date.getHours();
    const key = `${day}-${hour}`;
    slots.set(key, (slots.get(key) ?? 0) + 1);
  }

  const result: TimeSlotStat[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      result.push({ day, hour, count: slots.get(`${day}-${hour}`) ?? 0 });
    }
  }
  return result;
}

export function computeEngagementStats(
  posts: InstagramPost[],
  profile: InstagramProfile
): EngagementStats {
  if (posts.length === 0) {
    return {
      avgLikes: 0,
      avgComments: 0,
      avgEngagementRate: 0,
      totalPosts: 0,
      postsPerWeek: 0,
    };
  }

  const totalLikes = posts.reduce((s, p) => s + p.likesCount, 0);
  const totalComments = posts.reduce((s, p) => s + p.commentsCount, 0);
  const avgLikes = Math.round(totalLikes / posts.length);
  const avgComments = Math.round(totalComments / posts.length);

  const followers = profile.followersCount || 1;
  const avgEngagementRate =
    Math.round(((avgLikes + avgComments) / followers) * 10000) / 100;

  const timestamps = posts.map((p) => new Date(p.timestamp).getTime()).sort();
  const spanDays =
    timestamps.length > 1
      ? (timestamps[timestamps.length - 1] - timestamps[0]) / 86400000
      : 7;
  const postsPerWeek =
    Math.round((posts.length / Math.max(spanDays, 1)) * 7 * 10) / 10;

  return {
    avgLikes,
    avgComments,
    avgEngagementRate,
    totalPosts: posts.length,
    postsPerWeek,
  };
}

export function computeOriginalAudioRatio(posts: InstagramPost[]): number {
  const reelsWithMusic = posts.filter((p) => p.type === "reel" && p.music);
  if (reelsWithMusic.length === 0) return 0;
  const original = reelsWithMusic.filter((p) => p.music?.isOriginalAudio).length;
  return Math.round((original / reelsWithMusic.length) * 100);
}

export function computeStats(
  posts: InstagramPost[],
  profile: InstagramProfile
): AnalysisStats {
  return {
    hashtags: computeHashtagStats(posts),
    music: computeMusicStats(posts),
    timeSlots: computeTimeSlotStats(posts),
    engagement: computeEngagementStats(posts, profile),
    originalAudioRatio: computeOriginalAudioRatio(posts),
  };
}
