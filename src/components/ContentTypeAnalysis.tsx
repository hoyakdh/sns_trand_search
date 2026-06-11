"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ContentTypeAnalysis as ContentTypeAnalysisType } from "@/lib/types";
import { colors, stickerPalette } from "@/lib/design-tokens";

export function ContentTypeAnalysis({ data }: { data: ContentTypeAnalysisType }) {
  const chartData = data.types.map((t) => ({
    name: t.label,
    count: t.count,
    engagement: t.avgEngagementRate,
  }));

  return (
    <div className="card">
      <span className="badge-pill mb-3">콘텐츠</span>
      <h3 className="type-heading-3 mb-1">콘텐츠 유형 분석</h3>
      <p className="type-body-sm mb-6 text-ink-muted">
        릴스 비율 {data.reelRatio}% · 참여율 최고: {data.bestPerformingType}
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.types.map((t, i) => (
          <div
            key={t.type}
            className="rounded-lg border border-hairline p-4"
            style={{ borderTopWidth: 3, borderTopColor: stickerPalette[i % stickerPalette.length] }}
          >
            <div className="type-title">{t.label}</div>
            <div className="type-caption mt-1 text-ink-faint">
              {t.count}개 ({t.percentage}%)
            </div>
            <div className="type-body-sm mt-2 text-primary">
              참여율 {t.avgEngagementRate}%
            </div>
            <div className="type-caption text-ink-muted">
              ♥ {t.avgLikes.toLocaleString()} · 💬 {t.avgComments}
            </div>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fill: colors.inkMuted, fontSize: 12 }} />
          <YAxis tick={{ fill: colors.inkMuted, fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="engagement" name="참여율 %" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={stickerPalette[i % stickerPalette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="type-body-sm mt-4 rounded-lg bg-canvas-soft px-4 py-3 text-ink-secondary">
        {data.captionLengthInsight}
      </p>
    </div>
  );
}
