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
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-date">may 2026 – present</span>
              </div>
              <div className="exp-company">Visa</div>
              <ul className="exp-bullets">
                <li>designed a Python and LangGraph agent pipeline that researches flagged merchants with Playwright, pulls records, and drafts fraud reports, cutting investigation from 2 hours to 15 minutes across 100+ merchants a day</li>
                <li>built a caching layer that reuses prior research across related merchant families, reducing AI inference cost 25%</li>
                <li>cross-checked five LLMs against each other to filter unreliable output, improving report quality 14%</li>
                <li>benchmarked quality, cost, and latency across models and prompts, surfacing a setup that cut cost 40% at equal quality</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer</span>
                <span className="exp-date">jan 2026 – may 2026</span>
              </div>
              <div className="exp-company">MITRE Corporation (via App Dev Club, UMD)</div>
              <ul className="exp-bullets">
                <li>built SCOUT, a React and Node.js NIST search platform used by 100+ compliance staff, cutting review effort 95%</li>
                <li>engineered a pipeline that indexes 1,000+ policy documents (50K+ pages) in PostgreSQL for semantic search</li>
                <li>developed a RACI matrix generator that streamlines stakeholder responsibility mapping, cutting creation time 25%</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-date">sep 2025 – dec 2025</span>
              </div>
              <div className="exp-company">Children&apos;s National Hospital</div>
              <ul className="exp-bullets">
                <li>built a React and Flask platform for brain-MRI upload and AI segmentation, cutting radiologist time per scan 30%</li>
                <li>integrated an imaging viewer that displays scans with AI tumor overlays, supporting deployment across 5+ hospitals</li>
                <li>moved GPU inference to background jobs, raising throughput to 100+ scans/hour</li>
                <li>automated testing and Docker deployment on GitHub Actions so releases ship without manual steps</li>
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
