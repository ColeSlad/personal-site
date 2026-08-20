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
          <div className="project-grid">

            <a href="https://github.com/ColeSlad/inference-lab" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="exp-head">
                <span className="exp-role">inference-lab</span>
              </div>
              <div className="exp-company">Python · FastAPI · PyTorch · vLLM · Docker</div>
              <ul className="exp-bullets">
                <li>benchmarking platform for LLM inference across 3 serving backends</li>
              </ul>
              {/*
              <ul className="exp-bullets">
                <li>built a common serving and benchmarking layer for three model backends, backed by 50 GPU-free streaming tests</li>
                <li>executed 4,320 requests with zero failures across 36 trials, showing vLLM throughput scaled 25x to 32 concurrent</li>
                <li>automated a qualification gate that rejected a backend passing all 5 performance targets, catching output instability</li>
              </ul>
              */}
            </a>

            <a href="https://github.com/ColeSlad/GRCUT" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="exp-head">
                <span className="exp-role">GRCUT</span>
              </div>
              <div className="exp-company">Python · NetworkX · Pyvis · pandas</div>
              <ul className="exp-bullets">
                <li>graph-based fraud ring detection with 97% precision</li>
              </ul>
              {/*
              <ul className="exp-bullets">
                <li>diagnosed and fixed an inverted scoring bug, more than tripling ranking quality (F1 0.15 to 0.52) and reaching 97% precision on flagged accounts, cutting false declines on legitimate customers</li>
                <li>modeled 590K transactions as a 13,553-node, 370K-edge card co-occurrence graph linking shared device fingerprints, billing addresses, and email domains, surfacing coordinated fraud rings that per-transaction checks miss</li>
                <li>implemented Dinic&apos;s max-flow and Gusfield&apos;s Gomory-Hu tree from scratch in pure Python, validated against NetworkX across 20 unit tests</li>
              </ul>
              */}
            </a>

            <a href="https://github.com/ColeSlad/DA3-Parallax-Viewer" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="exp-head">
                <span className="exp-role">Parallax</span>
              </div>
              <div className="exp-company">Python · FastAPI · React · Three.js · DA3 · TRELLIS</div>
              <ul className="exp-bullets">
                <li>turns photos into interactive 3D scenes</li>
              </ul>
              {/*
              <ul className="exp-bullets">
                <li>pipeline turning raw photos into interactive 3D scenes (depth → dense point cloud → Gaussian splat), deployed across two Modal serverless GPU containers (L4 and A100)</li>
                <li>cut reconstruction latency 7x (35 min → 5 min) by restructuring the GPU pipeline and splitting container images by workload</li>
                <li>added generative 3D asset insertion so users can describe an object in plain language and place it in their scene, halving per-insertion time by generating assets in parallel with scene prep</li>
              </ul>
              */}
            </a>

            <a href="https://github.com/ColeSlad/entrain" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="exp-head">
                <span className="exp-role">Entrain</span>
              </div>
              <div className="exp-company">TypeScript · React · Three.js · C++17 · WebAssembly</div>
              <ul className="exp-bullets">
                <li>turns a song into a synced 3D dance</li>
              </ul>
              {/*
              <ul className="exp-bullets">
                <li>pipeline turning an uploaded song into a rigged 3D character dancing in sync: EDGE diffusion generates SMPL motion on a serverless GPU (Modal), retargeted to a Mixamo skeleton and rendered in-browser with Three.js</li>
                <li>delivered 8–11x speedup by porting motion math from TypeScript to a C++17/WebAssembly core with zero-copy heap I/O</li>
                <li>drove a live demo of 250+ independently simulated dancers at 0.29ms/frame, cutting motion math from 19% to under 2% of the 60fps frame budget</li>
                <li>guaranteed correctness with a harness checking every C++/WebAssembly result against the TypeScript reference</li>
              </ul>
              */}
            </a>

            <a href="https://linkly-liart.vercel.app/ColeSladowsky" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="exp-head">
                <span className="exp-role">linkly</span>
              </div>
              <div className="exp-company">React · Next.js · Express.js · MongoDB · Tailwind</div>
              <ul className="exp-bullets">
                <li>linktree-style link-in-bio platform</li>
              </ul>
              {/*
              <ul className="exp-bullets">
                <li>full-stack linktree-style platform with JWT-based auth and REST APIs. deployed on vercel + render.</li>
              </ul>
              */}
            </a>

            <a href="http://lostandfound-fawn.vercel.app/" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="exp-head">
                <span className="exp-role">lost it, found it</span>
              </div>
              <div className="exp-company">React · TypeScript · Flask · PostgreSQL · AWS S3</div>
              <ul className="exp-bullets">
                <li>multi-tenant lost-and-found inventory platform</li>
              </ul>
              {/*
              <ul className="exp-bullets">
                <li>multi-tenant SaaS inventory platform with org isolation, invite-code team management, image uploads, and automated item matching.</li>
              </ul>
              */}
            </a>

            <a href="https://github.com/ColeSlad/KryptoNotes" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="exp-head">
                <span className="exp-role">kryptonotes</span>
              </div>
              <div className="exp-company">React Native · Expo · TypeScript · Express.js · Firebase</div>
              <ul className="exp-bullets">
                <li>encrypted note-taking app with biometric auth</li>
              </ul>
              {/*
              <ul className="exp-bullets">
                <li>secure note-taking app with Argon2id encryption, Firebase backend, and native biometric auth (FaceID, TouchID, Iris).</li>
              </ul>
              */}
            </a>

            <a href="https://github.com/ColeSlad/hackathon" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="exp-head">
                <span className="exp-role">trojan hacks — 2nd place</span>
              </div>
              <div className="exp-company">React · OpenAI API · Google Maps API</div>
              <ul className="exp-bullets">
                <li>AI + Google Maps hackathon project, 2nd place</li>
              </ul>
              {/*
              <ul className="exp-bullets">
                <li>hackathon project integrating OpenAI and Google Maps APIs. built with a 3-person team under a 24-hour deadline, placing 2nd among 50+ teams.</li>
              </ul>
              */}
            </a>

          </div>
        </section>

        <section id="skills" className="info-section">
          <h2 className="info-heading">skills</h2>
          <div className="skills-table">
            <div className="skill-row">
              <span className="skill-label">languages</span>
              <span className="skill-vals">Python · JavaScript · TypeScript · Java · C · C++ · C# · SQL · x86 Assembly · HTML/CSS</span>
            </div>
            <div className="skill-row">
              <span className="skill-label">frameworks</span>
              <span className="skill-vals">React.js · Next.js · Node.js · Express.js · React Native · Flask · Spring Boot · FastAPI · PyTorch</span>
            </div>
            <div className="skill-row">
              <span className="skill-label">tools</span>
              <span className="skill-vals">AWS · Firebase · Docker · Git · PostgreSQL · Redis · MongoDB · Modal · LangChain · LangGraph · Playwright · vLLM · Prometheus · WebAssembly</span>
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
