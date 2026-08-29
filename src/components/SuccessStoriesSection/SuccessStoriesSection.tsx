"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./SuccessStoriesSection.module.css";

interface SuccessStory {
  id: string;
  title: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
  category: string;
  tagBg: string;
  tagColor: string;
  dateLocation: string;
  studentName?: string;
  role?: string;
}

const INITIAL_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    title: "Grand Annual Convocation & Graduate Excellence Ceremony",
    caption:
      "Honoring 500+ TIMS Education distance & online degree graduates with university directors, academic faculty, and proud families.",
    imageSrc: "/images/stories/convocation.jpg",
    imageAlt: "TIMS Education graduates celebrating at convocation ceremony",
    category: "CONVOCATION EVENT",
    tagBg: "#ffe4e2",
    tagColor: "#dc2626",
    dateLocation: "Tirur Auditorium · Class of 2025",
    studentName: "Ananya Nair & Graduates",
    role: "Online BBA & Degree Alumni",
  },
  {
    id: "story-2",
    title: "1-on-1 University Spot Admission & Counseling Drive",
    caption:
      "Personalized course selection, credit transfer evaluation, and fast-track admission support by expert TIMS academic advisors.",
    imageSrc: "/images/stories/counseling.jpg",
    imageAlt: "Students receiving expert admission counseling at TIMS center",
    category: "ADMISSION DRIVE",
    tagBg: "#fef3c7",
    tagColor: "#b45309",
    dateLocation: "Spot Counseling Hub · 2026",
    studentName: "Rahul V. Sharma & Applicants",
    role: "NIOS SSLC & Degree Candidates",
  },
  {
    id: "story-3",
    title: "Best Admission Partner Award Recognition Ceremony",
    caption:
      "TIMS Education honored with the Best Admission Partner Award by Swami Vivekanand Subharti University for academic excellence.",
    imageSrc: "/images/stories/award.jpg",
    imageAlt: "TIMS directors receiving Best Admission Partner award on stage",
    category: "INSTITUTE AWARD",
    tagBg: "#dcfce7",
    tagColor: "#15803d",
    dateLocation: "SVSU National Summit · 2025",
    studentName: "Dr. Priyanka Joseph & Faculty",
    role: "Academic Excellence Honors",
  },
  {
    id: "story-4",
    title: "Higher Education & Career Opportunity Seminar",
    caption:
      "Interactive workshops helping working professionals restart discontinued studies and transition to UGC & DEB-approved degree programs.",
    imageSrc: "/images/stories/workshop.jpg",
    imageAlt: "Students attending higher education career seminar",
    category: "CAREER SEMINAR",
    tagBg: "#e0e7ff",
    tagColor: "#3730a3",
    dateLocation: "University Hall · 2025",
    studentName: "Mohammed Faizal & Scholars",
    role: "Credit Transfer & PG Candidates",
  },
  {
    id: "story-5",
    title: "Award Presentation & Distance Education Honors",
    caption:
      "Recognized as a premier distance education partner presenting opportunities for SSLC, Degree, B.Tech, and Post-Graduation.",
    imageSrc: "/images/admission_partner.png",
    imageAlt: "TIMS Education recognition presentation photo",
    category: "PARTNER HONORS",
    tagBg: "#fae8ff",
    tagColor: "#86198f",
    dateLocation: "CDOE Annual Meet · 2025",
    studentName: "TIMS Academic Team",
    role: "Partner Excellence 2025",
  },
];

export default function SuccessStoriesSection() {
  const [cards, setCards] = useState<SuccessStory[]>(INITIAL_STORIES);
  const [exitingId, setExitingId] = useState<string | null>(null);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const totalStories = INITIAL_STORIES.length;
  const touchStartX = useRef<number | null>(null);

  // Next Slide: Top card slides out to the left and places at the BACK of the stack
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const topCard = cards[0];
    setExitingId(topCard.id);
    setActiveStoryIndex((prev) => (prev + 1) % totalStories);

    setTimeout(() => {
      setCards((prev) => [...prev.slice(1), prev[0]]);
      setExitingId(null);
      setIsAnimating(false);
    }, 500);
  };

  // Prev Slide: Last card in stack comes to the FRONT and slides in from left
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const lastCard = cards[cards.length - 1];
    const newCards = [lastCard, ...cards.slice(0, cards.length - 1)];

    setEnteringId(lastCard.id);
    setActiveStoryIndex((prev) => (prev - 1 + totalStories) % totalStories);
    setCards(newCards);

    requestAnimationFrame(() => {
      setTimeout(() => {
        setEnteringId(null);
        setIsAnimating(false);
      }, 50);
    });
  };

  // Auto-loop every 5.5 seconds
  useEffect(() => {
    if (isPaused || isAnimating) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, isAnimating]);

  // Touch Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > 40) {
      handleNext();
    } else if (deltaX < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Split Grid Layout: Left Controls & Right Infinite Card Deck */}
        <div className={styles.layoutGrid}>
          {/* Left Column: Fixed Header & Interactive Controls */}
          <div className={styles.leftColumn}>
            <div className={styles.eyebrowWrapper}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              <span className={styles.eyebrow}>REAL IMPACT &amp; SUCCESS</span>
            </div>

            <h2 className={styles.title}>
              Become Part Of A <span>Great Story</span>
            </h2>

            <p className={styles.subtitle}>
              Explore photos and success stories from our convocation ceremonies, spot admission drives, and award recognitions at TIMS Education.
            </p>

            {/* Slide Index Counter & Progress Bar */}
            <div className={styles.sliderControls}>
              <div className={styles.counterGroup}>
                <span className={styles.activeNumber}>
                  {String(activeStoryIndex + 1).padStart(2, "0")}
                </span>
                <span className={styles.counterDivider}>/</span>
                <span className={styles.totalNumber}>
                  {String(totalStories).padStart(2, "0")}
                </span>
              </div>

              {/* Progress Line */}
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${((activeStoryIndex + 1) / totalStories) * 100}%` }}
                />
              </div>

              {/* Prev / Next Navigation Arrows */}
              <div className={styles.arrowGroup}>
                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={handlePrev}
                  disabled={isAnimating}
                  aria-label="Previous Success Story"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={handleNext}
                  disabled={isAnimating}
                  aria-label="Next Success Story"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className={styles.dotsRow}>
              {INITIAL_STORIES.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${idx === activeStoryIndex ? styles.dotActive : ""}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className={styles.ctaGroup}>
              <a href="https://findyouruniversity.com/" className={styles.primaryBtn}>
                Find Your Program
              </a>
              <Link href="#contact" className={styles.secondaryBtn}>
                Talk to Advisor
              </Link>
            </div>
          </div>

          {/* Right Column: Infinite Image Card Deck Stage */}
          <div
            className={styles.rightColumn}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.deckStage}>
              {cards.map((story, index) => {
                let cardStateClass = styles.cardBackOfStack;

                if (story.id === exitingId) {
                  cardStateClass = styles.cardExiting;
                } else if (story.id === enteringId) {
                  cardStateClass = styles.cardEntering;
                } else if (exitingId !== null) {
                  if (index === 1) cardStateClass = styles.cardActive;
                  else if (index === 2) cardStateClass = styles.cardStack1;
                  else if (index === 3) cardStateClass = styles.cardStack2;
                } else {
                  if (index === 0) cardStateClass = styles.cardActive;
                  else if (index === 1) cardStateClass = styles.cardStack1;
                  else if (index === 2) cardStateClass = styles.cardStack2;
                }

                return (
                  <div
                    key={story.id}
                    className={`${styles.card} ${cardStateClass}`}
                    onClick={() => {
                      if (!isAnimating && (index === 1 || index === 2)) {
                        handleNext();
                      }
                    }}
                    role="article"
                    aria-hidden={index !== 0 && story.id !== exitingId}
                  >
                    {/* Card Image Frame */}
                    <div className={styles.cardImageWrapper}>
                      <img
                        src={story.imageSrc}
                        alt={story.imageAlt}
                        className={styles.cardImage}
                      />

                      {/* Top Overlay Badges */}
                      <div className={styles.cardTopBar}>
                        <span
                          className={styles.categoryTag}
                          style={{ backgroundColor: story.tagBg, color: story.tagColor }}
                        >
                          {story.category}
                        </span>
                      </div>

                      {/* Bottom Caption Overlay */}
                      <div className={styles.captionOverlay}>
                        <div className={styles.captionMetaRow}>
                          <span className={styles.dateBadge}>{story.dateLocation}</span>
                          <span className={styles.verifiedTag}>✓ Verified Event</span>
                        </div>

                        <h3 className={styles.captionTitle}>{story.title}</h3>
                        <p className={styles.captionText}>{story.caption}</p>

                        {story.studentName && (
                          <div className={styles.captionFooter}>
                            <span className={styles.studentName}>{story.studentName}</span>
                            <span className={styles.studentRole}> &bull; {story.role}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
