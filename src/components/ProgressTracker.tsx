"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { stickerPalette } from "@/lib/design-tokens";

interface JobResponse {
  status: string;
  progress: number;
  message: string;
  username: string;
  error?: string;
}

const STEPS = [
  { key: "scraping", label: "게시물 수집" },
  { key: "following", label: "팔로잉 분석" },
  { key: "analyzing", label: "통계 분석" },
  { key: "ai_report", label: "AI 분석" },
  { key: "completed", label: "완료" },
];

export function ProgressTracker({
  jobId,
  username,
}: {
  jobId: string;
  username: string;
}) {
  const [job, setJob] = useState<JobResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch(`/api/analyze/${jobId}`);
        const data: JobResponse = await res.json();
        if (!active) return;

        setJob(data);

        if (data.status === "completed") {
          router.push(`/result/${username}`);
          return;
        }
        if (data.status === "failed") return;

        setTimeout(poll, 1500);
      } catch {
        if (active) setTimeout(poll, 3000);
      }
    }

    poll();
    return () => {
      active = false;
    };
  }, [jobId, username, router]);

  const statusToStep: Record<string, number> = {
    pending: 0,
    scraping: 0,
    following: 1,
    analyzing: 2,
    ai_report: 3,
    completed: 4,
  };
  const currentStep = statusToStep[job?.status ?? "pending"] ?? 0;

  return (
    <div className="card-elevated mx-auto w-full max-w-md text-center">
      <div className="mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center gap-1">
          {stickerPalette.slice(0, 4).map((color) => (
            <span
              key={color}
              className="sticker-dot"
              style={{ backgroundColor: color, width: 12, height: 12 }}
            />
          ))}
        </div>
        <h1 className="type-heading-2">@{username} 분석 중</h1>
        <p className="type-body-sm mt-2 text-ink-muted">
          {job?.message ?? "준비 중..."}
        </p>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-canvas-soft">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${job?.progress ?? 5}%` }}
        />
      </div>

      <div className="space-y-2">
        {STEPS.map((step, i) => {
          const isActive = i === currentStep;
          const isDone = i < currentStep || job?.status === "completed";
          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 rounded-md px-4 py-2.5 type-body-sm ${
                isActive
                  ? "border border-hairline bg-canvas-soft text-ink"
                  : isDone
                    ? "text-ink-muted"
                    : "text-ink-faint"
              }`}
            >
              <span className="w-5 text-center">
                {isDone ? (
                  <span className="text-accent-green">✓</span>
                ) : isActive ? (
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-primary"
                  />
                ) : (
                  "○"
                )}
              </span>
              {step.label}
            </div>
          );
        })}
      </div>

      {job?.status === "failed" && (
        <div className="type-body-sm mt-6 rounded-lg border border-accent-orange/30 bg-canvas-soft p-4 text-accent-orange">
          {job.error ?? "분석에 실패했습니다."}
        </div>
      )}
    </div>
  );
}
