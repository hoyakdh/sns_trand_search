"use client";

import type { AnalysisResult } from "@/lib/types";
import { ProfileCard } from "./ProfileCard";
import { AIReport } from "./AIReport";
import { HashtagChart } from "./HashtagChart";
import { HashtagWordCloud } from "./HashtagWordCloud";
import { MusicList } from "./MusicList";
import { PostingHeatmap } from "./PostingHeatmap";
import { EngagementStats } from "./EngagementStats";
import { FollowingAnalysis } from "./FollowingAnalysis";
import { ContentTypeAnalysis } from "./ContentTypeAnalysis";
import { CaptionToneAnalysis } from "./CaptionToneAnalysis";
import { ExportActions } from "./ExportActions";

export function ResultDashboard({
  result,
  showExport = true,
  exportTargetId = "report-export",
}: {
  result: AnalysisResult;
  showExport?: boolean;
  exportTargetId?: string;
}) {
  return (
    <div className="space-y-6">
      {showExport && <ExportActions result={result} exportTargetId={exportTargetId} />}

      <div id={exportTargetId} className="space-y-6">
        <ProfileCard
          profile={result.profile}
          postCount={result.postCount}
          reelCount={result.reelCount}
        />

        <AIReport report={result.aiReport} />

        {result.stats.contentType && (
          <ContentTypeAnalysis data={result.stats.contentType} />
        )}

        {result.stats.captionTone && (
          <CaptionToneAnalysis data={result.stats.captionTone} />
        )}

        {result.following && <FollowingAnalysis following={result.following} />}

        <EngagementStats stats={result.stats.engagement} />

        <div className="grid gap-6 lg:grid-cols-2">
          <HashtagChart hashtags={result.stats.hashtags} />
          <HashtagWordCloud hashtags={result.stats.hashtags} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MusicList
            music={result.stats.music}
            originalAudioRatio={result.stats.originalAudioRatio}
          />
          <PostingHeatmap timeSlots={result.stats.timeSlots} />
        </div>
      </div>
    </div>
  );
}
