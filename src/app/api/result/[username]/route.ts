import { NextRequest, NextResponse } from "next/server";
import { getCachedResult } from "@/lib/cache";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const result = await getCachedResult(username);

  if (!result) {
    return NextResponse.json(
      { error: "분석 결과를 찾을 수 없습니다. 다시 분석해주세요." },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
