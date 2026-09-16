"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import "./tims-student-video-stories.css";

export interface StudentVideoStory {
  id: string;
  videoUrl: string;
  videoType: "file" | "instagram" | "youtube" | "url";
  thumbnailUrl?: string;
  imageSrc: string;
  duration: string;
}

const DEFAULT_STORIES: StudentVideoStory[] = [
  {
    id: "story-1",
    videoUrl: "/images/students/student2.jpg",
    videoType: "file",
    duration: "0:39",
    imageSrc: "/images/students/student2.jpg",
  },
  {
    id: "story-2",
    videoUrl: "/images/students/student2.jpg",
    videoType: "file",
    duration: "0:47",
    imageSrc: "/images/students/student2.jpg",
  },
  {
    id: "story-3",
    videoUrl: "/images/students/student1.jpg",
    videoType: "file",
    duration: "0:58",
    imageSrc: "/images/students/student1.jpg",
  },
  {
    id: "story-4",
    videoUrl: "/images/students/student3.jpg",
    videoType: "file",
    duration: "1:12",
    imageSrc: "/images/students/student3.jpg",
  },
  {
    id: "story-5",
    videoUrl: "/images/students/student3.jpg",
    videoType: "file",
    duration: "1:05",
    imageSrc: "/images/students/student3.jpg",
  },
];

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getInstagramId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.startsWith("/api/files/")) return true;
  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".m4v") ||
    lower.endsWith(".ogg")
  );
}

function getStoryImageSrc(story: StudentVideoStory): string {
  if (story.thumbnailUrl && story.thumbnailUrl.trim() !== "") {
    return story.thumbnailUrl;
  }
  const ytId = getYouTubeId(story.videoUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  if (story.imageSrc && !story.imageSrc.startsWith("/api/files/")) {
    return story.imageSrc;
  }
  return "/images/students/student1.jpg";
}

function VideoCardMedia({ story, isCenter }: { story: StudentVideoStory; isCenter: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const ytId = getYouTubeId(story.videoUrl);
  const igId = getInstagramId(story.videoUrl);
  const isDirectVideo = isDirectVideoUrl(story.videoUrl);

  useEffect(() => {
    if (!isCenter) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
          "*"
        );
      }
    }
  }, [isCenter]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ytId && iframeRef.current?.contentWindow) {
      const nextState = !isPlaying;
      setIsPlaying(nextState);
      const command = nextState ? "playVideo" : "pauseVideo";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: "" }),
        "*"
      );
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ytId && iframeRef.current?.contentWindow) {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      const command = nextMute ? "mute" : "unMute";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: "" }),
        "*"
      );
      return;
    }

    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const elem = containerRef.current || videoRef.current || iframeRef.current;
    if (elem) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((current / dur) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  if (ytId) {
    if (isCenter) {
      return (
        <div ref={containerRef} className="tims-clean-embed-wrapper">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=0&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=1`}
            title="Video Reel Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
            allowFullScreen
            className="tims-video-clean-embed"
          />
          <div className="tims-custom-video-controls" onClick={(e) => e.stopPropagation()}>
            <div className="tims-custom-video-icons-row">
              <button type="button" onClick={togglePlay} className="tims-custom-ctrl-btn" aria-label="Play or Pause">
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <button type="button" onClick={toggleMute} className="tims-custom-ctrl-btn" aria-label="Mute or Unmute">
                {isMuted ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <button type="button" onClick={toggleFullscreen} className="tims-custom-ctrl-btn" aria-label="Fullscreen">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
              <button type="button" className="tims-custom-ctrl-btn" aria-label="More options">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
            </div>
            <div className="tims-custom-video-progress-track">
              <div className="tims-custom-video-progress-fill" style={{ width: isPlaying ? "65%" : "0%" }} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <img
        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
        alt="Video Reel"
        className="tims-video-story-card-img"
      />
    );
  }

  if (igId) {
    return (
      <div ref={containerRef} className="tims-clean-embed-wrapper">
        <iframe
          src={`https://www.instagram.com/reel/${igId}/embed`}
          title="Instagram Reel Player"
          allowFullScreen
          className="tims-video-clean-embed"
        />
        {isCenter && (
          <div className="tims-custom-video-controls" onClick={(e) => e.stopPropagation()}>
            <div className="tims-custom-video-icons-row">
              <a
                href={story.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tims-custom-ctrl-btn"
                aria-label="Open on Instagram"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </a>
              <button type="button" onClick={toggleMute} className="tims-custom-ctrl-btn" aria-label="Mute or Unmute">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button type="button" onClick={toggleFullscreen} className="tims-custom-ctrl-btn" aria-label="Fullscreen">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
              <button type="button" className="tims-custom-ctrl-btn" aria-label="More options">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
            </div>
            <div className="tims-custom-video-progress-track">
              <div className="tims-custom-video-progress-fill" style={{ width: "50%" }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Direct Uploaded Video File or Image Fallback
  if (!isDirectVideo) {
    return (
      <img
        src={getStoryImageSrc(story)}
        alt="Student story"
        className="tims-video-story-card-img"
      />
    );
  }

  return (
    <div ref={containerRef} className="tims-clean-embed-wrapper">
      <video
        ref={videoRef}
        src={story.videoUrl}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="tims-video-story-card-img"
      />
      {isCenter && (
        <div className="tims-custom-video-controls" onClick={(e) => e.stopPropagation()}>
          <div className="tims-custom-video-icons-row">
            <button type="button" onClick={togglePlay} className="tims-custom-ctrl-btn" aria-label="Play/Pause">
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            <button type="button" onClick={toggleMute} className="tims-custom-ctrl-btn" aria-label="Mute/Unmute">
              {isMuted ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <button type="button" onClick={toggleFullscreen} className="tims-custom-ctrl-btn" aria-label="Fullscreen">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
            <button type="button" className="tims-custom-ctrl-btn" aria-label="More options">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </div>

          <div className="tims-custom-video-progress-track" onClick={handleSeek}>
            <div className="tims-custom-video-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentVideoStoriesSection() {
  const [stories, setStories] = useState<StudentVideoStory[]>(DEFAULT_STORIES);
  const [activeIndex, setActiveIndex] = useState(2); // Center story
  const [isPaused, setIsPaused] = useState(false);
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch("/api/video-stories");
        if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
          const data = await res.json();
          if (data.stories && Array.isArray(data.stories) && data.stories.length > 0) {
            const published = data.stories.filter((s: any) => s.isPublished);
            if (published.length > 0) {
              setStories(
                published.map((s: any) => ({
                  id: s.id,
                  videoUrl: s.videoUrl,
                  videoType: s.videoType || "file",
                  thumbnailUrl: s.thumbnailUrl || "",
                  imageSrc: s.thumbnailUrl || (s.videoType === "file" ? s.videoUrl : "/images/students/student1.jpg"),
                  duration: s.duration || "0:30",
                }))
              );
              setActiveIndex(Math.floor(published.length / 2));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load video stories from DB:", err);
      }
    }
    loadStories();
  }, []);

  // Auto-scroll loop right to left (paused when video is playing)
  useEffect(() => {
    if (isPaused || playingStoryId !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, playingStoryId, stories.length]);

  const handlePrev = () => {
    setPlayingStoryId(null);
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setPlayingStoryId(null);
    setActiveIndex((prev) => (prev + 1) % stories.length);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartXRef.current - touchEndX;

    if (deltaX > 40) {
      handleNext();
    } else if (deltaX < -40) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  const handleCardClick = (story: StudentVideoStory, index: number) => {
    if (index !== activeIndex) {
      setPlayingStoryId(story.id);
      setActiveIndex(index);
    }
  };

  return (
    <section className="tims-video-stories-section">
      <div className="tims-video-stories-container">
        {/* Header Content */}
        <div className="tims-video-stories-header">
          <span className="tims-video-stories-eyebrow">REAL PEOPLE. REAL PROGRESS.</span>
          <h2 className="tims-video-stories-title">Our Stories</h2>
          <p className="tims-video-stories-subtitle">
            Hear from our students about their journeys, achievements, and how TIMS helped them
            turn their dreams into reality.
          </p>
        </div>

        {/* 3D Perspective Carousel Stage */}
        <div
          className="tims-video-stories-stage-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            type="button"
            className="tims-video-stories-nav tims-video-stories-nav--prev"
            onClick={handlePrev}
            aria-label="Previous story"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            className="tims-video-stories-nav tims-video-stories-nav--next"
            onClick={handleNext}
            aria-label="Next story"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 3D Perspective Cards Track */}
          <div className="tims-video-stories-3d-stage">
            <div className="tims-video-stories-cards-container" ref={trackRef}>
              {stories.map((story, index) => {
                let offset = index - activeIndex;

                if (offset > Math.floor(stories.length / 2)) {
                  offset -= stories.length;
                } else if (offset < -Math.floor(stories.length / 2)) {
                  offset += stories.length;
                }

                const absOffset = Math.abs(offset);
                const isCenter = offset === 0;

                if (absOffset > 2) {
                  return (
                    <div
                      key={story.id}
                      className="tims-video-story-card tims-video-story-card--hidden"
                      aria-hidden="true"
                    />
                  );
                }

                let translateX = offset * 235;
                let rotateY = offset * -18;
                let scale = isCenter ? 1.06 : 0.85 - (absOffset - 1) * 0.12;
                let zIndex = 10 - absOffset;
                let opacity = isCenter ? 1 : 0.75 - (absOffset - 1) * 0.3;

                return (
                  <div
                    key={story.id}
                    className={`tims-video-story-card ${
                      isCenter ? "tims-video-story-card--active" : "tims-video-story-card--side"
                    }`}
                    style={{
                      transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                      zIndex,
                      opacity,
                    }}
                    onClick={() => handleCardClick(story, index)}
                  >
                    <div className="tims-video-story-card-media">
                      <VideoCardMedia story={story} isCenter={isCenter} />
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


