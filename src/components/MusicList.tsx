import type { MusicStat } from "@/lib/types";
import { stickerPalette } from "@/lib/design-tokens";

export function MusicList({
  music,
  originalAudioRatio,
}: {
  music: MusicStat[];
  originalAudioRatio: number;
}) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="type-heading-3">음악 TOP 10</h3>
        <span className="type-caption text-ink-muted">
          오리지널 오디오 {originalAudioRatio}%
        </span>
      </div>

      {music.length === 0 ? (
        <p className="type-body-sm text-ink-muted">릴스 음악 데이터가 없습니다.</p>
      ) : (
        <div className="space-y-1">
          {music.map((m, i) => (
            <div
              key={`${m.title}-${m.artist}`}
              className="flex items-center gap-3 rounded-md px-3 py-2"
            >
              <span className="type-caption w-6 text-center text-ink-faint">
                {i + 1}
              </span>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ backgroundColor: stickerPalette[i % stickerPalette.length] }}
              >
                {m.isOriginalAudio ? "🎤" : "🎵"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="type-body-sm truncate font-medium">{m.title}</div>
                <div className="type-caption truncate text-ink-faint">{m.artist}</div>
              </div>
              <span className="type-body-sm text-ink-muted">{m.count}회</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
