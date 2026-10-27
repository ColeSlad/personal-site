import type { Metadata } from "next";
import Image from "next/image";
import AlternateHeader from "../../components/AlternateHeader";
import SpaceCredits from "../../components/SpaceCredits";
import ThemeSwitch from "../../components/ThemeSwitch";

export const metadata: Metadata = {
  title: "About — Cole Sladowsky",
  description: "A little more about Cole: computer science, low-level systems, and life outside the editor.",
};

const experience = [
  { company: "Amazon Leo", role: "Software Engineer (Contract)" },
  { company: "Visa", role: "Software Engineer Intern", date: "May – Aug 2026" },
  { company: "MITRE", role: "Software Engineer (Contract)", date: "Jan – May 2026" },
  { company: "Children’s National", role: "Software Engineer Intern", date: "Sep – Dec 2025" },
];

const photos = [
  { src: "/about/IMG_2367.webp", alt: "Pine trees framing a lake and mountains at sunset", width: 2400, height: 1800, className: "about-photo-landscape" },
  { src: "/about/IMG_4269.webp", alt: "A platter of marbled beef at a restaurant", width: 1800, height: 2400, className: "about-photo-food" },
  { src: "/about/IMG_4756.webp", alt: "A river winding through forested hills below a rocky overlook", width: 1170, height: 1560, className: "about-photo-overlook" },
];

export default function AlternateAbout() {
  return (
    <main className="alternate-page alternate-about-page">
      <ThemeSwitch returnToMain />
      <AlternateHeader current="about" />

      <div className="orbital-about">
        <div className="about-panels">
          <section className="about-panel about-introduction" aria-labelledby="about-title">
            <h1 id="about-title">Hi, I’m Cole<span>.</span></h1>
            <p>I’m a computer science student and Presidential Scholar at the University of Maryland.</p>
            <p>I’m obsessed with <strong>efficiency, low-level systems, and making things run well.</strong> I’m always building and researching projects to explore new ideas.</p>

            <section className="about-interests" aria-labelledby="outside-title">
              <h2 id="outside-title">Outside the editor</h2>
              <ul>
                <li>At the gym, out hiking, or watching basketball.</li>
                <li>Trying another Instant Pot recipe.</li>
                <li>Listening to Lil Uzi Vert.</li>
              </ul>
            </section>

            <a className="about-email" href="mailto:coleslad31@gmail.com">
              Say hello <span aria-hidden="true">↗</span>
              <span className="sr-only">by email at coleslad31@gmail.com</span>
            </a>
          </section>

          <div className="about-panel about-background">
            <section aria-labelledby="experience-title">
              <h2 id="experience-title">Selected experience</h2>
              <ul className="about-experience-list">
                {experience.map((item) => (
                  <li key={item.company}>
                    <div className="about-experience-heading">
                      <h3>{item.company}</h3>
                      {item.date && <span>{item.date}</span>}
                    </div>
                    <p>{item.role}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="about-education" aria-labelledby="education-title">
              <h2 id="education-title">Education</h2>
              <h3>University of Maryland</h3>
              <p>Computer Science</p>
              <span>Presidential Scholar</span>
            </section>
          </div>
        </div>

        <section className="about-photo-section" aria-labelledby="life-title">
          <div className="about-photo-heading">
            <h2 id="life-title">A few moments from life.</h2>
          </div>
          <div className="about-photos">
            {photos.map((photo) => (
              <figure key={photo.src} className={`about-photo ${photo.className}`}>
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={photo.className === "about-photo-landscape" ? "(max-width: 1000px) 85vw, 1120px" : "(max-width: 699px) 85vw, (max-width: 1000px) 42vw, 550px"} />
              </figure>
            ))}
          </div>
        </section>

        <footer className="about-signoff">
          <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com <span aria-hidden="true">↗</span></a>
          <div>
            <a href="https://github.com/ColeSlad" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href="https://linkedin.com/in/cole-sladowsky" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
        </footer>
      </div>

      <footer className="alternate-footer about-attribution"><SpaceCredits /></footer>
    </main>
  );
}
