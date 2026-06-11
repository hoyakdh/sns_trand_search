import Link from "next/link";
import { getCachedResult } from "@/lib/cache";
import { ResultDashboard } from "@/components/ResultDashboard";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const result = await getCachedResult(username);

  if (!result) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="card-elevated max-w-md text-center">
          <p className="type-body-md text-ink-muted">
            @{username}의 분석 결과를 찾을 수 없습니다.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex no-underline">
            다시 분석하기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-main py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="link-primary type-body-sm">
          ← 새로운 분석
        </Link>
        <span className="badge-pill">@{username}</span>
      </div>
      <ResultDashboard result={result} />
      <p className="type-caption mt-8 text-center text-ink-faint">
        분석 시각: {new Date(result.analyzedAt).toLocaleString("ko-KR")}
      </p>
    </main>
  );
}
