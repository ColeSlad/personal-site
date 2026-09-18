"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Contribution } from "../lib/github-contributions";

const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});

function describeDay(day: Contribution) {
  const date = dateFormat.format(new Date(`${day.date}T00:00:00Z`));
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${date}`;
}

export default function ContributionCalendar({ contributions }: { contributions: Contribution[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const firstWeekday = new Date(`${contributions[0].date}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((firstWeekday + contributions.length) / 7);
  const total = contributions.reduce((sum, day) => sum + day.count, 0);
  const activeIndex = hoveredIndex ?? focusedIndex;
  const calendarStyle = { "--calendar-weeks": weeks } as CSSProperties;

  useEffect(() => {
    const scroll = scrollRef.current;
    if (scroll) scroll.scrollLeft = scroll.scrollWidth;
  }, [contributions.length]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowLeft": nextIndex = index - 7; break;
      case "ArrowRight": nextIndex = index + 7; break;
      case "ArrowUp": nextIndex = index - 1; break;
      case "ArrowDown": nextIndex = index + 1; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = contributions.length - 1; break;
      default: return;
    }
    event.preventDefault();
    dayRefs.current[Math.max(0, Math.min(nextIndex, contributions.length - 1))]?.focus();
  }

  return (
    <>
      <p id="github-calendar-help" className="sr-only">
        Daily contributions over the last year. Use arrow keys to explore days and weeks,
        or Home and End to jump to the first and last day.
      </p>
      <div className="github-calendar-scroll" ref={scrollRef}>
        <div className="github-calendar" style={calendarStyle}>
          <div className="github-months" aria-hidden="true">
            {contributions.map((day, index) => {
              const date = new Date(`${day.date}T00:00:00Z`);
              const week = Math.floor((firstWeekday + index) / 7);
              if (date.getUTCDate() !== 1 || week > weeks - 3) return null;
              return (
                <span key={day.date} style={{ gridColumn: `${week + 1} / span 3` }}>
                  {monthNames[date.getUTCMonth()]}
                </span>
              );
            })}
          </div>
          <div className="github-calendar-body">
            <div className="github-weekdays" aria-hidden="true">
              <span style={{ gridRow: 2 }}>m</span>
              <span style={{ gridRow: 4 }}>w</span>
              <span style={{ gridRow: 6 }}>f</span>
            </div>
            <div className="github-days" role="group" aria-label="Daily GitHub contributions" aria-describedby="github-calendar-help">
              {contributions.map((day, index) => (
                <button
                  key={day.date}
                  type="button"
                  ref={(element) => { dayRefs.current[index] = element; }}
                  className="github-day"
                  data-level={day.level}
                  style={{
                    gridColumn: Math.floor((firstWeekday + index) / 7) + 1,
                    gridRow: (firstWeekday + index) % 7 + 1,
                  }}
                  aria-label={describeDay(day)}
                  tabIndex={index === (focusedIndex ?? contributions.length - 1) ? 0 : -1}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => {
                    setFocusedIndex(index);
                    setHoveredIndex(null);
                  }}
                  onBlur={() => setFocusedIndex(null)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="github-calendar-footer">
        <p className="github-calendar-summary">
          {activeIndex === null ? (
            <><span>{total.toLocaleString("en-US")}</span> contributions in the last year</>
          ) : describeDay(contributions[activeIndex])}
        </p>
        <div className="github-legend" aria-label="Contribution intensity, from fewer to more">
          <span>less</span>
          {[0, 1, 2, 3, 4].map((level) => <i key={level} className="github-day" data-level={level} aria-hidden="true" />)}
          <span>more</span>
        </div>
      </div>
    </>
  );
}
