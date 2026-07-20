"use client";

import Image from "next/image";
import DateTime from "../components/DateTime";
import { useState, FormEvent } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:coleslad31@gmail.com?subject=Message from ${name}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="main info-page">

      <header className="header">
        <div className="logo-wrap">
          <a href="/"><Image src="/logo.png" alt="Cole Sladowsky" width={180} height={54} priority /></a>
          <DateTime />
        </div>
      </header>

      <div className="contact-wrap">
        {sent ? (
          <p className="contact-sent">message sent.</p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2 className="contact-title">contact</h2>
            <div className="contact-row">
              <input
                className="contact-input"
                type="text"
                placeholder="your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                className="contact-input"
                type="email"
                placeholder="your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <textarea
              className="contact-textarea"
              placeholder="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
            <button className="contact-btn" type="submit">send</button>
          </form>
        )}
        <div className="contact-list">
          <a href="mailto:coleslad31@gmail.com">coleslad31@gmail.com</a>
          <a href="https://linkedin.com/in/cole-sladowsky" target="_blank" rel="noopener noreferrer">linkedin</a>
          <a href="https://github.com/ColeSlad" target="_blank" rel="noopener noreferrer">github</a>
        </div>
      </div>

      <footer className="contact-footer">
        <a href="/">home</a>
        <div className="contact-footer-links">
          <a href="/info">about</a>
          <a href="/experience">experience</a>
          <a href="/projects">projects</a>
          <a href="/projects#skills">skills</a>
        </div>
      </footer>

    </main>
  );
}
