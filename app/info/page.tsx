import Image from "next/image";
import { Suspense } from "react";
import DateTime from "../components/DateTime";
import Lookbook from "../components/Lookbook";
import GitHubContributions from "../components/GitHubContributions";

export default function Info() {
  return (
    <main className="main info-page">

      <header className="header">
        <div className="logo-wrap">
          <a href="/"><Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority /></a>
          <DateTime />
        </div>
      </header>

      <div className="info-content about-content">

        <section id="about" className="info-section">
          <h2 className="info-heading">about</h2>
          <p className="info-body">
            i&apos;m a cs student at the university of maryland. I&apos;m
            passionate about learning new technologies and building things
            important to me.
          </p>
          <p className="info-body">
            i love to learn by doing, and i&apos;m always working on projects
            to explore new ideas and sharpen my skills. when i&apos;m not
            coding, you can find me at the gym, watching basketball, hiking,
            or listening to music (Lil Uzi Vert is my favorite). i also love
            meeting new people and spending time with friends and family.
            feel free to reach me at{' '}
            <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>.
          </p>

          <Lookbook />
          <Suspense fallback={<p className="github-loading" role="status">loading github contributions…</p>}>
            <GitHubContributions />
          </Suspense>
        </section>

      </div>
    </main>
  );
}
