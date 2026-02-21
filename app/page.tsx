export default function Home() {
  return (
    <div className="site-wrap">

      {/* ── HEADER ── */}
      <header className="site-header">
        <p className="sys-line">
          COLE_SLADOWSKY.EXE v1.0 &nbsp;·&nbsp; <span className="ok">LOADED OK</span> &nbsp;·&nbsp; <span className="ok">DC / NYC</span>
        </p>

        <div className="name-row">
          <span className="name">COLE SLADOWSKY</span>
          <span className="cursor">█</span>
        </div>

        <p className="tagline">
          <span className="prompt">$</span>
          cs @ university of maryland &nbsp;//&nbsp; class of 2027 &nbsp;//&nbsp; software engineer
        </p>

        <nav className="nav">
          <a href="#about">about</a>
          <a href="#experience">experience</a>
          <a href="#projects">projects</a>
          <a href="#skills">skills</a>
          <a href="#contact">contact</a>
        </nav>

        <hr className="header-rule" />
      </header>

      {/* ── ABOUT ── */}
      <section id="about" className="section">
        <h2 className="section-title">▶ about.txt</h2>
        <div className="about-body">
          <p>
            i&apos;m a cs student at the university of maryland building full-stack web apps,
            ml projects, and mobile tools. i&apos;ve shipped production code for a children&apos;s
            hospital, engineered saas platforms, and am currently working with MITRE as a contracted software engineering intern. 
            i&apos;m passionate about building tools that solve real problems and have a positive impact on users. 
          </p>
          <p>
            i like to listen to music, go to the gym, and of course, code! feel free to reach out to me at {' '}
            <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>
            {' '}or find me on{' '}
            <a href="https://github.com/ColeSlad" target="_blank" rel="noopener noreferrer">
              github
            </a>
            .
          </p>
          <div className="project-links" style={{marginTop: '1rem'}}>
            <a href="https://linkly-liart.vercel.app/ColeSladowsky" target="_blank" rel="noopener noreferrer" className="demo-link">my linkly profile ↗</a>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section">
        <h2 className="section-title">▶ experience.log</h2>
        <div className="exp-list">

          <div className="exp-item">
            <div className="exp-head">
              <span className="exp-role">Software Engineer Intern</span>
              <span className="exp-date">jan 2026 – present</span>
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

      {/* ── PROJECTS ── */}
      <section id="projects" className="section">
        <h2 className="section-title">▶ projects/</h2>
        <div className="projects-grid">

          <div className="project-card">
            <div className="project-name">
              <a href="https://linkly-liart.vercel.app/ColeSladowsky" target="_blank" rel="noopener noreferrer" className="project-link">
                linkly<span className="slash">/</span>
              </a>
            </div>
            <p className="project-desc">
              full-stack linktree-style platform with JWT-based auth and REST APIs. deployed on vercel + render.
            </p>
            <div className="project-stack">
              {['React', 'Next.js', 'Express.js', 'MongoDB', 'Tailwind'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="project-card">
            <div className="project-name">
              <a href="http://lostandfound-fawn.vercel.app/" target="_blank" rel="noopener noreferrer" className="project-link">
                lost it, found it<span className="slash">/</span>
              </a>
            </div>
            <p className="project-desc">
              multi-tenant SaaS inventory platform with org isolation, invite-code team management, image uploads, and automated item matching.
            </p>
            <div className="project-stack">
              {['React', 'TypeScript', 'Flask', 'PostgreSQL', 'AWS S3'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="project-card">
            <div className="project-name">
              <a href="https://github.com/ColeSlad/KryptoNotes" target="_blank" rel="noopener noreferrer" className="project-link">
                kryptonotes<span className="slash">/</span>
              </a>
            </div>
            <p className="project-desc">
              secure note-taking app with Argon2id encryption, Firebase backend, and native biometric auth (FaceID, TouchID, Iris).
            </p>
            <div className="project-stack">
              {['React Native', 'Expo', 'TypeScript', 'Express.js', 'Firebase'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="project-card">
            <div className="project-name">
              <a href="https://github.com/ColeSlad/hackathon" target="_blank" rel="noopener noreferrer" className="project-link">
                trojan hacks<span className="slash">/</span>
              </a>
              <span className="project-badge">2nd place</span>
            </div>
            <p className="project-desc">
              hackathon project integrating OpenAI and Google Maps APIs. built with a 3-person team under a 24-hour deadline, placing 2nd among 50+ teams.
            </p>
            <div className="project-stack">
              {['React', 'OpenAI API', 'Google Maps API'].map(t => (
                <span key={t} className={t !== 'React' ? 'tag hi' : 'tag'}>{t}</span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section">
        <h2 className="section-title">▶ skills.sys</h2>
        <div className="skills-table">
          <div className="skill-row">
            <span className="skill-label">languages</span>
            <span className="skill-vals">
              <strong>Python</strong> · <strong>JavaScript</strong> · <strong>TypeScript</strong> · <strong>Java</strong> · <strong>C#</strong> · <strong>SQL</strong> · <strong>HTML/CSS</strong>
            </span>
          </div>
          <div className="skill-row">
            <span className="skill-label">frameworks</span>
            <span className="skill-vals">
              <strong>React.js</strong> · <strong>Next.js</strong> · <strong>Node.js</strong> · <strong>Express.js</strong> · <strong>React Native</strong> · <strong>Flask</strong> · <strong>PyTorch</strong>
            </span>
          </div>
          <div className="skill-row">
            <span className="skill-label">tools</span>
            <span className="skill-vals">
              <strong>Firebase</strong> · <strong>Docker</strong> · <strong>Git</strong> · <strong>Unity</strong> · <strong>AWS S3</strong> · <strong>PostgreSQL</strong> · <strong>MongoDB</strong>
            </span>
          </div>
          <div className="skill-row">
            <span className="skill-label">other</span>
            <span className="skill-vals">
              REST APIs · CI/CD · Agile Development · cross-functional collaboration · team leadership
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER / CONTACT ── */}
      <footer id="contact" className="site-footer">
        <div className="contact-links">
          <a href="mailto:coleslad31@gmail.com">email</a>
          <a href="https://github.com/ColeSlad" target="_blank" rel="noopener noreferrer">github</a>
          <a href="https://linkedin.com/in/cole-sladowsky" target="_blank" rel="noopener noreferrer">linkedin</a>
        </div>
        <div className="footer-meta">
          <p className="copyright">© 2026 cole sladowsky &nbsp;·&nbsp; college park, md</p>
          <p className="visitor">// best viewed at any resolution &nbsp;·&nbsp; visitors: ████</p>
        </div>
      </footer>

    </div>
  );
}
