export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-main flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="type-caption text-ink-muted">
          InstaInsight — 인스타그램 성향 분석
        </span>
        <span className="type-caption text-ink-faint">
          공개 계정만 분석 가능합니다
        </span>
      </div>
    </footer>
  );
}
