"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./tims-news-section.css";

type NewsItem = {
  id: string;
  type: string;
  tag: string;
  title: string;
  description: string;
  eventDate?: string;
  createdAt?: string;
};

function ArrowIcon() {
  return (
    <svg
      className="tims-news-link-arrow"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news-events");
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
        }
      } catch (error) {
        console.error("Failed to load news items:", error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const formatDateString = (dateStr?: string, createdAt?: string) => {
    if (dateStr && dateStr.trim().length > 0) {
      return dateStr;
    }
    if (createdAt) {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      }
    }
    return "Recent";
  };

  return (
    <section className="tims-news-section">
      <div className="tims-news-inner">
        <div className="tims-news-header">
          <span className="tims-news-label">Latest Updates</span>
          <h1 className="tims-news-heading">News &amp; Events from TIMS Education</h1>
          <p className="tims-news-subtitle">
            Announcements, examination results, convocation schedules, and updates from across our university partnerships.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>Loading latest news &amp; events...</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>No news or events posted yet.</p>
        ) : (
          <div className="tims-news-list">
            {items.map((item) => (
              <article className="tims-news-item" key={item.id}>
                <div className="tims-news-date">
                  <span className="tims-news-date-day">
                    {formatDateString(item.eventDate, item.createdAt)}
                  </span>
                </div>

                <div className="tims-news-content">
                  <span className="tims-news-tag">{item.tag}</span>
                  <h2 className="tims-news-title">{item.title}</h2>
                  <p className="tims-news-excerpt">{item.description}</p>
                  <Link href="/contact" className="tims-news-link">
                    <span>Enquire Now</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
