"use client";

import { useState, useEffect } from "react";
import "./tims-skill-courses.css";

type SkillCourse = {
  id?: string;
  title: string;
  category: string;
  duration: string;
  eligibility: string;
  description: string;
  topics: string[];
};

const highlights = [
  {
    icon: "🏆",
    title: "Recognized Certification",
    description: "Receive valuable industry certificates upon course completion.",
  },
  {
    icon: "🕒",
    title: "Flexible Timings",
    description: "Choice of regular, weekend, or online interactive batches.",
  },
  {
    icon: "🛠️",
    title: "100% Practical Training",
    description: "Hands-on learning with real-world case studies & projects.",
  },
  {
    icon: "💼",
    title: "Career Assistance",
    description: "Resume guidance, interview prep & placement support.",
  },
];

export default function SkillCoursesSection() {
  const [skillCourses, setSkillCourses] = useState<SkillCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkillCourses() {
      try {
        const res = await fetch("/api/skill-courses");
        const data = await res.json();
        if (data.courses && Array.isArray(data.courses)) {
          setSkillCourses(data.courses);
        }
      } catch (err) {
        console.error("Failed to load skill courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSkillCourses();
  }, []);

  return (
    <section className="tims-skill-section">
      <div className="tims-skill-inner">
        {/* Header */}
        <div className="tims-skill-header">
          <span className="tims-skill-rule" aria-hidden="true" />
          <span className="tims-skill-label">JOB-ORIENTED LEARNING</span>
          <h1 className="tims-skill-heading">
            Empower Your Future with In-Demand Skill Courses
          </h1>
          <p className="tims-skill-intro">
            Tirur Institute of Management Studies offers industry-tailored short-term and professional skill development programs designed to accelerate your career growth and employment opportunities.
          </p>
        </div>

        {/* Highlights Bar */}
        <div className="tims-skill-highlights-grid">
          {highlights.map((item) => (
            <div key={item.title} className="tims-skill-highlight-card">
              <span className="tims-skill-highlight-icon">{item.icon}</span>
              <div>
                <h3 className="tims-skill-highlight-title">{item.title}</h3>
                <p className="tims-skill-highlight-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
            Loading skill courses...
          </div>
        ) : skillCourses.length > 0 ? (
          <div className="tims-skill-courses-grid">
            {skillCourses.map((course, idx) => (
              <div key={course.id || `${course.title}-${idx}`} className="tims-skill-course-card">
                <div>
                  <span className="tims-skill-course-badge">{course.category}</span>
                  <h2 className="tims-skill-course-title">{course.title}</h2>
                  <p className="tims-skill-course-desc">{course.description}</p>

                  <div className="tims-skill-course-meta">
                    {course.duration && (
                      <span className="tims-skill-meta-item">
                        ⏱️ <strong>Duration:</strong> {course.duration}
                      </span>
                    )}
                    {course.eligibility && (
                      <span className="tims-skill-meta-item">
                        🎓 <strong>Eligibility:</strong> {course.eligibility}
                      </span>
                    )}
                  </div>
                </div>

                {Array.isArray(course.topics) && course.topics.length > 0 && (
                  <div>
                    <ul className="tims-skill-course-topics">
                      {course.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="tims-skill-topic-item">
                          <span className="tims-skill-topic-bullet" aria-hidden="true" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3.5rem 1.5rem",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
              color: "#64748b",
            }}
          >
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
              Skill courses will be listed here soon. Check back shortly or contact our academic team!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
