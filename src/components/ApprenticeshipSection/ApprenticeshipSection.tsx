import type { ReactNode } from "react";
import "./tims-apprenticeship-section.css";

const steps = [
  {
    title: "Work Experience Converted into Academic Credits",
    text: "If you have 2+ years of professional experience, it will be assessed and credited toward your degree. This means you can skip subjects where your existing practical knowledge already meets academic requirements.",
  },
  {
    title: "Shortened Study Duration",
    text: "Your prior work experience reduces the overall course duration. Instead of the conventional 3–4 years, you can complete your degree faster, with the final timeline depending on your experience level and program guidelines.",
  },
  {
    title: "Flexible Learning Options",
    text: "Continue working while you study through online classes, weekend sessions, or a blended learning model. The curriculum is industry-focused, ensuring practical, career-relevant learning.",
  },
];

const undergraduate = [
  { name: "BBA (Bachelor of Business Administration)", note: "Ideal for business professionals" },
  { name: "B.Com (Bachelor of Commerce)", note: "Perfect for accountants and finance experts" },
  { name: "BCA (Bachelor of Computer Applications)", note: "Best for IT professionals" },
  { name: "B.Sc IT (Bachelor of Science in Information Technology)", note: "For software and tech experts" },
  { name: "B.Tech (Bachelor of Technology)", note: "Suitable for engineering professionals in various fields" },
  { name: "BA (Bachelor of Arts)", note: "Various specializations in humanities and social sciences" },
];

const postgraduate = [
  { name: "MBA (Master of Business Administration)", note: "For career growth in management" },
  { name: "M.Com (Master of Commerce)", note: "Advanced knowledge for commerce and finance professionals" },
  { name: "MCA (Master of Computer Applications)", note: "Higher studies in IT and computer applications" },
  { name: "M.Tech (Master of Technology)", note: "For engineers looking for specialization and advanced knowledge" },
];

const whoCanApply = [
  "Working professionals who discontinued their studies and want to complete their degree.",
  "Employees with 2+ years of industry experience who want an academic qualification.",
  "People seeking career growth and better job opportunities.",
  "Corporate professionals who want to upskill and move up the career ladder.",
];

const whyChoose = [
  { title: "Complete Your Degree Faster", note: "Work experience reduces study time." },
  { title: "Work & Study Together", note: "No need to quit your job." },
  { title: "Flexible Learning", note: "Online, weekend, or hybrid classes available." },
  { title: "Recognized Degree", note: "Accepted for jobs, promotions, and further studies." },
  { title: "Industry-Relevant Curriculum", note: "Courses designed to match your field of work." },
];

function ArrowList({ children }: { children: ReactNode }) {
  return <ul className="tims-apprenticeship-list">{children}</ul>;
}

function ArrowItem({ children }: { children: ReactNode }) {
  return (
    <li className="tims-apprenticeship-list-item">
      <span className="tims-apprenticeship-list-arrow" aria-hidden="true">
        &#10148;
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function ApprenticeshipSection() {
  return (
    <section className="tims-apprenticeship-section">
      <div className="tims-apprenticeship-inner">
        <div className="tims-apprenticeship-header">
          <span className="tims-apprenticeship-rule" aria-hidden="true" />
          <span className="tims-apprenticeship-label">Get Started Today</span>
          <h1 className="tims-apprenticeship-heading">Apprenticeship Learning Program</h1>
          <p className="tims-apprenticeship-intro">
            Employee Apprenticeship-Based Learning Program (EALP) &mdash; Fast-Track Your
            Recognized Degree by Turning Work Experience into Academic Credits. The Employee
            Apprenticeship-Based Learning Program (EALP) is designed for working professionals
            who want to complete their degree without starting over. By recognizing and
            evaluating your professional experience, the program converts your skills and
            on-the-job learning into academic credits &mdash; enabling you to earn a recognized
            UG or PG degree in less time, all while continuing your career.
          </p>
        </div>

        <div className="tims-apprenticeship-card">
          <h2 className="tims-apprenticeship-card-title">How It Works</h2>
          <ol className="tims-apprenticeship-steps">
            {steps.map((step, index) => (
              <li className="tims-apprenticeship-step" key={step.title}>
                <span className="tims-apprenticeship-step-number" aria-hidden="true" />
                <div>
                  <h3 className="tims-apprenticeship-step-title">{step.title}</h3>
                  <p className="tims-apprenticeship-step-text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="tims-apprenticeship-card">
          <h2 className="tims-apprenticeship-card-title">Available Degree Programs</h2>
          <p className="tims-apprenticeship-lead">
            You can complete your degree across a wide range of disciplines, including:
          </p>

          <h3 className="tims-apprenticeship-group-title">Undergraduate Programs</h3>
          <ArrowList>
            {undergraduate.map((program) => (
              <ArrowItem key={program.name}>
                <strong>{program.name}</strong> &ndash; {program.note}
              </ArrowItem>
            ))}
          </ArrowList>

          <h3 className="tims-apprenticeship-group-title">Postgraduate Programs</h3>
          <ArrowList>
            {postgraduate.map((program) => (
              <ArrowItem key={program.name}>
                <strong>{program.name}</strong> &ndash; {program.note}
              </ArrowItem>
            ))}
          </ArrowList>
        </div>

        <div className="tims-apprenticeship-card">
          <h2 className="tims-apprenticeship-card-title">Who Can Apply?</h2>
          <ArrowList>
            {whoCanApply.map((item) => (
              <ArrowItem key={item}>{item}</ArrowItem>
            ))}
          </ArrowList>
        </div>

        <div className="tims-apprenticeship-card">
          <h2 className="tims-apprenticeship-card-title">Who Choose EALP?</h2>
          <ArrowList>
            {whyChoose.map((item) => (
              <ArrowItem key={item.title}>
                <strong>{item.title}</strong> &ndash; {item.note}
              </ArrowItem>
            ))}
          </ArrowList>

          <p className="tims-apprenticeship-closing">
            This program helps you achieve your educational goals while leveraging your
            professional experience. Your hard work and skills deserve academic recognition
            &mdash; now you can earn your degree without starting from scratch!
          </p>
        </div>
      </div>
    </section>
  );
}
