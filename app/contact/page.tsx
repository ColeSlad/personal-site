import Link from "next/link";
import Image from "next/image";
import DateTime from "../components/DateTime";

export default function Contact() {
  return (
    <main className="main info-page">

      <header className="header">
        <div className="logo-wrap">
          <Link href="/"><Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority /></Link>
          <DateTime />
        </div>
      </header>

      <div className="contact-wrap">
        <p className="contact-intro">
          if you&apos;re curious, contact me at <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>
        </p>
        <div className="contact-list">
          <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>
          <a href="https://linkedin.com/in/cole-sladowsky" target="_blank" rel="noopener noreferrer">linkedin</a>
          <a href="https://github.com/ColeSlad" target="_blank" rel="noopener noreferrer">github</a>
        </div>
      </div>

      <footer className="contact-footer">
        <Link href="/">home</Link>
        <div className="contact-footer-links">
          <Link href="/info">about</Link>
          <Link href="/experience">experience</Link>
          <Link href="/projects">projects</Link>
          <Link href="/projects#skills">skills</Link>
        </div>
      </footer>

    </main>
  );
}
