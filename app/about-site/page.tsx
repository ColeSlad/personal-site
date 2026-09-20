import Image from "next/image";
import DateTime from "../components/DateTime";

export default function AboutSite() {
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
          <h2 className="info-heading">this site</h2>
          <p className="info-body">
            i built this site to share my projects, experience, and photos.
            it&apos;s a place to see what i&apos;m working on and what i&apos;m into
            outside of coding. i wanted it to feel personal and be easy to browse.
          </p>
        </section>

        <section className="info-section">
          <h2 className="info-heading">inspiration</h2>
          <p className="info-body">
            i own more than 25 supreme pieces. i&apos;ve been into the brand for years,
            from the graphics and collaborations to the way it presents everything.
            that interest shaped the design of this site.
          </p>
          <p className="info-body">
            the layout takes inspiration from{' '}
            <a href="https://supremenewyork.com" target="_blank" rel="noopener noreferrer">supreme&apos;s website</a>.
            courier new, red accents, and a live nyc clock sit on a black background.
            the navigation is simple, with room for the work and photos to stand out.
          </p>
        </section>

        <section className="info-section">
          <h2 className="info-heading">built with</h2>
          <p className="info-body">
            built with next.js and hosted on vercel. the source code is on{' '}
            <a href="https://github.com/ColeSlad/personal-site" target="_blank" rel="noopener noreferrer">github</a>{' '}
            if you want to see how it works.
          </p>
        </section>

      </div>

    </main>
  );
}
