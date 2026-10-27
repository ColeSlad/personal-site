import Link from "next/link";

export default function AlternateHeader({ current }: { current: "orbit" | "about" }) {
  return (
    <header className="alternate-header">
      <Link href="/alternate" className="alternate-name">cole sladowsky</Link>
      <nav className="alternate-navigation" aria-label="Space navigation">
        <Link href="/alternate" aria-current={current === "orbit" ? "page" : undefined}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="3" stroke="currentColor" />
            <ellipse cx="10" cy="10" rx="9" ry="4" stroke="currentColor" transform="rotate(-35 10 10)" />
          </svg>
          Orbit
        </Link>
        <Link href="/alternate/about" aria-current={current === "about" ? "page" : undefined}>About</Link>
      </nav>
    </header>
  );
}
