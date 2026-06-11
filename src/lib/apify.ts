import { ApifyClient } from "apify-client";
import type { FollowingAccount, InstagramPost, InstagramProfile, MusicInfo } from "./types";
import { generateMockFollowing, generateMockPosts, getMockProfile } from "./mock-data";

const POST_ACTOR = "apify/instagram-scraper";
const REEL_ACTOR = "apify/instagram-reel-scraper";
const FOLLOWING_ACTOR = "instaprism/instagram-following-scraper";

function shouldUseMockData(): boolean {
  return (
    process.env.USE_MOCK_DATA === "true" || !process.env.APIFY_TOKEN
  );
}

function getClient(): ApifyClient {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN is not set");
  return new ApifyClient({ token });
}

function extractHashtags(caption: string, existing?: string[]): string[] {
  const fromCaption = (caption.match(/#[\w가-힣]+/g) ?? []).map((t) =>
    t.slice(1).toLowerCase()
  );
  const fromField = (existing ?? []).map((t) => t.replace(/^#/, "").toLowerCase());
  return [...new Set([...fromField, ...fromCaption])];
}

function normalizeMusic(raw: Record<string, unknown>): MusicInfo | undefined {
  const title =
    (raw.musicInfo as Record<string, string>)?.song_name ??
    (raw.music as Record<string, string>)?.title ??
    raw.songName ??
    raw.musicTitle;
  const artist =
    (raw.musicInfo as Record<string, string>)?.artist_name ??
    (raw.music as Record<string, string>)?.artist ??
    raw.artistName ??
    raw.musicArtist;

  if (!title && !artist) return undefined;

  const isOriginal =
    raw.isOriginalAudio === true ||
    (typeof title === "string" && title.toLowerCase().includes("original audio"));

  return {
    title: String(title ?? "Unknown"),
    artist: String(artist ?? "Unknown"),
    isOriginalAudio: isOriginal,
  };
}

function normalizePost(raw: Record<string, unknown>): InstagramPost | null {
  const id = String(raw.id ?? raw.shortCode ?? "");
  if (!id) return null;

  const caption = String(raw.caption ?? raw.text ?? "");
  const typeRaw = String(raw.type ?? raw.productType ?? "image").toLowerCase();

  let type: InstagramPost["type"] = "image";
  if (typeRaw.includes("reel") || typeRaw === "clips") type = "reel";
  else if (typeRaw.includes("video")) type = "video";
  else if (typeRaw.includes("sidecar") || typeRaw.includes("carousel")) type = "carousel";

  return {
    id,
    type,
    caption,
    hashtags: extractHashtags(caption, raw.hashtags as string[] | undefined),
    likesCount: Number(raw.likesCount ?? raw.likeCount ?? 0),
    commentsCount: Number(raw.commentsCount ?? raw.commentCount ?? 0),
    timestamp: String(raw.timestamp ?? raw.takenAt ?? new Date().toISOString()),
    url: String(raw.url ?? raw.postUrl ?? `https://www.instagram.com/p/${id}/`),
    music: normalizeMusic(raw),
  };
}

function normalizeProfile(raw: Record<string, unknown>, username: string): InstagramProfile {
  return {
    username: String(raw.username ?? username),
    fullName: String(raw.fullName ?? raw.name ?? username),
    biography: String(raw.biography ?? raw.bio ?? ""),
    followersCount: Number(raw.followersCount ?? raw.followers ?? 0),
    followsCount: Number(raw.followsCount ?? raw.following ?? 0),
    postsCount: Number(raw.postsCount ?? raw.posts ?? 0),
    profilePicUrl: String(raw.profilePicUrl ?? raw.profilePicture ?? ""),
    isPrivate: Boolean(raw.private ?? raw.isPrivate ?? false),
  };
}

async function runActor<T extends Record<string, unknown>>(
  actorId: string,
  input: Record<string, unknown>
): Promise<T[]> {
  const client = getClient();
  const run = await client.actor(actorId).call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items as T[];
}

export async function scrapeInstagramData(
  username: string,
  limit = 50,
  onProgress?: (message: string, progress: number) => void
): Promise<{ profile: InstagramProfile; posts: InstagramPost[] }> {
  const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();

  if (shouldUseMockData()) {
    onProgress?.("목 데이터 로딩 중...", 30);
    await new Promise((r) => setTimeout(r, 1500));
    onProgress?.("게시물 수집 완료", 80);
    return {
      profile: getMockProfile(cleanUsername),
      posts: generateMockPosts(limit),
    };
  }

  onProgress?.("프로필 및 게시물 수집 중...", 10);

  const [postResults, reelResults] = await Promise.all([
    runActor(POST_ACTOR, {
      directUrls: [`https://www.instagram.com/${cleanUsername}/`],
      resultsType: "posts",
      resultsLimit: limit,
    }),
    runActor(REEL_ACTOR, {
      username: [cleanUsername],
      resultsLimit: limit,
    }),
  ]);

  onProgress?.("데이터 정규화 중...", 70);

  const profileRaw = postResults.find(
    (item) => item.username && !item.caption && !item.shortCode
  ) ?? postResults[0];

  if (!profileRaw && postResults.length === 0 && reelResults.length === 0) {
    throw new Error(`@${cleanUsername} 계정을 찾을 수 없습니다.`);
  }

  const profile = normalizeProfile(profileRaw ?? {}, cleanUsername);

  if (profile.isPrivate) {
    throw new Error(`@${cleanUsername}은(는) 비공개 계정입니다.`);
  }

  const postMap = new Map<string, InstagramPost>();

  for (const raw of postResults) {
    const post = normalizePost(raw);
    if (post) postMap.set(post.id, post);
  }

  for (const raw of reelResults) {
    const post = normalizePost({ ...raw, type: "reel" });
    if (post) {
      const existing = postMap.get(post.id);
      if (existing) {
        postMap.set(post.id, { ...existing, music: post.music ?? existing.music, type: "reel" });
      } else {
        postMap.set(post.id, post);
      }
    }
  }

  const posts = Array.from(postMap.values()).slice(0, limit);

  if (posts.length === 0) {
    throw new Error(`@${cleanUsername}의 공개 게시물을 찾을 수 없습니다.`);
  }

  onProgress?.("수집 완료", 80);
  return { profile, posts };
}

function normalizeFollowingAccount(raw: Record<string, unknown>): FollowingAccount | null {
  const username = String(raw.username ?? raw.userName ?? raw.handle ?? "");
  if (!username) return null;

  return {
    username: username.replace(/^@/, "").toLowerCase(),
    fullName: String(raw.fullName ?? raw.full_name ?? raw.name ?? ""),
    biography: String(raw.biography ?? raw.bio ?? raw.description ?? ""),
    followersCount: Number(raw.followersCount ?? raw.followers ?? raw.followerCount ?? 0),
    isVerified: Boolean(raw.isVerified ?? raw.verified ?? raw.is_verified),
    isBusiness: Boolean(raw.isBusiness ?? raw.is_business ?? raw.isBusinessAccount),
  };
}

export async function scrapeFollowing(
  username: string,
  limit = 100,
  onProgress?: (message: string) => void
): Promise<FollowingAccount[]> {
  const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();

  if (shouldUseMockData()) {
    onProgress?.("팔로잉 목 데이터 로딩 중...");
    await new Promise((r) => setTimeout(r, 800));
    return generateMockFollowing(limit);
  }

  onProgress?.("팔로잉 목록 수집 중...");

  const results = await runActor(FOLLOWING_ACTOR, {
    username: cleanUsername,
    limit,
  });

  const accounts = results
    .map(normalizeFollowingAccount)
    .filter((a): a is FollowingAccount => a !== null);

  if (accounts.length === 0) {
    throw new Error(`@${cleanUsername}의 팔로잉 목록을 가져올 수 없습니다.`);
  }

  onProgress?.(`팔로잉 ${accounts.length}개 수집 완료`);
  return accounts.slice(0, limit);
}
