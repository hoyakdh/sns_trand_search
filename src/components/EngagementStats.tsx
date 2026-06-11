import type { EngagementStats as EngagementStatsType } from "@/lib/types";

export function EngagementStats({ stats }: { stats: EngagementStatsType }) {
  const items = [
    { label: "평균 좋아요", value: stats.avgLikes.toLocaleString() },
    { label: "평균 댓글", value: stats.avgComments.toLocaleString() },
    { label: "참여율", value: `${stats.avgEngagementRate}%` },
    { label: "주간 게시", value: `${stats.postsPerWeek}회` },
    { label: "분석 게시물", value: `${stats.totalPosts}개` },
  ];

  return (
    <div className="card">
      <h3 className="type-heading-3 mb-4">참여 통계</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="type-title text-primary">{item.value}</div>
            <div className="type-caption mt-1 text-ink-faint">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
