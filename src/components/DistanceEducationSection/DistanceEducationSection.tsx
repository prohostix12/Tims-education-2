"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./tims-distance-section.css";
import { DistanceEducationData, DEFAULT_DISTANCE_EDUCATION_DATA } from "@/types/distanceEducation";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M12 4 2 8.5 12 13l10-4.5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20.5 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

function VolumeMutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function VolumeHighIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export default function DistanceEducationSection() {
  const [settings, setSettings] = useState<DistanceEducationData>(DEFAULT_DISTANCE_EDUCATION_DATA);
  const [isMuted, setIsMuted] = useState(true);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load settings from API
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/distance-education");
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error("Failed to load distance education section settings:", err);
      }
    }
    loadSettings();
  }, []);

  // IntersectionObserver to handle Autoplay on Scroll into view
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Ensure video is initially muted for autoplay compatibility
    video.muted = true;
    video.defaultMuted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
              playPromise.catch(() => {
                // Autoplay blocked fallback or pending user interaction
              });
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [settings.videoUrl]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // Helper for embed URLs (YouTube / Instagram)
  const isInstagram = settings.videoUrl.includes("instagram.com");
  const isYouTube = settings.videoUrl.includes("youtube.com") || settings.videoUrl.includes("youtu.be");
  const isEmbed = isInstagram || isYouTube;

  const getEmbedSrc = () => {
    if (isInstagram) {
      const match = settings.videoUrl.match(/reel\/([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        return `https://www.instagram.com/reel/${match[1]}/embed`;
      }
    }
    if (isYouTube) {
      const match = settings.videoUrl.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0`;
      }
    }
    return settings.videoUrl;
  };

  return (
    <section ref={sectionRef} className="tims-distance-section">
      <span className="tims-distance-blob" aria-hidden="true" />

      <div className="tims-distance-inner">
        <div className="tims-distance-media">
          <div className="tims-distance-image-wrap">
            {isEmbed ? (
              <iframe
                src={getEmbedSrc()}
                title="Distance Education Video"
                className="tims-distance-video-iframe"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={settings.videoUrl}
                  className="tims-distance-video"
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                />

                {/* Single Control Button: Mute / Unmute Audio Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="tims-distance-audio-btn"
                  aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? <VolumeMutedIcon /> : <VolumeHighIcon />}
                  <span className="tims-distance-audio-label">
                    {isMuted ? "Sound Off" : "Sound On"}
                  </span>
                </button>
              </>
            )}
          </div>

          <div className="tims-distance-badge">
            <span className="tims-distance-badge-icon">
              <GraduationIcon />
            </span>
            <div>
              <p className="tims-distance-badge-value">{settings.badgeValue}</p>
              <p className="tims-distance-badge-label">{settings.badgeLabel}</p>
            </div>
          </div>
        </div>

        <div className="tims-distance-content">
          <span className="tims-distance-label">{settings.subheading}</span>
          <h2 className="tims-distance-heading">{settings.heading}</h2>

          <p className="tims-distance-text">
            TIMS Education has grown by helping students and working professionals complete
            their studies without disturbing their daily routine. Over the years, many
            learners have trusted us because they feel comfortable learning at their own pace
            with the right guidance beside them. That&rsquo;s one of the reasons people often
            call us the{" "}
            <strong className="tims-distance-highlight">
              best distance education centre in Kerala
            </strong>
            .
          </p>

          <ul className="tims-distance-highlight-list">
            {settings.highlights.map((item) => (
              <li key={item} className="tims-distance-highlight-chip">
                <span className="tims-distance-highlight-icon">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link href="/courses/online-degree" className="tims-distance-cta">
            <span>Explore Programs</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
