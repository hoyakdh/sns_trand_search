"use client";

import type { CaptionToneAnalysis as CaptionToneAnalysisType } from "@/lib/types";
import { stickerPalette } from "@/lib/design-tokens";

const TONE_LABELS = {
  casual: "캐주얼",
  formal: "격식",
  mixed: "혼합",
};

export function CaptionToneAnalysis({ data }: { data: CaptionToneAnalysisType }) {
  return (
    <div className="card">
      <span className="badge-pill mb-3">캡션</span>
      <h3 className="type-heading-3 mb-1">캡션 톤 분석</h3>
      <p className="type-body-md mb-6 text-ink-secondary">{data.toneSummary}</p>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "말투", value: TONE_LABELS[data.tone] },
          { label: "한국어", value: `${data.koreanRatio}%` },
          { label: "영어", value: `${data.englishRatio}%` },
          { label: "질문형", value: `${data.questionRatio}%` },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="type-title text-primary">{item.value}</div>
            <div className="type-caption mt-1 text-ink-faint">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h4 className="type-eyebrow mb-3 text-ink-muted">자주 쓰는 단어</h4>
          <div className="flex flex-wrap gap-2">
            {data.topWords.slice(0, 12).map((w, i) => (
              <span key={w.word} className="badge-pill">
                <span
                  className="sticker-dot mr-1.5 inline-block"
                  style={{
                    backgroundColor: stickerPalette[i % stickerPalette.length],
                    width: 6,
                    height: 6,
                  }}
                />
                {w.word}
                <span className="ml-1 text-ink-faint">{w.count}</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="type-eyebrow mb-3 text-ink-muted">자주 쓰는 이모지</h4>
          {data.topEmojis.length === 0 ? (
            <p className="type-body-sm text-ink-faint">이모지 사용이 적습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {data.topEmojis.map((e) => (
                <span
                  key={e.emoji}
                  className="flex items-center gap-1 rounded-md border border-hairline px-3 py-2"
                  title={`${e.count}회`}
                >
                  <span className="text-xl">{e.emoji}</span>
                  <span className="type-caption text-ink-faint">{e.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
