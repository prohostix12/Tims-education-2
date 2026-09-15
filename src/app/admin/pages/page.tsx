import Link from "next/link";

const pages = [
  { name: "Home", path: "/", editPath: "/admin/distance-education", editLabel: "Edit Section Video" },
  { name: "Directors", path: "/directors", editPath: "/admin/directors", editLabel: "Manage Directors" },
  { name: "Our Team Members", path: "/#team", editPath: "/admin/team-members", editLabel: "Manage Team" },
  { name: "Blog", path: "/blog", editPath: "/admin/blog", editLabel: "Manage Blog" },
  { name: "News", path: "/news", editPath: "/admin/news", editLabel: "Manage News" },
  { name: "SSLC / Plus Two", path: "/courses/sslc-plus-two", editPath: "/admin/courses/sslc-plus-two", editLabel: "Manage Content" },
  { name: "Online Degree", path: "/courses/online-degree", editPath: "/admin/courses/online-degree", editLabel: "Manage Courses" },
  { name: "Post Graduation", path: "/courses/post-graduation", editPath: "/admin/courses/post-graduation", editLabel: "Manage Courses" },
  { name: "Diploma", path: "/courses/diploma", editPath: "/admin/courses/diploma", editLabel: "Manage Courses" },
  { name: "Contact", path: "/contact", editPath: "/admin/contact", editLabel: "Manage Contact" },
];

export default function AdminPagesPage() {
  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Content</span>
        <h1 className="tims-admin-heading">Pages &amp; Sections</h1>
        <p className="tims-admin-subtitle">All active pages and configurable sections on the public website.</p>
      </div>

      <div className="tims-admin-card">
        <div className="tims-admin-table-wrap">
          <table className="tims-admin-table">
            <thead>
              <tr>
                <th>Page / Section</th>
                <th>Public Path</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.name}>
                  <td style={{ fontWeight: 600 }}>{page.name}</td>
                  <td><code>{page.path}</code></td>
                  <td>
                    <span className="tims-admin-badge">Published</span>
                  </td>
                  <td>
                    {page.editPath && (
                      <Link
                        href={page.editPath}
                        className="tims-admin-button"
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.8125rem", textDecoration: "none" }}
                      >
                        {page.editLabel}
                      </Link>
                    )}
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
