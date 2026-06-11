"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RecentItem {
  username: string;
  analyzedAt: string;
}

export function RecentAnalyses() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    fetch("/api/recent")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="type-eyebrow mb-3 text-ink-muted">최근 분석</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.username}
            href={`/result/${item.username}`}
            className="badge-pill no-underline transition active:scale-95"
          >
            @{item.username}
          </Link>
        ))}
      </div>
    </div>
  );
}
