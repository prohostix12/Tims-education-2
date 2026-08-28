const pages = [
  { name: "Home", path: "/" },
  { name: "Directors", path: "/directors" },
  { name: "Blog", path: "/blog" },
  { name: "News", path: "/news" },
  { name: "Find University", path: "/find-university" },
  { name: "SSLC / Plus Two", path: "/courses/sslc-plus-two" },
  { name: "Online Degree", path: "/courses/online-degree" },
  { name: "Post Graduation", path: "/courses/post-graduation" },
  { name: "B.Tech / M.Tech", path: "/courses/btech-mtech" },
  { name: "Diploma", path: "/courses/diploma" },
  { name: "Apprenticeship Program", path: "/courses/apprenticeship-program" },
  { name: "Certificate Attestation", path: "/service/attestation" },
  { name: "Credit Transfer", path: "/service/credit-transfer" },
  { name: "Syllabus", path: "/students/syllabus" },
  { name: "Contact", path: "/contact" },
];

export default function AdminPagesPage() {
  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Content</span>
        <h1 className="tims-admin-heading">Pages</h1>
        <p className="tims-admin-subtitle">All pages currently published on the public site.</p>
      </div>

      <div className="tims-admin-card">
        <div className="tims-admin-table-wrap">
          <table className="tims-admin-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Path</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.path}>
                  <td>{page.name}</td>
                  <td>{page.path}</td>
                  <td>
                    <span className="tims-admin-badge">Published</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
