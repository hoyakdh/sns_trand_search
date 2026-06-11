import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createShareLink } from "@/lib/share";

const BodySchema = z.object({
  username: z.string().min(1).max(30),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = BodySchema.parse(body);
    const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();

    const token = await createShareLink(cleanUsername);
    if (!token) {
      return NextResponse.json(
        { error: "분석 결과를 찾을 수 없습니다. 먼저 분석을 완료해주세요." },
        { status: 404 }
      );
    }

    const baseUrl = request.nextUrl.origin;
    return NextResponse.json({
      token,
      url: `${baseUrl}/share/${token}`,
      expiresInDays: 7,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
