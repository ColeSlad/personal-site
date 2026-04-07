import Image from "next/image";
import DateTime from "./components/DateTime";

export default function Home() {
  return (
    <main className="main">

      <header className="header">
        <div className="logo-wrap">
          <Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority />
          <DateTime />
        </div>
          <div className="date-time">
        </div>
      </header>

      <div className="content">
        <h1 className="sr-only">Cole Sladowsky</h1>
        <nav className="nav">
          <ul>
            <li><a href="#about">about</a></li>
            <li><a href="#experience">experience</a></li>
            <li><a href="#projects">projects</a></li>
            <li><a href="#skills">skills</a></li>
            <li><a href="#contact">contact</a></li>
          </ul>
        </nav>
      </div>

    </main>
  );
}
