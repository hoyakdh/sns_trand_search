"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchForm({ variant = "default" }: { variant?: "default" | "hero" }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isHero = variant === "hero";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = username.replace(/^@/, "").trim();
    if (!clean) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: clean }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다.");
        return;
      }

      router.push(`/analyze/${data.username}?jobId=${data.jobId}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex gap-2 ${isHero ? "flex-col sm:flex-row" : ""}`}>
        <div className="relative flex-1">
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 type-body-sm ${
              isHero ? "text-ink-faint" : "text-ink-faint"
            }`}
          >
            @
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="instagram_username"
            className="text-input"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className={isHero ? "btn-secondary shrink-0" : "btn-primary shrink-0"}
        >
          {loading ? "분석 중..." : "분석 시작"}
        </button>
      </div>
      {error && (
        <p className="type-caption mt-2 text-accent-orange">{error}</p>
      )}
    </form>
  );
}
