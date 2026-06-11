import Link from "next/link";

export function NavBar() {
  return (
    <header className="nav-bar">
      <Link href="/" className="type-title text-ink no-underline">
        InstaInsight
      </Link>
      <nav className="hidden items-center gap-6 sm:flex">
        <Link href="/" className="type-body-sm text-ink-secondary no-underline">
          분석
        </Link>
      </nav>
      <Link href="/" className="btn-utility text-sm no-underline">
        시작하기
      </Link>
    </header>
  );
}
