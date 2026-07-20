import Image from "next/image";
import DateTime from "../components/DateTime";

export default function Experience() {
  return (
    <main className="main info-page">

      <header className="header">
        <div className="logo-wrap">
          <a href="/"><Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority /></a>
          <DateTime />
        </div>
      </header>

      <div className="info-content">

        <section className="info-section">
          <h2 className="info-heading">experience</h2>
          <div className="exp-list">

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Incoming Software Engineer Intern</span>
                <span className="exp-date">may 2026 – present</span>
              </div>
              <div className="exp-company">Visa</div>
              <ul className="exp-bullets">
                <li>automated payment fraud disruption (graph and AI for fraud detection)</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer</span>
                <span className="exp-date">jan 2026 – may 2026</span>
              </div>
              <div className="exp-company">MITRE Corporation (via App Dev Club, UMD)</div>
              <ul className="exp-bullets">
                <li>built SCOUT, a full-stack platform for plain-language NIST framework search and policy-change alerts (React, Node.js, Express, PostgreSQL)</li>
                <li>built an ingestion pipeline for NIST PDF parsing with 384-dim HuggingFace embeddings and S3/pgvector storage in one request</li>
                <li>cut RACI matrix creation time 25% with a generator that streamlines stakeholder responsibility mapping</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-date">sep 2025 – dec 2025</span>
              </div>
              <div className="exp-company">Children&apos;s National Hospital</div>
              <ul className="exp-bullets">
                <li>built a web platform to upload multi-modal brain MRI (DICOM & NIfTI) and run deep-learning tumor segmentation, improving clinical workflow 30%</li>
                <li>integrated the OHIF / Cornerstone3D viewer to render studies with AI tumor overlays, deployed across 5+ hospitals</li>
                <li>engineered async segmentation orchestration with GPU inference, live progress bar, and auto-converted DICOM-SEG output to hot-reload the viewer</li>
                <li>authored a Vitest and React Testing Library suite of 100+ tests, shipped via Docker and GitHub Actions CI</li>
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

      </div>
    </main>
  );
}
