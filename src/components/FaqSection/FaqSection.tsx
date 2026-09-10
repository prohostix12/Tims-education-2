"use client";

import { useState, useEffect } from "react";
import "./tims-faq-section.css";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

function PlusMinusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`tims-faq-pm-icon ${isOpen ? "tims-faq-pm-icon--open" : ""}`}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {!isOpen && (
        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/faqs");
        if (res.ok) {
          const data = await res.json();
          setFaqs(data.faqs || []);
        }
      } catch (err) {
        console.error("Failed to load FAQs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="tims-faq-section">
      <div className="tims-faq-inner">
        {/* Section Header */}
        <div className="tims-faq-header">
          <span className="tims-faq-label">FAQ</span>
          <h2 className="tims-faq-title">Frequently Asked Questions</h2>
          <p className="tims-faq-subtitle">
            Find answers to common questions about courses, university tie-ups, flexible learning, and admissions.
          </p>
        </div>

        {/* FAQ 2-Column Side-by-Side Accordion Grid */}
        <div className="tims-faq-accordion">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`tims-faq-item ${isOpen ? "tims-faq-item--open" : ""}`}
              >
                <button
                  type="button"
                  className="tims-faq-question-btn"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="tims-faq-question-text">{faq.question}</span>
                  <span className={`tims-faq-toggle-circle ${isOpen ? "tims-faq-toggle-circle--open" : ""}`}>
                    <PlusMinusIcon isOpen={isOpen} />
                  </span>
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  className="tims-faq-answer-wrapper"
                  aria-hidden={!isOpen}
                >
                  <div className="tims-faq-answer-content">
                    <p className="tims-faq-answer-text">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
