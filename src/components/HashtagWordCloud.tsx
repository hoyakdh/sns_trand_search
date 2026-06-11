"use client";

import type { HashtagStat } from "@/lib/types";
import { stickerPalette } from "@/lib/design-tokens";

export function HashtagWordCloud({ hashtags }: { hashtags: HashtagStat[] }) {
  const max = hashtags[0]?.count ?? 1;

  return (
    <div className="card">
      <h3 className="type-heading-3 mb-4">해시태그 워드클라우드</h3>
      <div className="flex flex-wrap items-center justify-center gap-3 py-4">
        {hashtags.map((h, i) => {
          const ratio = h.count / max;
          const size = 0.75 + ratio * 1.25;
          const opacity = 0.55 + ratio * 0.45;
          return (
            <span
              key={h.tag}
              style={{
                fontSize: `${size}rem`,
                opacity,
                color: stickerPalette[i % stickerPalette.length],
              }}
              className="font-medium"
              title={`${h.count}회 사용 (${h.percentage}%)`}
            >
              #{h.tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
