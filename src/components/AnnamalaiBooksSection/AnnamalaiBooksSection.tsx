import "./tims-annamalai-books.css";

type UgRow = {
  course: string;
  year1: boolean;
  year2: boolean;
  year3: boolean;
};

const ugRows: UgRow[] = [
  { course: "BA Sociology", year1: true, year2: true, year3: true },
  { course: "BA Political Science", year1: true, year2: true, year3: true },
  { course: "BA History", year1: false, year2: true, year3: true },
  { course: "BCA", year1: true, year2: true, year3: true },
  { course: "B.Sc Visual Communication", year1: true, year2: true, year3: true },
  { course: "B.Sc Information Technology", year1: true, year2: true, year3: true },
  { course: "B.Sc Computer Science", year1: true, year2: true, year3: true },
];

const pgRows = ["MCOM", "MCA", "MSC IT", "MSC Software Engineering", "MSC CS"];

function BookCell({ available }: { available: boolean }) {
  if (!available) {
    return <span className="tims-annamalai-books-empty">&mdash;</span>;
  }
  return (
    <a href="#" className="tims-annamalai-books-link">
      Books
    </a>
  );
}

export default function AnnamalaiBooksSection() {
  return (
    <section className="tims-annamalai-books-section">
      <div className="tims-annamalai-books-inner">
        <div className="tims-annamalai-books-block">
          <h1 className="tims-annamalai-books-heading">UG Books</h1>

          <div className="tims-annamalai-books-panel">
            <div className="tims-annamalai-books-table-wrap">
              <table className="tims-annamalai-books-table">
                <thead>
                  <tr>
                    <th>Courses</th>
                    <th>1st Year</th>
                    <th>2nd Year</th>
                    <th>3rd Year</th>
                  </tr>
                </thead>
                <tbody>
                  {ugRows.map((row) => (
                    <tr key={row.course}>
                      <td className="tims-annamalai-books-course">{row.course}</td>
                      <td>
                        <BookCell available={row.year1} />
                      </td>
                      <td>
                        <BookCell available={row.year2} />
                      </td>
                      <td>
                        <BookCell available={row.year3} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="tims-annamalai-books-block">
          <h2 className="tims-annamalai-books-heading">PG Books</h2>

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
                  {pgRows.map((course) => (
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
        </div>
      </div>
    </section>
  );
}
