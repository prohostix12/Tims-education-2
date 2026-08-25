import "../AnnamalaiBooksSection/tims-annamalai-books.css";

const ugCourses = [
  "B.Com",
  "BCA",
  "BBA Logistics & supply management",
  "BBA Airline & Airport Management",
  "BBA",
  "BA English",
  "B.Sc. Physics",
  "B.Sc. Visual Communication",
  "B.Sc. Mathematics",
  "B.Sc. IT",
  "B.Sc. Costume Design & Fashion",
  "B.Sc. CS",
  "B.Sc. Catering Science & Hotel Management",
  "B.Com Computer Application",
];

const pgCourses = [
  "MBA",
  "M.Com",
  "M.C.A",
  "M.A. Journalism & Mass Communication",
  "M.A. Economics",
  "M.A. English",
  "PGCA",
  "M.Sc. Costume Design & Fashion",
  "M.Sc. Bio-Informatics",
  "M.Sc. Zoology",
  "M.Sc. Physics",
  "M.Sc. Mathematics",
  "M.Sc. IT",
  "M.Sc. Environment Studies",
  "M.Sc. CS",
  "M.Sc. Chemistry",
  "M.Sc. Botany",
  "M.Sc. Applied Psycology",
  "M.S.W",
];

function BooksTable({ courses }: { courses: string[] }) {
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

export default function BharathiyarBooksSection() {
  return (
    <section className="tims-annamalai-books-section">
      <div className="tims-annamalai-books-inner">
        <div className="tims-annamalai-books-block">
          <h1 className="tims-annamalai-books-heading">UG Books</h1>
          <BooksTable courses={ugCourses} />
        </div>

        <div className="tims-annamalai-books-block">
          <h2 className="tims-annamalai-books-heading">PG Books</h2>
          <BooksTable courses={pgCourses} />
        </div>
      </div>
    </section>
  );
}
