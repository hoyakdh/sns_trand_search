"use client";

import type { TimeSlotStat } from "@/lib/types";
import { getDayLabel } from "@/lib/analyze";
import { colors } from "@/lib/design-tokens";

export function PostingHeatmap({ timeSlots }: { timeSlots: TimeSlotStat[] }) {
  const maxCount = Math.max(...timeSlots.map((s) => s.count), 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  function getCount(day: number, hour: number) {
    return timeSlots.find((s) => s.day === day && s.hour === hour)?.count ?? 0;
  }

  function getOpacity(count: number) {
    if (count === 0) return 0;
    return 0.15 + (count / maxCount) * 0.85;
  }

  return (
    <div className="card">
      <h3 className="type-heading-3 mb-4">게시 시간대</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="mb-1 grid grid-cols-[40px_repeat(24,1fr)] gap-0.5">
            <div />
            {hours.map((h) => (
              <div key={h} className="type-caption text-center text-ink-faint">
                {h % 3 === 0 ? `${h}시` : ""}
              </div>
            ))}
          </div>
          {Array.from({ length: 7 }, (_, day) => (
            <div
              key={day}
              className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5"
            >
              <div className="type-caption flex items-center text-ink-muted">
                {getDayLabel(day)}
              </div>
              {hours.map((hour) => {
                const count = getCount(day, hour);
                return (
                  <div
                    key={hour}
                    className="aspect-square rounded-xs border border-hairline"
                    style={{
                      backgroundColor:
                        count === 0
                          ? colors.canvasSoft
                          : colors.primary,
                      opacity: count === 0 ? 1 : getOpacity(count),
                    }}
                    title={`${getDayLabel(day)} ${hour}시: ${count}건`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
