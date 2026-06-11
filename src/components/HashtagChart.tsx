"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HashtagStat } from "@/lib/types";
import { colors } from "@/lib/design-tokens";

export function HashtagChart({ hashtags }: { hashtags: HashtagStat[] }) {
  const data = hashtags.slice(0, 15).map((h) => ({
    tag: `#${h.tag}`,
    count: h.count,
  }));

  return (
    <div className="card">
      <h3 className="type-heading-3 mb-4">해시태그 TOP 15</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" tick={{ fill: colors.inkMuted, fontSize: 11 }} />
          <YAxis type="category" dataKey="tag" width={100} tick={{ fill: colors.inkMuted, fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="count" fill={colors.primary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
