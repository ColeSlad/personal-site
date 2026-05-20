import Image from "next/image";
import DateTime from "../components/DateTime";

export default function Info() {
  return (
    <main className="main info-page">

      <header className="header">
        <div className="logo-wrap">
          <a href="/"><Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority /></a>
          <DateTime />
        </div>
      </header>

      <div className="info-content">

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
            coding, you can find me playing at the gym, watching basketball, 
            or spending time with friends and family. feel free to reach me at{' '}
            <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>.
          </p>
        </section>

        <section id="experience" className="info-section">
          <h2 className="info-heading">experience</h2>
          <div className="exp-list">

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Incoming Software Engineer Intern</span>
                <span className="exp-date">may 2026 – aug 2026</span>
              </div>
              <div className="exp-company">Visa</div>
              <ul className="exp-bullets">
                <li>automated payment fraud disruption team</li>
                <li>VAS ecosystem & operational risk</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-date">jan 2026 – may 2026</span>
              </div>
              <div className="exp-company">MITRE Corporation</div>
              <ul className="exp-bullets">
                <li className="coming-soon">details coming soon</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-date">sep 2025 – dec 2025</span>
              </div>
              <div className="exp-company">Children&apos;s National Hospital</div>
              <ul className="exp-bullets">
                <li>built dockerized brain tumor segmentation tool (React + Flask) with a team of 15, improving clinical workflow by 30%</li>
                <li>integrated custom OHIF-based DICOM viewer for MRI visualization, deployed across 5+ hospitals</li>
                <li>designed REST APIs and modular architecture to streamline collaboration and scalability</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-date">jun 2024 – aug 2024</span>
              </div>
              <div className="exp-company">RU Residence</div>
              <ul className="exp-bullets">
                <li>co-engineered Python–Flask–SQL system with Google Sheets integration to track $100K+ in finances, reducing manual input by 80%</li>
                <li>automated reconciliation workflows with Google Apps Script to improve financial accuracy</li>
                <li>reduced reported system issues by 35% through ongoing maintenance and feature work</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Machine Learning Research</span>
                <span className="exp-date">sep 2023 – jun 2024</span>
              </div>
              <div className="exp-company">Ingredion Idea Lab</div>
              <ul className="exp-bullets">
                <li>built CNN with PyTorch to predict popcorn popping times, achieving 20% accuracy improvement</li>
                <li>designed and preprocessed dataset of 1,000+ images with iterative model tuning</li>
                <li>presented findings to 20+ faculty members and industry partners</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Instructional Intern</span>
                <span className="exp-date">jun 2023 – mar 2024</span>
              </div>
              <div className="exp-company">Game-U</div>
              <ul className="exp-bullets">
                <li>instructed 100+ students (including learners with disabilities) in Unity (C#), Python, and Scratch</li>
                <li>assisted with curriculum development and classroom technology setup</li>
              </ul>
            </div>

          </div>
        </section>

        <section id="projects" className="info-section">
          <h2 className="info-heading">projects</h2>
          <div className="exp-list">

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
              <span className="skill-vals">Python · JavaScript · TypeScript · Java · C · C# · SQL · HTML/CSS</span>
            </div>
            <div className="skill-row">
              <span className="skill-label">frameworks</span>
              <span className="skill-vals">React.js · Next.js · Node.js · Express.js · React Native · Flask · PyTorch</span>
            </div>
            <div className="skill-row">
              <span className="skill-label">tools</span>
              <span className="skill-vals">Firebase · Docker · Git · Unity · AWS S3 · PostgreSQL · MongoDB</span>
            </div>
            <div className="skill-row">
              <span className="skill-label">other</span>
              <span className="skill-vals">REST APIs · CI/CD · Agile Development · cross-functional collaboration · team leadership</span>
            </div>
          </div>
        </section>

        <section id="contact" className="info-section">
          <h2 className="info-heading">contact</h2>
          <div className="contact-list">
            <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>
            <a href="https://linkedin.com/in/cole-sladowsky" target="_blank" rel="noopener noreferrer">linkedin</a>
            <a href="https://github.com/ColeSlad" target="_blank" rel="noopener noreferrer">github</a>
          </div>
        </section>

      </div>
    </main>
  );
}
