"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { FollowingAnalysis as FollowingAnalysisType } from "@/lib/types";
import { colors, stickerPalette } from "@/lib/design-tokens";

export function FollowingAnalysis({ following }: { following: FollowingAnalysisType }) {
  const { stats, aiReport } = following;

  return (
    <div className="space-y-6">
      <div className="card">
        <span className="badge-pill mb-3">팔로잉</span>
        <h3 className="type-heading-3 mb-1">팔로잉 분석</h3>
        <p className="type-body-sm mb-4 text-ink-muted">
          {stats.totalAnalyzed}개 팔로잉 계정 분석 · {aiReport.networkType}
        </p>
        <p className="type-body-md mb-4 text-ink-secondary">{aiReport.summary}</p>
        <div className="flex flex-wrap gap-2">
          {aiReport.interests.map((interest, i) => (
            <span key={interest} className="badge-pill">
              <span
                className="sticker-dot mr-1.5 inline-block"
                style={{ backgroundColor: stickerPalette[i % stickerPalette.length] }}
              />
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "인증 계정", value: `${stats.verifiedRatio}%` },
          { label: "비즈니스 계정", value: `${stats.businessRatio}%` },
          { label: "평균 팔로워", value: stats.avgFollowers.toLocaleString() },
        ].map((item) => (
          <div key={item.label} className="card text-center">
            <div className="type-title text-primary">{item.value}</div>
            <div className="type-caption mt-1 text-ink-faint">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h4 className="type-eyebrow mb-4 text-ink-muted">팔로잉 카테고리 분포</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.categories}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(props) => {
                  const entry = props as unknown as { category: string; percentage: number };
                  return `${entry.category} ${entry.percentage}%`;
                }}
              >
                {stats.categories.map((_, i) => (
                  <Cell key={i} fill={stickerPalette[i % stickerPalette.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4 className="type-eyebrow mb-4 text-ink-muted">바이오 키워드</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.bioKeywords.slice(0, 10)} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: colors.inkMuted, fontSize: 11 }} />
              <YAxis type="category" dataKey="keyword" width={80} tick={{ fill: colors.inkMuted, fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill={colors.accentTeal} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h4 className="type-eyebrow mb-4 text-ink-muted">주요 팔로잉 (팔로워 순)</h4>
        <div className="space-y-1">
          {stats.topAccounts.map((account, i) => (
            <div
              key={account.username}
              className="flex items-center gap-3 rounded-md px-3 py-2"
            >
              <span className="type-caption w-6 text-center text-ink-faint">{i + 1}</span>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-ink"
                style={{ backgroundColor: stickerPalette[i % stickerPalette.length] }}
              >
                {account.username[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="type-body-sm truncate font-medium">@{account.username}</span>
                  {account.isVerified && (
                    <span className="text-primary" title="인증 계정">✓</span>
                  )}
                </div>
                <div className="type-caption truncate text-ink-faint">
                  {account.fullName || account.biography.slice(0, 40)}
                </div>
              </div>
              <span className="type-body-sm text-ink-muted">
                {account.followersCount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
