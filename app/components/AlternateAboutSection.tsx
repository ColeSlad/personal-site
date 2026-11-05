import Image from "next/image";

const photos = [
  { src: "/about/IMG_2367.webp", alt: "Pine trees framing a lake and mountains at sunset", width: 2400, height: 1800, className: "about-photo-landscape" },
  { src: "/about/IMG_4269.webp", alt: "A platter of marbled beef at a restaurant", width: 1800, height: 2400, className: "about-photo-food" },
  { src: "/about/IMG_4756.webp", alt: "A river winding through forested hills below a rocky overlook", width: 1170, height: 1560, className: "about-photo-overlook" },
];

export default function AlternateAboutSection() {
  return (
    <section id="about" className="orbital-about alternate-about-content" data-space-chapter="intro" aria-labelledby="about-title">
      <div className="about-panels">
        <div className="about-panel about-introduction">
          <h2 id="about-title" className="about-title">Hi, I’m Cole<span>.</span></h2>
          <p>I’m a computer science student and Presidential Scholar at the University of Maryland.</p>
          <p>I’m obsessed with <strong>efficiency, low-level systems, and making things run well.</strong> I’m always building and researching projects to explore new ideas.</p>

          <section className="about-interests" aria-labelledby="outside-title">
            <h3 id="outside-title">Outside the editor</h3>
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
        </div>

        <section className="about-panel about-background about-education" data-space-chapter="education" aria-labelledby="education-title">
          <h3 id="education-title">Education</h3>
          <h4>University of Maryland</h4>
          <p>Computer Science</p>
          <span>Presidential Scholar</span>
        </section>
      </div>

      <section className="about-photo-section" data-space-chapter="life" aria-labelledby="life-title">
        <div className="about-photo-heading">
          <h3 id="life-title">A few moments from life.</h3>
        </div>
        <div className="about-photos">
          {photos.map((photo) => (
            <figure key={photo.src} className={`about-photo ${photo.className}`}>
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={photo.className === "about-photo-landscape" ? "(max-width: 1000px) 85vw, 1120px" : "(max-width: 699px) 85vw, (max-width: 1000px) 42vw, 550px"} />
            </figure>
          ))}
        </div>
      </section>

      <footer className="about-signoff" data-space-chapter="contact">
        <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com <span aria-hidden="true">↗</span></a>
        <div>
          <a href="https://github.com/ColeSlad" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <a href="https://linkedin.com/in/cole-sladowsky" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </footer>
    </section>
  );
}
