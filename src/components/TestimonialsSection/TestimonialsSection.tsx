"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import "./tims-testimonials-section.css";

type Testimonial = {
  name: string;
  initial: string;
  timeAgo: string;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Dheeraj Suresh",
    initial: "D",
    timeAgo: "4 months ago",
    text: "Excellent! 🎉",
  },
  {
    name: "Shaiju",
    initial: "S",
    timeAgo: "4 months ago",
    text: "I must like in your customer service.",
  },
  {
    name: "Munavvir Munavvir",
    initial: "M",
    timeAgo: "5 months ago",
    text: "This institute's 6-month online Plus Two course was very helpful, with clear teaching, regular classes, and great support throughout.",
  },
  {
    name: "Fathima Nasrin",
    initial: "F",
    timeAgo: "6 months ago",
    text: "Great guidance for admissions abroad. The counselling team explained every step clearly and patiently.",
  },
  {
    name: "Arjun Menon",
    initial: "A",
    timeAgo: "7 months ago",
    text: "Smooth credit transfer process and quick responses whenever I had questions. Highly recommended.",
  },
];

const AUTO_ADVANCE_MS = 5500;
const CARD_GAP_PX = 24;

function StarRow() {
  return (
    <span className="tims-testi-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8 5.9 21l1.5-6.8-5.2-4.7 6.9-.7L12 2.5Z" />
        </svg>
      ))}
    </span>
  );
}

function QuoteMark() {
  return (
    <svg
      className="tims-testi-quote-mark"
      viewBox="0 0 40 32"
      width="52"
      height="42"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 32V18.7C0 8.3 6.2 1 16.7 0l2 6.2C12.3 8.3 8.3 12.7 8.3 18.7H16.7V32H0Zm22 0V18.7C22 8.3 28.2 1 38.7 0l2 6.2c-6.4 2.1-10.4 6.5-10.4 12.5h8.4V32H22Z" />
    </svg>
  );
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <>
      <p className="tims-testimonials-review-text">{testimonial.text}</p>

      <div className="tims-testimonials-review-wave">
        <svg
          className="tims-testimonials-review-wave-svg"
          viewBox="0 0 400 36"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,36 C90,4 160,36 240,18 C300,5 350,20 400,10 L400,36 Z" fill="currentColor" />
        </svg>

        <div className="tims-testimonials-review-wave-body">
          <QuoteMark />

          <div className="tims-testimonials-review-meta">
            <span className="tims-testimonials-review-name">{testimonial.name}</span>
            <span className="tims-testimonials-review-time">{testimonial.timeAgo}</span>
            <StarRow />
          </div>
        </div>
      </div>

      <span className="tims-testimonials-review-avatar">{testimonial.initial}</span>
    </>
  );
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    function measure() {
      if (activeCardRef.current) {
        setCardWidth(activeCardRef.current.offsetWidth);
      }
      if (stageRef.current) {
        setStageWidth(stageRef.current.offsetWidth);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function goTo(index: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveIndex(index);
  }

  function goRelative(delta: number) {
    goTo((activeIndex + delta + testimonials.length) % testimonials.length);
  }

  const SWIPE_THRESHOLD_PX = 40;

  function handleTouchStart(event: TouchEvent) {
    touchStartXRef.current = event.touches[0].clientX;
    touchDeltaXRef.current = 0;
  }

  function handleTouchMove(event: TouchEvent) {
    if (touchStartXRef.current === null) return;
    touchDeltaXRef.current = event.touches[0].clientX - touchStartXRef.current;
  }

  function handleTouchEnd() {
    if (Math.abs(touchDeltaXRef.current) > SWIPE_THRESHOLD_PX) {
      suppressClickRef.current = true;
      goRelative(touchDeltaXRef.current < 0 ? 1 : -1);
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  }

  function handleCardClick(index: number, isActive: boolean) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (!isActive) goTo(index);
  }

  const trackOffsetPx =
    cardWidth && stageWidth
      ? stageWidth / 2 - cardWidth / 2 - activeIndex * (cardWidth + CARD_GAP_PX)
      : 0;

  return (
    <section className="tims-testimonials-section">
      <div className="tims-testimonials-inner">
        <div className="tims-testimonials-header">
          <span className="tims-testimonials-label">TESTIMONIALS</span>
          <h2 className="tims-testimonials-title">Student Success Stories</h2>
        </div>

        <div className="tims-testimonials-rating-bar">
          <span className="tims-testimonials-rating-score">4.6</span>
          <StarRow />
          <span className="tims-testimonials-rating-divider" aria-hidden="true" />
          <span className="tims-testimonials-rating-count">342 Google Reviews</span>
          <Link href="#" className="tims-testimonials-write-btn">
            Write a Review
          </Link>
        </div>

        <div className="tims-testimonials-spotlight">
          <button
            type="button"
            className="tims-testimonials-nav tims-testimonials-nav--prev"
            aria-label="Previous testimonial"
            onClick={() => goRelative(-1)}
          >
            &lt;
          </button>

          <div
            className="tims-testimonials-spotlight-stage"
            ref={stageRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="tims-testimonials-carousel-track"
              style={{ transform: `translateX(${trackOffsetPx}px)` }}
            >
              {testimonials.map((testimonial, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={testimonial.name}
                    ref={isActive ? activeCardRef : undefined}
                    className={`tims-testimonials-review-card ${
                      isActive
                        ? "tims-testimonials-review-card--active"
                        : "tims-testimonials-review-card--dim"
                    }`}
                    onClick={() => handleCardClick(index, isActive)}
                  >
                    <ReviewCard testimonial={testimonial} />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="tims-testimonials-nav tims-testimonials-nav--next"
            aria-label="Next testimonial"
            onClick={() => goRelative(1)}
          >
            &gt;
          </button>
        </div>

        <div className="tims-testimonials-dots">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              className={`tims-testimonials-dot ${
                index === activeIndex ? "tims-testimonials-dot--active" : ""
              }`}
              aria-label={`Show testimonial from ${testimonial.name}`}
              aria-current={index === activeIndex}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
