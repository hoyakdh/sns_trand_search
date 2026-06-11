import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCachedResult } from "@/lib/cache";
import { createJob, completeJob } from "@/lib/jobs";
import { runAnalysis } from "@/lib/analyzer";

const BodySchema = z.object({
  username: z
    .string()
    .min(1)
    .max(30)
    .regex(/^[a-zA-Z0-9._]+$/, "올바른 인스타그램 아이디를 입력하세요."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = BodySchema.parse(body);
    const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();

    const cached = await getCachedResult(cleanUsername);
    if (cached) {
      const job = createJob(cleanUsername);
      completeJob(job.id, cached);
      return NextResponse.json({
        jobId: job.id,
        username: cleanUsername,
        cached: true,
      });
    }

    const job = createJob(cleanUsername);

    // Run analysis in background (non-blocking)
    runAnalysis(job.id, cleanUsername).catch(console.error);

    return NextResponse.json({
      jobId: job.id,
      username: cleanUsername,
      cached: false,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "잘못된 입력입니다." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
