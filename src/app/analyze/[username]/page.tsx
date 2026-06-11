import { ProgressTracker } from "@/components/ProgressTracker";
import Link from "next/link";

export default async function AnalyzePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ jobId?: string }>;
}) {
  const { username } = await params;
  const { jobId } = await searchParams;

  if (!jobId) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="card text-center">
          <p className="type-body-md text-ink-muted">잘못된 접근입니다.</p>
          <Link href="/" className="link-primary type-body-sm mt-4 inline-block">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <ProgressTracker jobId={jobId} username={username} />
    </main>
  );
}
