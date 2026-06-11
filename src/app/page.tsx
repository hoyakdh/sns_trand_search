import { SearchForm } from "@/components/SearchForm";
import { RecentAnalyses } from "@/components/RecentAnalyses";

const FEATURES = [
  { emoji: "#️⃣", label: "해시태그 분석", accent: "bg-accent-sky" },
  { emoji: "🎵", label: "음악 사용 분석", accent: "bg-accent-pink" },
  { emoji: "👥", label: "팔로잉 분석", accent: "bg-accent-teal" },
  { emoji: "🤖", label: "AI 성향 리포트", accent: "bg-accent-purple" },
];

export default function HomePage() {
  return (
    <>
      <section className="hero-band">
        <div className="container-main text-center">
          <span className="badge-pill mb-6 inline-flex border-white/20 bg-white/10 text-white">
            Instagram Analytics
          </span>
          <h1 className="type-display-1 mb-4 text-white">
            인스타그램 성향 분석
          </h1>
          <p className="type-body-md mx-auto mb-8 max-w-lg text-white/80">
            아이디를 검색하면 해시태그, 음악, 팔로잉, 활동 패턴을 한눈에
            파악합니다
          </p>
          <div className="mx-auto max-w-lg">
            <SearchForm variant="hero" />
          </div>
        </div>
      </section>

      <main className="container-main py-16">
        <RecentAnalyses />

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="card overflow-hidden p-0">
              <div className={`${f.accent} px-4 py-3 text-center text-xl`}>
                {f.emoji}
              </div>
              <p className="type-body-sm px-4 py-4 text-center text-ink-muted">
                {f.label}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
