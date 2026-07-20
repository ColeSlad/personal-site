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
                <li>building collaborative agentic tools at Visa for fraud detection</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer</span>
                <span className="exp-date">jan 2026 – may 2026</span>
              </div>
              <div className="exp-company">MITRE Corporation (via App Dev Club, UMD)</div>
              <ul className="exp-bullets">
                <li>building a NIST compliance search platform at MITRE</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-date">sep 2025 – dec 2025</span>
              </div>
              <div className="exp-company">Children&apos;s National Hospital</div>
              <ul className="exp-bullets">
                <li>building an AI brain MRI segmentation platform at Children&apos;s National</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-date">jun 2024 – aug 2024</span>
              </div>
              <div className="exp-company">RU Residence</div>
              <ul className="exp-bullets">
                <li>building a finance tracking system at RU Residence</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Machine Learning Research</span>
                <span className="exp-date">sep 2023 – jun 2024</span>
              </div>
              <div className="exp-company">Ingredion Idea Lab</div>
              <ul className="exp-bullets">
                <li>researching CNNs at Ingredion to predict popcorn pop times</li>
              </ul>
            </div>

            <div className="exp-item">
              <div className="exp-head">
                <span className="exp-role">Instructional Intern</span>
                <span className="exp-date">jun 2023 – mar 2024</span>
              </div>
              <div className="exp-company">Game-U</div>
              <ul className="exp-bullets">
                <li>teaching game development and coding at Game-U</li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
