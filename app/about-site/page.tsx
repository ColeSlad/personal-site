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
          <h2 className="info-heading">why i built this</h2>
          <p className="info-body">
            most personal sites are cluttered — portfolios dtm, full of
            gradients, animations, and hover effects that exist for their own sake.
            i wanted something that felt intentional. a site where the work speaks
            louder than the design.
          </p>
          <p className="info-body">
            the constraint was the point. by stripping everything back, what&apos;s left
            has to earn its place. every link, every line of text is there because it
            needs to be.
          </p>
        </section>

        <section className="info-section">
          <h2 className="info-heading">about supreme</h2>
          <p className="info-body">
            supreme is a new york streetwear brand founded in 1994 by james jebbia.
            beyond the clothing, it&apos;s become one of the most studied brands in the
            world — known for its drop model, its collaborations, and the culture it
            helped build around scarcity and authenticity.
          </p>
          <p className="info-body">
            but what drew me in was their website. <a href="https://supremenewyork.com" target="_blank" rel="noopener noreferrer">supremenewyork.com</a> is
            one of the most iconic sites on the internet — not because of what it has,
            but because of what it doesn&apos;t. no hero image, no video background,
            no parallax scroll. just courier new, black on white, and deliberate silence.
          </p>
          <p className="info-body">
            they&apos;ve sold hundreds of millions of dollars in product using a site that
            most designers would call unfinished. that says something.
          </p>
        </section>

        <section className="info-section">
          <h2 className="info-heading">my relationship with supreme</h2>
          <p className="info-body">
            i&apos;ve been into supreme for years. it started the way it starts for most
            people — seeing a piece, not fully understanding the hype, then falling down
            a rabbit hole you never fully climb out of.
          </p>
          <p className="info-body">
            what kept me around wasn&apos;t just the clothing. it was the culture. the
            thursday drops, the anticipation, the way a single box logo tee could carry
            so much weight. supreme figured out how to make people genuinely care about
            a product release, and they&apos;ve sustained that for over thirty years.
          </p>
          <p className="info-body">
            the collabs are a big part of it too. supreme x louis vuitton, supreme x
            nike, supreme x the north face — each one felt like an event. they have a
            taste level that&apos;s hard to fake, and a consistency that most brands
            spend their whole existence chasing.
          </p>
          <p className="info-body">
            at this point supreme is more than a brand to me. it&apos;s a case study in
            how to build something people genuinely love. that&apos;s the energy i
            wanted this site to carry.
          </p>
        </section>

        <section className="info-section">
          <h2 className="info-heading">the design</h2>
          <p className="info-body">
            the homepage is pure black with the logo and a live nyc clock — a direct
            nod to supreme&apos;s layout. the info pages flip to white, borrowing
            their interior page aesthetic. the font is courier new throughout. no custom
            typeface, no google font. just the system default.
          </p>
          <p className="info-body">
            the red highlight on hover is supreme&apos;s signature box logo color —
            #ed1c24. it&apos;s the only color on the site.
          </p>
          <p className="info-body">
            built with next.js, deployed on vercel.
            source is on <a href="https://github.com/ColeSlad/personal-site" target="_blank" rel="noopener noreferrer">github</a>.
          </p>
        </section>

      </div>

    </main>
  );
}
