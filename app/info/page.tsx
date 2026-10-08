import Image from "next/image";
import { Suspense } from "react";
import DateTime from "../components/DateTime";
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
            i&apos;m a cs student and presidential scholar at the university of maryland. i&apos;m
            extremely passionate about learning new technologies. i&apos;m obsessed with efficiency, low-level
            systems, and making things run well.
          </p>
          <p className="info-body">
            i&apos;m always working on and researching for projects
            to explore new ideas. when i&apos;m not
            coding, you can find me at the gym, making instapot recipes, watching basketball, hiking,
            or listening to music (Lil Uzi Vert is my favorite). i also love
            meeting new people and spending time with friends and family.
            feel free to reach me at{' '}
            <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>.
          </p>

          <Suspense fallback={<p className="github-loading" role="status">loading github contributions…</p>}>
            <GitHubContributions />
          </Suspense>
        </section>

      </div>
    </main>
  );
}
