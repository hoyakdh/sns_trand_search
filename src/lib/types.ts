export interface InstagramProfile {
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePicUrl: string;
  isPrivate: boolean;
}

export interface InstagramPost {
  id: string;
  type: "image" | "video" | "carousel" | "reel";
  caption: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  url: string;
  music?: MusicInfo;
}

export interface MusicInfo {
  title: string;
  artist: string;
  isOriginalAudio: boolean;
}

export interface HashtagStat {
  tag: string;
  count: number;
  percentage: number;
}

export interface MusicStat {
  title: string;
  artist: string;
  count: number;
  isOriginalAudio: boolean;
}

export interface TimeSlotStat {
  day: number; // 0=Sun, 6=Sat
  hour: number; // 0-23
  count: number;
}

export interface EngagementStats {
  avgLikes: number;
  avgComments: number;
  avgEngagementRate: number;
  totalPosts: number;
  postsPerWeek: number;
}

export interface CategoryDistribution {
  category: string;
  percentage: number;
}

export interface AIReport {
  categories: CategoryDistribution[];
  keywords: string[];
  personaSummary: string;
  contentStyle: string;
  followingSummary?: string;
}

export interface FollowingAccount {
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  isVerified: boolean;
  isBusiness: boolean;
}

export interface FollowingCategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface FollowingKeywordStat {
  keyword: string;
  count: number;
}

export interface FollowingStats {
  totalAnalyzed: number;
  verifiedRatio: number;
  businessRatio: number;
  avgFollowers: number;
  categories: FollowingCategoryStat[];
  topAccounts: FollowingAccount[];
  bioKeywords: FollowingKeywordStat[];
}

export interface FollowingAIReport {
  summary: string;
  interests: string[];
  networkType: string;
}

export interface FollowingAnalysis {
  stats: FollowingStats;
  aiReport: FollowingAIReport;
}

export interface ContentTypeStat {
  type: InstagramPost["type"];
  label: string;
  count: number;
  percentage: number;
  avgLikes: number;
  avgComments: number;
  avgEngagementRate: number;
}

export interface ContentTypeAnalysis {
  types: ContentTypeStat[];
  reelRatio: number;
  bestPerformingType: string;
  captionLengthInsight: string;
}

export interface WordStat {
  word: string;
  count: number;
}

export interface EmojiStat {
  emoji: string;
  count: number;
}

export interface CaptionToneAnalysis {
  topWords: WordStat[];
  topEmojis: EmojiStat[];
  koreanRatio: number;
  englishRatio: number;
  tone: "casual" | "formal" | "mixed";
  questionRatio: number;
  avgCaptionLength: number;
  toneSummary: string;
}

export interface AnalysisStats {
  hashtags: HashtagStat[];
  music: MusicStat[];
  timeSlots: TimeSlotStat[];
  engagement: EngagementStats;
  originalAudioRatio: number;
  contentType: ContentTypeAnalysis;
  captionTone: CaptionToneAnalysis;
}

export interface AnalysisResult {
  username: string;
  profile: InstagramProfile;
  posts: InstagramPost[];
  stats: AnalysisStats;
  aiReport: AIReport;
  following: FollowingAnalysis;
  analyzedAt: string;
  postCount: number;
  reelCount: number;
}

export type JobStatus =
  | "pending"
  | "scraping"
  | "following"
  | "analyzing"
  | "ai_report"
  | "completed"
  | "failed";

export interface AnalysisJob {
  id: string;
  username: string;
  status: JobStatus;
  progress: number;
  message: string;
  result?: AnalysisResult;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
