"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

const photos = [
  {
    src: "/about/IMG_2012.JPG",
    alt: "Petting a rabbit at a bunny cafe in San Francisco",
    caption: "Bunny Cafe in SF (i need a pet bunny)",
  },
  {
    src: "/about/IMG_0494.JPG",
    alt: "A group of friends hiking in the woods at Mount Tamalpais",
    caption: "13 mile hike at Mt Tam",
  },
  {
    src: "/about/IMG_2270.jpg",
    alt: "A visit to Children's National Hospital headquarters in DC",
    caption: "childrens national hospital hq in dc",
  },
  {
    src: "/about/tech_events.webp",
    alt: "Students standing beside an NVIDIA banner at a campus tech event",
    caption: "tech events on campus",
  },
  {
    src: "/about/8628123b-dd6a-43c9-85e2-2ba1d3735d15.jpg",
    alt: "First hackathon win in high school",
    caption: "first hackathon win in highschool",
  },
  {
    src: "/about/IMG_2268.jpg",
    alt: "A childhood photo at a computer",
    caption: "me writing my first pr (jk)",
  },
];

const pageNumber = (index: number) => String(index + 1).padStart(2, "0");
const photoIndex = (index: number) => (index % photos.length + photos.length) % photos.length;
// Repeated sets let either end continue in the same scroll direction.
const loopingPhotos = [...photos, ...photos, ...photos];

export default function Lookbook() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const pendingIndexRef = useRef<number | null>(null);
  const widthRef = useRef(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function alignPhoto() {
      if (!track || track.clientWidth === widthRef.current) return;
      widthRef.current = track.clientWidth;
      pendingIndexRef.current = null;
      track.scrollTo({
        left: (photos.length + activeIndexRef.current) * track.clientWidth,
        behavior: "instant",
      });
    }

    alignPhoto();
    const observer = new ResizeObserver(alignPhoto);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  function scrollToSlide(index: number) {
    const track = trackRef.current;
    if (!track) return;
    pendingIndexRef.current = photoIndex(index);
    track.scrollTo({ left: index * track.clientWidth });
  }

  function move(direction: number) {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;

    const currentIndex = pendingIndexRef.current ?? activeIndexRef.current;
    const middleSlide = photos.length + currentIndex;

    // Finish an interrupted move in the middle set before starting the next one.
    // This also keeps repeated clicks from reaching either physical scroll limit.
    if (Math.abs(track.scrollLeft - middleSlide * track.clientWidth) > 1) {
      track.scrollTo({
        left: middleSlide * track.clientWidth,
        behavior: "instant",
      });
    }
    scrollToSlide(middleSlide + direction);
  }

  function recenter() {
    const track = trackRef.current;
    if (!track || !track.clientWidth || pendingIndexRef.current !== null) return;

    const slide = Math.round(track.scrollLeft / track.clientWidth);
    if (Math.abs(track.scrollLeft - slide * track.clientWidth) > 1) return;

    if (slide < photos.length || slide >= photos.length * 2) {
      // Rebase only on a snapped photo, so swiping never jumps mid-image.
      track.scrollTo({
        left: (photos.length + photoIndex(slide)) * track.clientWidth,
        behavior: "instant",
      });
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        move(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        move(1);
        break;
      case "Home":
        event.preventDefault();
        scrollToSlide(photos.length);
        break;
      case "End":
        event.preventDefault();
        scrollToSlide(photos.length * 2 - 1);
        break;
    }
  }

  return (
    <section
      className="lookbook"
      aria-label="Photo lookbook"
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
    >
      <div className="lookbook-heading">
        <h1>lookbook</h1>
        <span className="lookbook-count" aria-hidden="true">
          <span>{pageNumber(activeIndex)}</span> / {pageNumber(photos.length - 1)}
        </span>
      </div>

      <p id="lookbook-instructions" className="sr-only">
        Swipe or use the left and right arrow keys to browse photos.
      </p>

      <div
        id="lookbook-photos"
        className="lookbook-track"
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Photos"
        aria-describedby="lookbook-instructions"
        onScroll={(event) => {
          const track = event.currentTarget;
          if (!track.clientWidth || track.clientWidth !== widthRef.current) return;
          const slide = Math.round(track.scrollLeft / track.clientWidth);
          const index = photoIndex(slide);
          if (
            pendingIndexRef.current === index &&
            Math.abs(track.scrollLeft - slide * track.clientWidth) <= 1
          ) {
            pendingIndexRef.current = null;
          }
          activeIndexRef.current = index;
          setActiveIndex(index);
          // Scroll events also keep the loop working without a scrollend event.
          recenter();
        }}
        onScrollEnd={recenter}
        onPointerDown={() => { pendingIndexRef.current = null; }}
        onWheel={() => { pendingIndexRef.current = null; }}
      >
        {loopingPhotos.map((photo, index) => (
          <div
            key={`${photo.src}-${index}`}
            className="lookbook-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index % photos.length + 1} of ${photos.length}`}
            aria-hidden={index !== photos.length + activeIndex}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 600px) calc(100vw - 48px), 552px"
              className="lookbook-photo"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="lookbook-footer">
        <p className="lookbook-caption" aria-live="polite" aria-atomic="true">
          <span className="sr-only">Photo {activeIndex + 1} of {photos.length}: </span>
          {photos[activeIndex].caption}
        </p>
        <div className="lookbook-arrows">
          <button
            type="button"
            className="lookbook-arrow"
            aria-label="Previous photo"
            aria-controls="lookbook-photos"
            onClick={() => move(-1)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m10 5-7 7 7 7M3 12h18" />
            </svg>
          </button>
          <button
            type="button"
            className="lookbook-arrow"
            aria-label="Next photo"
            aria-controls="lookbook-photos"
            onClick={() => move(1)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m14 5 7 7-7 7M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
