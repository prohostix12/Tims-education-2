"use client";

import { useEffect, useState } from "react";
import styles from "./MissionVisionSection.module.css";
import type { MissionVisionData } from "@/app/api/mission-vision/route";

function CheckmarkSvg() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEFAULT_FALLBACK: MissionVisionData = {
  missionEyebrow: "OUR MISSION",
  missionHeading: "Empowering Learners Through Accessible, Accredited Education",
  missionDescription:
    "Providing accessible, high-quality distance and online education that breaks geographical and financial barriers. We guide students and professionals to achieve recognized qualifications, personal growth, and successful career pathways.",
  missionPoints: [
    "UGC-DEB Recognized & Accredited University Affiliations",
    "Flexible Learning Models Tailored for Working Professionals",
    "Personalized Academic Counseling from Admission to Graduation"
  ],
  visionEyebrow: "OUR VISION",
  visionHeading: "Inspiring Academic Excellence and Global Opportunities",
  visionDescription:
    "To be the premier educational counseling and distance learning institution in Kerala and the GCC region, recognized for transforming lives through innovative learning pathways, higher education accessibility, and career excellence.",
  visionPoints: [
    "50,000+ Students Mentored Across India & GCC",
    "Continuous Innovation in Flexible Open & Distance Learning",
    "Building Confidence, Job Readiness & Lifelong Achievement"
  ]
};

export default function MissionVisionSection() {
  const [data, setData] = useState<MissionVisionData>(DEFAULT_FALLBACK);

  useEffect(() => {
    async function fetchMissionVision() {
      try {
        const res = await fetch("/api/mission-vision");
        if (res.ok) {
          const resData = await res.json();
          if (resData && resData.missionHeading) {
            setData(resData);
          }
        }
      } catch (err) {
        console.error("Failed to load mission and vision data:", err);
      }
    }

    fetchMissionVision();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.label}>PURPOSE &amp; DIRECTION</span>
          <h2 className={styles.heading}>
            Our <span>Mission</span> &amp; <span>Vision</span>
          </h2>
          <p className={styles.subtitle}>
            Guided by core values of accessibility, academic integrity, and student success at TIMS Education.
          </p>
        </div>

        {/* 2-Column Torn-Paper Cards Grid (Matching Blog Card Design) */}
        <div className={styles.grid}>
          {/* Mission Card */}
          <div className={`${styles.paperWrapper} ${styles.tornVariant1}`}>
            <div className={styles.paperCard}>
              <div>
                <div className={styles.cardHeader}>
                  <span className={`${styles.badge} ${styles.badgeMission}`}>
                    {data.missionEyebrow || "OUR MISSION"}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{data.missionHeading}</h3>
                <p className={styles.cardDesc}>{data.missionDescription}</p>
              </div>

              {data.missionPoints && data.missionPoints.length > 0 && (
                <ul className={styles.pointsList}>
                  {data.missionPoints.map((pt, i) => (
                    <li key={`m-pt-${i}`} className={styles.pointItem}>
                      <span className={`${styles.checkIcon} ${styles.checkMission}`}>
                        <CheckmarkSvg />
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Vision Card */}
          <div className={`${styles.paperWrapper} ${styles.tornVariant2}`}>
            <div className={styles.paperCard}>
              <div>
                <div className={styles.cardHeader}>
                  <span className={`${styles.badge} ${styles.badgeVision}`}>
                    {data.visionEyebrow || "OUR VISION"}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{data.visionHeading}</h3>
                <p className={styles.cardDesc}>{data.visionDescription}</p>
              </div>

              {data.visionPoints && data.visionPoints.length > 0 && (
                <ul className={styles.pointsList}>
                  {data.visionPoints.map((pt, i) => (
                    <li key={`v-pt-${i}`} className={styles.pointItem}>
                      <span className={`${styles.checkIcon} ${styles.checkVision}`}>
                        <CheckmarkSvg />
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
