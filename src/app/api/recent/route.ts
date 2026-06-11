import { NextResponse } from "next/server";
import { getRecentAnalyses } from "@/lib/cache";

export async function GET() {
  const recent = await getRecentAnalyses(10);
  return NextResponse.json(recent);
}
