import Image from "next/image";
import DateTime from "../components/DateTime";

export default function Contact() {
  return (
    <main className="main info-page">

      <header className="header">
        <div className="logo-wrap">
          <a href="/"><Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority /></a>
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
        <a href="/">home</a>
        <div className="contact-footer-links">
          <a href="/info">about</a>
          <a href="/experience">experience</a>
          <a href="/projects">projects</a>
          <a href="/projects#skills">skills</a>
        </div>
      </footer>

    </main>
  );
}
