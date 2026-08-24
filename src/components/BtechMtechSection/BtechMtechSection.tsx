import type { ReactNode } from "react";
import "./tims-btech-section.css";

const branches = [
  "Aeronautical",
  "Civil",
  "Electronics and Communication",
  "Mechanical",
  "Biotechnology",
  "Automobile",
  "Computer Science",
  "Electrical",
  "Information Technology",
];

const benefits = [
  "You can fulfill your dream to become an Engineer.",
  "Recognized by government as well as the private sector.",
  "Try for GATE, M.Tech, or a better job.",
];

const universities = ["Shobhit University", "Shri Venkateshwara University"];

const approvals = [
  "Arunachal Pradesh based Private University.",
  "UGC approved University.",
  "AICTE approved University.",
  "AIU membership.",
  "Bar Council of India approval.",
  "Approved by NCTE.",
  "BAR COUNCIL – PCI.",
];

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-btech-highlight">{children}</strong>;
}

export default function BtechMtechSection() {
  return (
    <section className="tims-btech-section">
      <div className="tims-btech-inner">
        <div className="tims-btech-header">
          <span className="tims-btech-label">Course Information</span>
          <h1 className="tims-btech-heading">B.Tech / M.Tech &ndash; Credit Transfer</h1>
        </div>

        <div className="tims-btech-card">
          <h2 className="tims-btech-card-title">What Is Credit Transfer</h2>
          <p className="tims-btech-text">
            If you have previously studied and discontinued B.Tech/BE, you may be able to
            count that study towards a <Highlight>university qualification</Highlight> &mdash;
            in other words, students who discontinued BE/B.Tech programmes from any other
            recognized university can pursue the remaining part of their programme under the{" "}
            <Highlight>credit transfer scheme</Highlight> of our university.
          </p>
        </div>

        <div className="tims-btech-card">
          <h2 className="tims-btech-card-title">Branches Credit Transfer</h2>
          <ul className="tims-btech-branches">
            {branches.map((branch) => (
              <li className="tims-btech-branch" key={branch}>
                <span className="tims-btech-branch-dot" aria-hidden="true" />
                {branch}
              </li>
            ))}
          </ul>
        </div>

        <div className="tims-btech-row">
          <div className="tims-btech-sticky tims-btech-sticky--yellow">
            <span className="tims-btech-sticky-pin" aria-hidden="true" />
            <h2 className="tims-btech-card-title">Examination</h2>
            <p className="tims-btech-text">
              The examinations are conducted every <Highlight>June and December</Highlight> at
              the university campus.
            </p>
          </div>

          <div className="tims-btech-sticky tims-btech-sticky--cyan">
            <span className="tims-btech-sticky-pin" aria-hidden="true" />
            <h2 className="tims-btech-card-title">Fees</h2>
            <p className="tims-btech-text">
              The fees depend on the mode of your study and the branch you choose.
            </p>
          </div>
        </div>

        <div className="tims-btech-card">
          <h2 className="tims-btech-card-title">B.Tech Credit Transfer Benefits</h2>
          <ul className="tims-btech-benefits">
            {benefits.map((benefit) => (
              <li className="tims-btech-benefit" key={benefit}>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="tims-btech-card">
          <h2 className="tims-btech-card-title">Our University</h2>
          <ul className="tims-btech-university-list">
            {universities.map((university) => (
              <li className="tims-btech-university-item" key={university}>
                {university}
              </li>
            ))}
          </ul>

          <h3 className="tims-btech-approval-title">University Approval</h3>
          <ul className="tims-btech-approval-list">
            {approvals.map((approval) => (
              <li className="tims-btech-approval-item" key={approval}>
                {approval}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
