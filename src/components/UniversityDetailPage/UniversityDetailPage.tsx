import React from "react";
import PageHero from "@/components/PageHero/PageHero";
import "../MizoramSection/tims-mizoram-section.css";
import "../AttestationSection/tims-attestation-section.css";
import "../AmuOnlineProgramsSection/tims-amu-programs.css";

export type ProgramRowData = {
  sl: number;
  course: string;
  specialization: string | string[];
  fees: string;
};

export type UniversityPageDetails = {
  name: string;
  slug?: string;
  image?: string;
  logo?: string;
  description?: string;
  aboutHeading?: string;
  about?: string;
  achievementsTitle?: string;
  achievementsText?: string;
  affiliationsText?: string;
  cdoeTitle?: string;
  cdoeText?: string;
  programsHeading?: string;
  programsTable?: ProgramRowData[];
  brochure?: string;
  accreditations?: string[];
  courses?: string[];
};

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 4.5v11M7.5 11.5 12 16l4.5-4.5M5.5 19.5h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function UniversityDetailPage({ data }: { data: UniversityPageDetails }) {
  const universityName = data.name || "Partner University";

  const aboutText =
    data.about?.trim() ||
    data.description?.trim() ||
    `${universityName} is a recognized institution offering flexible accredited distance and online education programs.`;

  const achievementsTitle = data.achievementsTitle?.trim() || "University Achievements & Recognition";
  const achievementsText = data.achievementsText?.trim();

  const affiliationsText =
    data.affiliationsText?.trim() ||
    (data.accreditations && data.accreditations.length > 0
      ? data.accreditations.join(", ")
      : "UGC Approved, DEB Entitled, NAAC Accredited");

  const cdoeTitle = data.cdoeTitle?.trim() || "Centre For Distance and Online Education (CDOE)";
  const cdoeText = data.cdoeText?.trim();

  const programsHeading = data.programsHeading?.trim() || "Offered Programs & Fees Structure";
  const programsTable = data.programsTable && data.programsTable.length > 0 ? data.programsTable : [];

  return (
    <main>
      {/* 1. Page Hero Banner */}
      <PageHero title={universityName} />

      {/* 2. About & Achievements Section */}
      <section className="tims-mizoram-section">
        <div className="tims-mizoram-inner">
          <div>
            <p className="tims-mizoram-text">{aboutText}</p>

            {achievementsText && (
              <>
                <h2 className="tims-mizoram-subheading">{achievementsTitle}</h2>
                <p className="tims-mizoram-text" style={{ marginBottom: 0 }}>
                  {achievementsText}
                </p>
              </>
            )}
          </div>

          <div className="tims-mizoram-media" style={{ background: "#ffffff", width: "100%", minHeight: "380px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image || data.logo || "/images/sureshviharuniversity.png"}
              alt={`${universityName} Campus`}
              style={{ width: "100%", height: "100%", minHeight: "380px", maxHeight: "500px", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* 3. Affiliations & CDOE Section */}
      {(affiliationsText || cdoeText) && (
        <section className="tims-attestation-section">
          <div className="tims-attestation-inner">
            <div className="tims-attestation-card">
              {affiliationsText && (
                <>
                  <h2 className="tims-attestation-card-title" style={{ fontSize: "1.1875rem" }}>
                    Affiliations &amp; Accreditations
                  </h2>
                  <p className="tims-attestation-text">{affiliationsText}</p>
                </>
              )}

              {cdoeText && (
                <>
                  <h2 className="tims-attestation-card-title">{cdoeTitle}</h2>
                  <p className="tims-attestation-text" style={{ marginBottom: 0 }}>
                    {cdoeText}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. Programs Table & Fee Details */}
      <section className="tims-amu-programs-section">
        <div className="tims-amu-programs-inner">
          <h2 className="tims-amu-programs-heading">{programsHeading}</h2>

          <div className="tims-amu-programs-panel">
            <div className="tims-amu-programs-table-wrap">
              <table className="tims-amu-programs-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Courses</th>
                    <th>Specialization</th>
                    <th>Fees / Eligibility</th>
                  </tr>
                </thead>
                <tbody>
                  {programsTable.length > 0 ? (
                    programsTable.map((row, index) => {
                      const specList = Array.isArray(row.specialization)
                        ? row.specialization
                        : typeof row.specialization === "string" && row.specialization.trim()
                        ? [row.specialization.trim()]
                        : [];

                      return (
                        <tr key={`${row.course}-${index}`}>
                          <td className="tims-amu-programs-sl">{row.sl || index + 1}</td>
                          <td className="tims-amu-programs-course">{row.course}</td>
                          <td>
                            {specList.length > 0 ? (
                              <ul className="tims-amu-programs-spec-list">
                                {specList.map((spec, sIdx) => (
                                  <li key={sIdx}>{spec}</li>
                                ))}
                              </ul>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>{row.fees || "Contact for fee details"}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", color: "#64748b", padding: "1.5rem" }}>
                        Course list available upon enquiry. Please contact TIMS Education for detailed specialization and fee structures.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Brochure Download Button */}
          {data.brochure && (
            <a
              href={data.brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="tims-amu-programs-download"
            >
              <DownloadIcon />
              Download Official Brochure (PDF)
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
