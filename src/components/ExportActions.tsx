"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { exportResultToPdf } from "@/lib/export-pdf";

export function ExportActions({
  result,
  exportTargetId = "report-export",
}: {
  result: AnalysisResult;
  exportTargetId?: string;
}) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<"share" | "pdf" | null>(null);
  const [message, setMessage] = useState("");

  async function handleShare() {
    setLoading("share");
    setMessage("");
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: result.username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "공유 링크 생성 실패");
        return;
      }
      setShareUrl(data.url);
      await navigator.clipboard.writeText(data.url);
      setMessage("공유 링크가 클립보드에 복사되었습니다. (7일간 유효)");
    } catch {
      setMessage("공유 링크 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  }

  async function handlePdf() {
    setLoading("pdf");
    setMessage("");
    try {
      await exportResultToPdf(result, exportTargetId);
      setMessage("PDF가 저장되었습니다.");
    } catch {
      setMessage("PDF 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="type-title">리포트보내기</h3>
        <p className="type-caption mt-1 text-ink-muted">
          공유 링크 또는 PDF로 분석 결과를 저장하세요
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleShare}
          disabled={loading !== null}
          className="btn-secondary"
        >
          {loading === "share" ? "생성 중..." : "공유 링크"}
        </button>
        <button
          type="button"
          onClick={handlePdf}
          disabled={loading !== null}
          className="btn-primary"
        >
          {loading === "pdf" ? "저장 중..." : "PDF 저장"}
        </button>
      </div>
      {(message || shareUrl) && (
        <p className="type-caption w-full text-ink-muted sm:col-span-2">
          {message}
          {shareUrl && (
            <span className="mt-1 block break-all text-primary">{shareUrl}</span>
          )}
        </p>
      )}
    </div>
  );
}
