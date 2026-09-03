"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./tims-dream-section.css";

type Feature = {
  title: string;
  description: string;
  icon: "attestation" | "monitor" | "globe";
};

const features: Feature[] = [
  {
    title: "Online Degree",
    description: "Pursue your higher education from UGC Approved Universities with ease.",
    icon: "attestation",
  },
  {
    title: "Diploma & Skill Programs",
    description: "Enhance your professional skills with a variety of diploma and skill courses.",
    icon: "monitor",
  },
  {
    title: "10th/Plus Two",
    description: "Complete your 10th or Plus Two certification from NIOS or other recognized boards.",
    icon: "globe",
  },
];

function AttestationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="17" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="17.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10.2 19.6 9.4 22l2.6-1.3 2.6 1.3-.8-2.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6.5 8h11M6.5 11h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="12" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 20.5h7M12 16.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m9 8.5 3 2-3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const iconComponents = {
  attestation: AttestationIcon,
  monitor: MonitorIcon,
  globe: GlobeIcon,
};

function TimelineItem({ feature, index }: { feature: Feature; index: number }) {
  const [visible, setVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const Icon = iconComponents[feature.icon];

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`tims-dream-timeline-item ${visible ? "tims-dream-timeline-item--visible" : ""}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <span className="tims-dream-timeline-node">
        <span className="tims-dream-timeline-pulse" aria-hidden="true" />
        <Icon />
      </span>
      <div className="tims-dream-timeline-content">
        <h3 className="tims-dream-timeline-title">{feature.title}</h3>
        <p className="tims-dream-timeline-text">{feature.description}</p>
      </div>
    </div>
  );
}

export default function DreamSection() {
  return (
    <section className="tims-dream-section">
      <span className="tims-dream-blob tims-dream-blob--navy" aria-hidden="true" />

      <div className="tims-dream-inner">
        <div className="tims-dream-statement">
          <span className="tims-dream-label">Why Choose TIMS</span>
          <h2 className="tims-dream-heading">
            Make Your Dream <span className="tims-dream-heading-accent">Come True!</span>
          </h2>
          <p className="tims-dream-subtitle">
            Provide better education to the society in an affordable cost
          </p>
          <Link href="#" className="tims-dream-cta">
            <span>Get Started</span>
            <ArrowIcon />
          </Link>
        </div>

        <div className="tims-dream-timeline">
          <span className="tims-dream-timeline-line" aria-hidden="true" />
          {features.map((feature, index) => (
            <TimelineItem feature={feature} index={index} key={feature.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
