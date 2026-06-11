import type { InstagramProfile } from "@/lib/types";
import { stickerPalette } from "@/lib/design-tokens";

export function ProfileCard({
  profile,
  postCount,
  reelCount,
}: {
  profile: InstagramProfile;
  postCount: number;
  reelCount: number;
}) {
  return (
    <div className="card-elevated">
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-ink"
          style={{ backgroundColor: stickerPalette[0] }}
        >
          {profile.username[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="type-heading-3">@{profile.username}</h2>
          <p className="type-body-sm text-ink-muted">{profile.fullName}</p>
          {profile.biography && (
            <p className="type-body-sm mt-2 whitespace-pre-line text-ink-secondary">
              {profile.biography}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "팔로워", value: profile.followersCount },
          { label: "팔로잉", value: profile.followsCount },
          { label: "게시물", value: profile.postsCount },
          { label: "분석 피드", value: postCount },
          { label: "분석 릴스", value: reelCount },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="type-title text-primary">
              {stat.value.toLocaleString()}
            </div>
            <div className="type-caption mt-1 text-ink-faint">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
