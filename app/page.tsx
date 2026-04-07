export default function Home() {
  return (
    <main className="main">

      <header className="header">
        <div className="logo-wrap">
          <div className="logo-placeholder" />
        </div>
        <div className="date-time">
          cole sladowsky
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
