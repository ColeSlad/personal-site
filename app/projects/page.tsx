import Image from "next/image";
import DateTime from "../components/DateTime";

export default function Projects() {
  return (
    <main className="main info-page">

      <header className="header">
        <div className="logo-wrap">
          <a href="/"><Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority /></a>
          <DateTime />
        </div>
      </header>

      <div className="info-content">

        <section id="projects" className="info-section">
          <h2 className="info-heading">projects</h2>
          <div className="exp-list">

            <div className="exp-item">
              <div className="exp-head">
                <a href="https://github.com/ColeSlad/GRCUT" target="_blank" rel="noopener noreferrer" className="exp-role exp-link">GRCUT</a>
              </div>
              <div className="exp-company">Python · NetworkX · Pyvis · pandas</div>
              <ul className="exp-bullets">
                <li>diagnosed and fixed an inverted scoring bug, more than tripling ranking quality (F1 0.15 to 0.52) and reaching 97% precision on flagged accounts, cutting false declines on legitimate customers</li>
                <li>modeled 590K transactions as a 13,553-node, 370K-edge card co-occurrence graph linking shared device fingerprints, billing addresses, and email domains, surfacing coordinated fraud rings that per-transaction checks miss</li>
                <li>implemented Dinic&apos;s max-flow and Gusfield&apos;s Gomory-Hu tree from scratch in pure Python, validated against NetworkX across 20 unit tests</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <a href="https://github.com/ColeSlad/DA3-Parallax-Viewer" target="_blank" rel="noopener noreferrer" className="exp-role exp-link">Parallax</a>
              </div>
              <div className="exp-company">Python · FastAPI · React · Three.js · DA3 · TRELLIS</div>
              <ul className="exp-bullets">
                <li>pipeline turning raw photos into interactive 3D scenes (depth → dense point cloud → Gaussian splat), deployed across two Modal serverless GPU containers (L4 and A100)</li>
                <li>cut reconstruction latency 7x (35 min → 5 min) by restructuring the GPU pipeline and splitting container images by workload</li>
                <li>added generative 3D asset insertion so users can describe an object in plain language and place it in their scene, halving per-insertion time by generating assets in parallel with scene prep</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <a href="https://github.com/ColeSlad/entrain" target="_blank" rel="noopener noreferrer" className="exp-role exp-link">Entrain</a>
              </div>
              <div className="exp-company">TypeScript · React · Three.js · C++17 · WebAssembly</div>
              <ul className="exp-bullets">
                <li>pipeline turning an uploaded song into a rigged 3D character dancing in sync: EDGE diffusion generates SMPL motion on a serverless GPU (Modal), retargeted to a Mixamo skeleton and rendered in-browser with Three.js</li>
                <li>delivered 8–11x speedup by porting motion math from TypeScript to a C++17/WebAssembly core with zero-copy heap I/O</li>
                <li>drove a live demo of 250+ independently simulated dancers at 0.29ms/frame, cutting motion math from 19% to under 2% of the 60fps frame budget</li>
                <li>guaranteed correctness with a harness checking every C++/WebAssembly result against the TypeScript reference</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <a href="https://linkly-liart.vercel.app/ColeSladowsky" target="_blank" rel="noopener noreferrer" className="exp-role exp-link">linkly</a>
              </div>
              <div className="exp-company">React · Next.js · Express.js · MongoDB · Tailwind</div>
              <ul className="exp-bullets">
                <li>full-stack linktree-style platform with JWT-based auth and REST APIs. deployed on vercel + render.</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <a href="http://lostandfound-fawn.vercel.app/" target="_blank" rel="noopener noreferrer" className="exp-role exp-link">lost it, found it</a>
              </div>
              <div className="exp-company">React · TypeScript · Flask · PostgreSQL · AWS S3</div>
              <ul className="exp-bullets">
                <li>multi-tenant SaaS inventory platform with org isolation, invite-code team management, image uploads, and automated item matching.</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <a href="https://github.com/ColeSlad/KryptoNotes" target="_blank" rel="noopener noreferrer" className="exp-role exp-link">kryptonotes</a>
              </div>
              <div className="exp-company">React Native · Expo · TypeScript · Express.js · Firebase</div>
              <ul className="exp-bullets">
                <li>secure note-taking app with Argon2id encryption, Firebase backend, and native biometric auth (FaceID, TouchID, Iris).</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <a href="https://github.com/ColeSlad/hackathon" target="_blank" rel="noopener noreferrer" className="exp-role exp-link">trojan hacks — 2nd place</a>
              </div>
              <div className="exp-company">React · OpenAI API · Google Maps API</div>
              <ul className="exp-bullets">
                <li>hackathon project integrating OpenAI and Google Maps APIs. built with a 3-person team under a 24-hour deadline, placing 2nd among 50+ teams.</li>
              </ul>
            </div>

          </div>
        </section>

        <section id="skills" className="info-section">
          <h2 className="info-heading">skills</h2>
          <div className="skills-table">
            <div className="skill-row">
              <span className="skill-label">languages</span>
              <span className="skill-vals">Python · JavaScript · TypeScript · Java · C · C++ · SQL · x86 Assembly · HTML/CSS</span>
            </div>
            <div className="skill-row">
              <span className="skill-label">frameworks</span>
              <span className="skill-vals">React.js · Next.js · Node.js · Express.js · React Native · Flask · Spring Boot · FastAPI · PyTorch</span>
            </div>
            <div className="skill-row">
              <span className="skill-label">tools</span>
              <span className="skill-vals">AWS · Firebase · Docker · Git · PostgreSQL · MongoDB · Modal · LangChain · LangGraph · Playwright · WebAssembly</span>
            </div>
            <div className="skill-row">
              <span className="skill-label">other</span>
              <span className="skill-vals">REST APIs · CI/CD · Agile Development · cross-functional collaboration · team leadership</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
