import type { ReactNode } from "react";
import "./tims-sslc-section.css";

const missions = [
  {
    title: "Universalisation of Education",
    icon: "globe" as const,
  },
  {
    title: "Greater Equity and Justice in Society",
    icon: "scale" as const,
  },
  {
    title: "Evolution of a Learning Society",
    icon: "spark" as const,
  },
];

const strategies = [
  "Printed Self-Instructional Material",
  "Audio & Video Programmes",
  "Personal Contact Programme (PCP)",
  "Tutor Marked Assignments (TMA)",
];

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M12 3.5v16.5M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 5.5 5 8l3.5 6.5L12 12l3.5 2.5L19 8l-7-2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 3.5c.6 3.3 2.4 5.1 5.7 5.7-3.3.6-5.1 2.4-5.7 5.7-.6-3.3-2.4-5.1-5.7-5.7 3.3-.6 5.1-2.4 5.7-5.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 15.5c.3 1.6 1.1 2.4 2.7 2.7-1.6.3-2.4 1.1-2.7 2.7-.3-1.6-1.1-2.4-2.7-2.7 1.6-.3 2.4-1.1 2.7-2.7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const missionIcons = {
  globe: GlobeIcon,
  scale: ScaleIcon,
  spark: SparkIcon,
};

export default function SslcPlusTwoSection() {
  return (
    <section className="tims-sslc-section">
      <span className="tims-sslc-blob" aria-hidden="true" />

      <div className="tims-sslc-inner">
        <div className="tims-sslc-header">
          <span className="tims-sslc-label">Course Information</span>
          <h1 className="tims-sslc-heading">About SSLC / Plus Two</h1>
        </div>

        <div className="tims-sslc-intro">
          <p className="tims-sslc-text">
            <Highlight>NIOS</Highlight> is &ldquo;Open School&rdquo; to cater to the needs of a
            heterogeneous group of learners up to pre-degree level. It was started as a project
            with in-built flexibilities by the Central Board of Secondary Education (CBSE) in
            1979. In 1986, the National Policy on Education suggested strengthening of Open
            School System for extending open learning facilities in a phased manner at
            secondary level all over the country as an independent system with its own
            curriculum and examination leading to certification.
          </p>
          <p className="tims-sslc-text">
            Consequently, the Ministry of Human Resource Development (MHRD), Government of
            India set up the National Open School (NOS) in November 1989. The pilot project of
            CBSE on Open School was amalgamated with NOS. Through a Resolution (No.
            F.5-24/90 Sch.3 dated 14 September 1990 published in the Gazette of India on 20
            October 1990), the National Open School (NOS) was vested with the authority to
            register, examine and certify students registered with it up to pre-degree level
            courses. In July 2002, the Ministry of Human Resource Development amended the
            nomenclature of the organisation from the National Open School (NOS) to the{" "}
            <Highlight>National Institute of Open Schooling (NIOS)</Highlight> with a mission to
            provide relevant continuing education at school stage, up to pre-degree level
            through Open Learning system to prioritized client groups as an alternative to
            formal system, in pursuance of the normative national policy documents and in
            response to the need assessments of the people.
          </p>
        </div>

        <span className="tims-sslc-mission-label">Through it, NIOS aims to contribute to:</span>
        <div className="tims-sslc-mission-grid">
          {missions.map((mission) => {
            const Icon = missionIcons[mission.icon];
            return (
              <div className="tims-sslc-mission-card" key={mission.title}>
                <span className="tims-sslc-mission-icon">
                  <Icon />
                </span>
                <p className="tims-sslc-mission-title">{mission.title}</p>
              </div>
            );
          })}
        </div>

        <div className="tims-sslc-intro">
          <p className="tims-sslc-text">
            At the Secondary and Senior Secondary levels, NIOS provides flexibility in the
            choice of subjects/courses, pace of learning, and transfer of credits from CBSE,
            some Board of School Education and State Open Schools to enable learner&rsquo;s
            continuation. A learner is extended as many as{" "}
            <Highlight>nine chances to appear in public examinations</Highlight> spread over a
            period of five years.
          </p>

          <span className="tims-sslc-mission-label">The learning strategies include:</span>
          <div className="tims-sslc-strip">
            {strategies.map((strategy) => (
              <span className="tims-sslc-chip" key={strategy}>
                <span className="tims-sslc-chip-dot" aria-hidden="true" />
                {strategy}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-sslc-highlight">{children}</strong>;
}
