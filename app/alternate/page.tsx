import type { Metadata } from "next";
import ThemeSwitch from "../components/ThemeSwitch";
import AlternateHeader from "../components/AlternateHeader";
import AlternateAboutSection from "../components/AlternateAboutSection";
import SpaceCredits from "../components/SpaceCredits";
import { workExperience } from "../lib/experience";

export const metadata: Metadata = {
  title: "Another side — Cole Sladowsky",
  description: "Orbit Io, Jupiter’s colorful volcanic moon, on the other side of Cole Sladowsky’s site.",
};

export default function Alternate() {
  return (
    <main className="alternate-page alternate-orbit-page">
      <ThemeSwitch returnToMain />
      <AlternateHeader />

      <div className="orbital-journey">
        <section id="orbit" className="orbit-chapter orbit-hero" data-space-chapter="orbit" aria-labelledby="orbit-title">
          <div className="orbit-copy">
            <h1 id="orbit-title">Cole<br />Sladowsky<span>.</span></h1>
            <p>Efficiency. Low-level systems.<br />Making things run well.</p>
            <a className="orbit-scroll-cue" href="#work">Scroll to explore <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section id="work" className="orbit-chapter orbit-work" data-space-chapter="work" aria-labelledby="orbit-work-title">
          <div className="orbit-copy">
            <h2 id="orbit-work-title">Built to<br />run well.</h2>
            <section className="orbit-work-group" aria-labelledby="orbit-experience-title">
              <h3 id="orbit-experience-title">Experience</h3>
              <ol className="orbit-experience">
                {workExperience.map((item) => (
                  <li key={item.company}>
                    <div className="orbit-experience-heading">
                      <h4>{item.company}</h4>
                      {item.date && <span>{item.date}</span>}
                    </div>
                    <p className="orbit-experience-role">{item.role}</p>
                    {item.description && <p className="orbit-experience-description">{item.description}</p>}
                  </li>
                ))}
              </ol>
            </section>
            <section className="orbit-work-group" aria-labelledby="orbit-projects-title">
              <h3 id="orbit-projects-title">Selected projects</h3>
              <div className="orbit-projects">
                <a href="https://flowstate-web-ten.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <span className="orbit-project-tech">C++ · CUDA · AVX2</span>
                  <h4>Flowstate <span aria-hidden="true">↗</span></h4>
                  <p>Vector search across CPU and GPU.</p>
                </a>
                <a href="https://github.com/ColeSlad/inference-lab" target="_blank" rel="noopener noreferrer">
                  <span className="orbit-project-tech">Python · PyTorch · vLLM</span>
                  <h4>inference-lab <span aria-hidden="true">↗</span></h4>
                  <p>Benchmarking how language models run.</p>
                </a>
              </div>
            </section>
            <a className="orbit-text-link" href="#about">More about me <span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <AlternateAboutSection />
      </div>

      <footer className="alternate-footer">
        <SpaceCredits />
      </footer>
    </main>
  );
}
