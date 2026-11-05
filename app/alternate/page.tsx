import type { Metadata } from "next";
import ThemeSwitch from "../components/ThemeSwitch";
import AlternateHeader from "../components/AlternateHeader";
import SpaceCredits from "../components/SpaceCredits";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Another side — Cole Sladowsky",
  description: "Orbit Io, Jupiter’s colorful volcanic moon, on the other side of Cole Sladowsky’s site.",
};

export default function Alternate() {
  return (
    <main className="alternate-page alternate-orbit-page">
      <ThemeSwitch returnToMain />
      <AlternateHeader current="orbit" />

      <div className="orbital-journey">
        <section className="orbit-chapter orbit-hero" data-space-chapter="orbit" aria-labelledby="orbit-title">
          <div className="orbit-copy">
            <h1 id="orbit-title">Cole<br />Sladowsky<span>.</span></h1>
            <p>Efficiency. Low-level systems.<br />Making things run well.</p>
            <a className="orbit-scroll-cue" href="#approach">Scroll to explore <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section id="approach" className="orbit-chapter orbit-approach" data-space-chapter="approach" aria-labelledby="approach-title">
          <div className="orbit-copy">
            <h2 id="approach-title">Closer to<br />the details.</h2>
            <p>I’m a computer science student at Maryland. I like understanding what happens underneath—and finding ways to make it faster.</p>
            <Link className="orbit-text-link" href="/alternate/about">About me <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section id="work" className="orbit-chapter orbit-work" data-space-chapter="work" aria-labelledby="orbit-work-title">
          <div className="orbit-copy">
            <h2 id="orbit-work-title">Built to<br />run well.</h2>
            <div className="orbit-projects">
              <a href="https://flowstate-web-ten.vercel.app/" target="_blank" rel="noopener noreferrer">
                <span className="orbit-project-tech">C++ · CUDA · AVX2</span>
                <h3>Flowstate <span aria-hidden="true">↗</span></h3>
                <p>Vector search across CPU and GPU.</p>
              </a>
              <a href="https://github.com/ColeSlad/inference-lab" target="_blank" rel="noopener noreferrer">
                <span className="orbit-project-tech">Python · PyTorch · vLLM</span>
                <h3>inference-lab <span aria-hidden="true">↗</span></h3>
                <p>Benchmarking how language models run.</p>
              </a>
            </div>
            <Link className="orbit-text-link" href="/alternate/about">More about me <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </div>

      <footer className="alternate-footer">
        <SpaceCredits />
      </footer>
    </main>
  );
}
