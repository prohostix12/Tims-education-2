"use client";

import { useState } from "react";
import "../AnnamalaiBooksSection/tims-annamalai-books.css";
import "./tims-svsu-online.css";

const UG_SEMESTERS = [1, 2, 3, 4, 5, 6, 7];
const PG_SEMESTERS = [1, 2, 3, 4];

const UG_COURSES: Record<number, string[]> = {
  1: [
    "B.Com",
    "BA. History",
    "BLIB",
    "BBA",
    "BA. English",
    "BAJMC",
    "BA. Pol Science",
    "BA. Sociology",
    "BA. Economics",
    "BA. Journalism",
  ],
  2: ["BA. History", "BA. English", "BAJMC", "BA. Pol Science", "BA. Sociology", "BA. Economics", "BA. Journalism"],
  3: ["BA. History", "BA. English", "BAJMC", "BA. Pol Science", "BA. Sociology", "BA. Economics"],
  4: ["BA. History", "BAJMC", "BA. Pol Science", "BA. Sociology", "BA. Economics"],
  5: ["BA. History", "BAJMC", "BA. Pol Science", "BA. Sociology", "BA. Economics"],
  6: [],
  7: ["BA. History", "BAJMC", "BA. Pol Science", "BA. Sociology", "BA. Journalism"],
};

const PG_COURSES: Record<number, string[]> = {
  1: [
    "MA. History",
    "MA. Pol Science",
    "MA. Education",
    "MA. Public Administration",
    "MA. Economics",
    "MA. English",
    "MAJMC",
    "MA. Sociology",
    "MLIS",
    "MBA",
  ],
  2: ["MA. History", "MA. Pol Science", "MA. Education", "MA. Public Administration", "MA. Sociology", "MBA"],
  3: ["MA. History", "MA. Pol Science", "MA. Education", "MA. Public Administration"],
  4: ["MA. History", "MA. Pol Science", "MA. Education", "MA. Public Administration"],
};

function SemesterList({
  semesters,
  selected,
  onSelect,
}: {
  semesters: number[];
  selected: number;
  onSelect: (semester: number) => void;
}) {
  return (
    <aside className="tims-svsu-online-sidebar">
      <ul className="tims-svsu-online-sidebar-list">
        {semesters.map((sem) => (
          <li key={sem}>
            <button
              type="button"
              className={`tims-svsu-online-sidebar-btn ${
                selected === sem ? "tims-svsu-online-sidebar-btn-active" : ""
              }`}
              onClick={() => onSelect(sem)}
            >
              Semester {sem}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function BooksPanel({ courses }: { courses: string[] }) {
  if (courses.length === 0) {
    return (
      <div className="tims-annamalai-books-panel">
        <p className="tims-svsu-online-empty">Study materials for this semester will be added soon.</p>
      </div>
    );
  }

  return (
    <div className="tims-annamalai-books-panel">
      <div className="tims-annamalai-books-table-wrap">
        <table className="tims-annamalai-books-table">
          <thead>
            <tr>
              <th>Courses</th>
              <th>Study Material</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course}>
                <td className="tims-annamalai-books-course">{course}</td>
                <td>
                  <a href="#" className="tims-annamalai-books-link">
                    Books
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SvsuOnlineSection() {
  const [ugSemester, setUgSemester] = useState(1);
  const [pgSemester, setPgSemester] = useState(1);

  return (
    <section className="tims-annamalai-books-section">
      <div className="tims-annamalai-books-inner">
        <h1 className="tims-svsu-online-title">SVSU Online Study Materials</h1>

        <div className="tims-annamalai-books-block">
          <h2 className="tims-annamalai-books-heading">UG Books</h2>
          <div className="tims-svsu-online-layout">
            <SemesterList semesters={UG_SEMESTERS} selected={ugSemester} onSelect={setUgSemester} />
            <BooksPanel courses={UG_COURSES[ugSemester] ?? []} />
          </div>
        </div>

        <div className="tims-annamalai-books-block">
          <h2 className="tims-annamalai-books-heading">PG Books</h2>
          <div className="tims-svsu-online-layout">
            <SemesterList semesters={PG_SEMESTERS} selected={pgSemester} onSelect={setPgSemester} />
            <BooksPanel courses={PG_COURSES[pgSemester] ?? []} />
          </div>
        </div>
      </div>
    </section>
  );
}
