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
            coding, you can find me at the gym, watching basketball, hiking,
            or listening to music (Lil Uzi Vert is my favorite). i also love
            meeting new people and spending time with friends and family.
            feel free to reach me at{' '}
            <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>.
          </p>

          <div className="about-grid">
            <div className="about-grid-item">
              <div className="about-grid-img">
                <Image src="/about/IMG_2012.JPG" alt="caption" fill className="about-grid-photo" style={{ objectPosition: '50% 35%' }} />
              </div>
              <p className="about-grid-caption">Bunny Cafe in SF (i need a pet bunny)</p>
            </div>
            <div className="about-grid-item">
              <div className="about-grid-img">
                <Image src="/about/IMG_0494.JPG" alt="caption" fill className="about-grid-photo" style={{ objectPosition: '75% 50%' }} />
              </div>
              <p className="about-grid-caption">13 mile hike at Mt Tam</p>
            </div>
            <div className="about-grid-item">
              <div className="about-grid-img">
                <Image src="/about/IMG_2270.jpg" alt="caption" fill className="about-grid-photo" />
              </div>
              <p className="about-grid-caption">childrens national hospital hq in dc</p>
            </div>
            <div className="about-grid-item">
              <div className="about-grid-img">
                <Image src="/about/tech_events.webp" alt="caption" fill className="about-grid-photo" />
              </div>
              <p className="about-grid-caption">tech events on campus</p>
            </div>
            <div className="about-grid-item">
              <div className="about-grid-img">
                <Image src="/about/8628123b-dd6a-43c9-85e2-2ba1d3735d15.jpg" alt="caption" fill className="about-grid-photo" />
              </div>
              <p className="about-grid-caption">first hackathon win in highschool</p>
            </div>
            <div className="about-grid-item">
              <div className="about-grid-img">
                <Image src="/about/IMG_2268.jpg" alt="caption" fill className="about-grid-photo" />
              </div>
              <p className="about-grid-caption">me writing my first pr (jk)</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
