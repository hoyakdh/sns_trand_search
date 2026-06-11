"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { AIReport as AIReportType } from "@/lib/types";
import { stickerPalette } from "@/lib/design-tokens";

export function AIReport({ report }: { report: AIReportType }) {
  return (
    <div className="card">
      <h3 className="type-heading-3 mb-4">AI 성향 분석</h3>

      <p className="type-body-md mb-4 text-ink-secondary">
        {report.personaSummary}
      </p>

      <p className="type-body-sm mb-4 font-medium text-ink">
        {report.contentStyle}
      </p>

      {report.followingSummary && (
        <p className="type-body-sm mb-6 rounded-lg border border-hairline bg-canvas-soft px-4 py-3 text-ink-secondary">
          <span className="font-semibold text-ink">팔로잉 성향: </span>
          {report.followingSummary}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="type-eyebrow mb-3 text-ink-muted">관심사 분포</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={report.categories}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(props) => {
                  const entry = props as unknown as { category: string; percentage: number };
                  return `${entry.category} ${entry.percentage}%`;
                }}
              >
                {report.categories.map((_, i) => (
                  <Cell key={i} fill={stickerPalette[i % stickerPalette.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="type-eyebrow mb-3 text-ink-muted">성향 키워드</h4>
          <div className="flex flex-wrap gap-2">
            {report.keywords.map((kw, i) => (
              <span key={kw} className="badge-pill">
                <span
                  className="sticker-dot mr-1.5 inline-block"
                  style={{ backgroundColor: stickerPalette[i % stickerPalette.length] }}
                />
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
