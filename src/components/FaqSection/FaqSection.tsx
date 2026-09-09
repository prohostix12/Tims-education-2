"use client";

import { useState } from "react";
import "./tims-faq-section.css";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "What courses and programs are offered at TIMS Education?",
    answer:
      "TIMS Education provides guidance and admissions for SSLC / Plus Two (NIOS & open schooling boards), Online & Distance Undergraduate degrees (BA, BCom, BSc, BBA, BCA), Postgraduate programs (MA, MCom, MSc, MBA, MCA), BTech/MTech admissions, and specialized diploma & skill development courses.",
  },
  {
    id: "faq-2",
    question: "Are the university degrees UGC-approved and valid for jobs?",
    answer:
      "Yes, all programs facilitated by TIMS Education are affiliated with UGC, DEB, AICTE, and MHRD-approved universities. The degrees earned are valid worldwide for private sector jobs, government competitive exams, and further higher education.",
  },
  {
    id: "faq-3",
    question: "Can I complete 10th or Plus Two if I discontinued my studies?",
    answer:
      "Absolutely. Through NIOS and recognized open schooling boards, you can complete your 10th (SSLC) or Plus Two (+2) regardless of your age or study gap. Credit transfer (TOC) is also available to carry forward marks from previous failed attempts.",
  },
  {
    id: "faq-4",
    question: "How does distance and online learning work for working professionals?",
    answer:
      "Our distance and online education models are designed for flexibility. You receive comprehensive study material, digital learning resources, mentor guidance, and weekend/online support so you can continue your education without disturbing your work routine.",
  },
  {
    id: "faq-5",
    question: "How can I apply or get expert academic counseling?",
    answer:
      "You can fill out our online enquiry form on the website or visit your nearest TIMS Education branch. Our experienced academic counselors will help you choose the right course, verify your eligibility, and assist you with the entire admission procedure.",
  },
  {
    id: "faq-6",
    question: "What support is provided during exam preparation and assignments?",
    answer:
      "Our mentors assist you throughout your learning journey with syllabus guidance, previous year question papers, assignment submissions, hall ticket collection, and exam center updates to ensure a smooth academic experience.",
  },
];

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
  const [openId, setOpenId] = useState<string | null>(null);

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
          {defaultFaqs.map((faq) => {
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
