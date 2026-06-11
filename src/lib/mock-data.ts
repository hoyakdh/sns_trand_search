import type { FollowingAccount, InstagramPost, InstagramProfile } from "./types";

export const MOCK_PROFILE: InstagramProfile = {
  username: "travel_lover_kr",
  fullName: "김여행 | Travel Creator",
  biography: "✈️ 세계 곳곳을 여행하며 기록합니다\n📍 Seoul → Tokyo → Paris\n🍜 맛집 · 카페 · 숙소 추천",
  followersCount: 48200,
  followsCount: 892,
  postsCount: 347,
  profilePicUrl: "",
  isPrivate: false,
};

const HASHTAG_POOL = [
  "여행", "travel", "맛집", "foodie", "카페", "cafe", "일본여행", "japan",
  "도쿄", "tokyo", "파리", "paris", "숙소", "hotel", "vlog", "데일리",
  "ootd", "photography", "sunset", "beach", "mountain", "hiking", "coffee",
  "brunch", "dessert", "streetfood", "backpacking", "europe", "korea",
];

const MUSIC_POOL = [
  { title: "Blinding Lights", artist: "The Weeknd", isOriginalAudio: false },
  { title: "As It Was", artist: "Harry Styles", isOriginalAudio: false },
  { title: "Flowers", artist: "Miley Cyrus", isOriginalAudio: false },
  { title: "Cupid", artist: "FIFTY FIFTY", isOriginalAudio: false },
  { title: "Seven", artist: "Jung Kook", isOriginalAudio: false },
  { title: "Original Audio", artist: "travel_lover_kr", isOriginalAudio: true },
  { title: "Ditto", artist: "NewJeans", isOriginalAudio: false },
  { title: "Anti-Hero", artist: "Taylor Swift", isOriginalAudio: false },
];

const CAPTIONS = [
  "도쿄 시부야의 밤 🌃 #여행 #도쿄 #일본여행",
  "파리 에펠탑 앞에서의 선셋 ☀️ #파리 #travel #sunset",
  "오늘의 브런치 🥐 #맛집 #brunch #cafe",
  "제주 바다에서의 하루 🌊 #beach #korea #vlog",
  "알프스 트레킹 🏔️ #hiking #mountain #backpacking",
  "홍대 숨은 카페 발견 ☕ #카페 #coffee #seoul",
  "방콕 길거리 음식 투어 🍜 #streetfood #foodie",
  "런던 빅벤 야경 🌙 #europe #travel #photography",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomHashtags(): string[] {
  const count = 3 + Math.floor(Math.random() * 5);
  const shuffled = [...HASHTAG_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateMockPosts(count = 50): InstagramPost[] {
  const posts: InstagramPost[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isReel = Math.random() < 0.6;
    const daysAgo = Math.floor(Math.random() * 90);
    const hour = Math.floor(Math.random() * 24);
    const day = Math.floor(Math.random() * 7);
    const date = new Date(now - daysAgo * 86400000);
    date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
    // Adjust to specific day of week
    const currentDay = date.getDay();
    date.setDate(date.getDate() + (day - currentDay));

    posts.push({
      id: `mock_${i}`,
      type: isReel ? "reel" : randomFrom(["image", "carousel"] as const),
      caption: randomFrom(CAPTIONS),
      hashtags: randomHashtags(),
      likesCount: 500 + Math.floor(Math.random() * 5000),
      commentsCount: 10 + Math.floor(Math.random() * 200),
      timestamp: date.toISOString(),
      url: `https://www.instagram.com/p/mock_${i}/`,
      music: isReel ? randomFrom(MUSIC_POOL) : undefined,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getMockProfile(username: string): InstagramProfile {
  return {
    ...MOCK_PROFILE,
    username,
    fullName: `${username} (Mock)`,
  };
}

const MOCK_FOLLOWING_ACCOUNTS: Omit<FollowingAccount, "username">[] = [
  { fullName: "Nat Geo Travel", biography: "Official travel account 🌍 Adventure awaits", followersCount: 5200000, isVerified: true, isBusiness: true },
  { fullName: "맛집탐방", biography: "서울 맛집 · 카페 · 디저트 추천 🍰", followersCount: 89000, isVerified: false, isBusiness: true },
  { fullName: "Travel Blogger", biography: "Backpacking around the world ✈️", followersCount: 245000, isVerified: true, isBusiness: false },
  { fullName: "Seoul Cafe Guide", biography: "Hidden cafes in Seoul ☕", followersCount: 42000, isVerified: false, isBusiness: true },
  { fullName: "Fashion Daily", biography: "OOTD & style inspiration 👗", followersCount: 180000, isVerified: false, isBusiness: false },
  { fullName: "Japan Travel Tips", biography: "Japan travel guide 🇯🇵 Tokyo · Osaka · Kyoto", followersCount: 310000, isVerified: true, isBusiness: false },
  { fullName: "피트니스코치", biography: "Home workout & healthy lifestyle 💪", followersCount: 56000, isVerified: false, isBusiness: true },
  { fullName: "Photo Art", biography: "Landscape & travel photography 📷", followersCount: 92000, isVerified: false, isBusiness: false },
  { fullName: "Airbnb", biography: "Book unique homes and experiences", followersCount: 4800000, isVerified: true, isBusiness: true },
  { fullName: "카페투어", biography: "전국 카페 탐방 기록", followersCount: 28000, isVerified: false, isBusiness: false },
  { fullName: "Vogue Korea", biography: "Fashion & beauty magazine", followersCount: 1200000, isVerified: true, isBusiness: true },
  { fullName: "Hiking Korea", biography: "등산 · 트레킹 · 캠핑 🏕️", followersCount: 67000, isVerified: false, isBusiness: false },
  { fullName: "Food Network", biography: "Recipes & cooking inspiration", followersCount: 8900000, isVerified: true, isBusiness: true },
  { fullName: "여행스타그램", biography: "국내외 여행 정보 공유", followersCount: 150000, isVerified: false, isBusiness: false },
  { fullName: "Minimal Style", biography: "Minimal fashion & lifestyle", followersCount: 34000, isVerified: false, isBusiness: false },
  { fullName: "Lonely Planet", biography: "Travel guides & inspiration", followersCount: 2100000, isVerified: true, isBusiness: true },
  { fullName: "브런치카페", biography: "Brunch spots in Seoul 🥞", followersCount: 19000, isVerified: false, isBusiness: true },
  { fullName: "Surf Life", biography: "Beach · surf · ocean vibes 🏄", followersCount: 78000, isVerified: false, isBusiness: false },
  { fullName: "뷰티크리에이터", biography: "Makeup & skincare tips 💄", followersCount: 125000, isVerified: false, isBusiness: false },
  { fullName: "Trip Advisor", biography: "Travel reviews & recommendations", followersCount: 1500000, isVerified: true, isBusiness: true },
];

const EXTRA_USERNAMES = [
  "travel_korea", "foodie_seoul", "cafe_hunter", "ootd_daily", "photo_walk",
  "backpack_asia", "hotel_review", "street_food", "sunset_chaser", "mountain_lover",
  "coffee_addict", "brunch_seoul", "europe_trip", "beach_vibes", "city_explorer",
  "wanderlust_kr", "dessert_map", "fitness_life", "style_note", "nature_photo",
  "trip_planner", "local_eats", "hidden_gem", "weekend_trip", "travel_diary",
  "cafe_corner", "food_tour", "urban_photo", "coastal_walk", "trail_runner",
];

export function generateMockFollowing(count = 100): FollowingAccount[] {
  const accounts: FollowingAccount[] = MOCK_FOLLOWING_ACCOUNTS.map((acc, i) => ({
    username: EXTRA_USERNAMES[i] ?? `account_${i}`,
    ...acc,
  }));

  for (let i = MOCK_FOLLOWING_ACCOUNTS.length; i < count; i++) {
    const categories = ["travel", "food", "cafe", "photo", "daily", "style"];
    const cat = categories[i % categories.length];
    accounts.push({
      username: `user_${cat}_${i}`,
      fullName: `User ${i}`,
      biography: `${cat} lover · daily life`,
      followersCount: 1000 + Math.floor(Math.random() * 50000),
      isVerified: Math.random() < 0.05,
      isBusiness: Math.random() < 0.2,
    });
  }

  return accounts;
}
