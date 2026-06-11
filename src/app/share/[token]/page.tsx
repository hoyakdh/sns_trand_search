import Link from "next/link";
import { getSharedResult } from "@/lib/share";
import { ResultDashboard } from "@/components/ResultDashboard";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await getSharedResult(token);

  if (!result) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="card-elevated max-w-md text-center">
          <p className="type-body-md text-ink-muted">
            공유 링크가 만료되었거나 존재하지 않습니다.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex no-underline">
            새로 분석하기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-main py-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="badge-pill">공유 리포트</span>
        <span className="type-caption text-ink-faint">@{result.username}</span>
      </div>
      <ResultDashboard result={result} showExport={false} />
      <p className="type-caption mt-8 text-center text-ink-faint">
        분석 시각: {new Date(result.analyzedAt).toLocaleString("ko-KR")} · 7일간 유효
      </p>
    </main>
  );
}
