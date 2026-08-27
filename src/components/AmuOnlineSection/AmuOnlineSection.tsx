import "../AnnamalaiBooksSection/tims-annamalai-books.css";
import "./tims-amu-online.css";

const ugCourses = ["B.Com", "BA", "Indian National Movement (AMU)"];

const pgCourses = ["M.Com", "MA"];

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

export default function AmuOnlineSection() {
  return (
    <section className="tims-annamalai-books-section">
      <div className="tims-annamalai-books-inner">
        <div className="tims-annamalai-books-block">
          <h1 className="tims-annamalai-books-heading">UG Books</h1>
          <h2 className="tims-amu-online-semester">Semester 1</h2>
          <BooksTable courses={ugCourses} />
        </div>

        <div className="tims-annamalai-books-block">
          <h2 className="tims-annamalai-books-heading">PG Books</h2>
          <h3 className="tims-amu-online-semester">Semester 1</h3>
          <BooksTable courses={pgCourses} />
        </div>
      </div>
    </section>
  );
}
