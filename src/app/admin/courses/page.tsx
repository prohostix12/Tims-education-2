import Link from "next/link";

const courseCategories = [
  {
    id: "sslc-plus-two",
    name: "SSLC / Plus Two",
    href: "/admin/courses/sslc-plus-two",
    description: "Secondary (10th) and Higher Secondary (12th) open schooling programs under NIOS.",
    count: "4 Streams",
    badge: "Open Schooling",
    icon: "🎓",
  },
  {
    id: "online-degree",
    name: "Online Degree",
    href: "/admin/courses/online-degree",
    description: "UGC-recognized online undergraduate degree courses (BA, B.Com, B.Sc, BBA, BCA).",
    count: "12 Programs",
    badge: "UG Degrees",
    icon: "💻",
  },
  {
    id: "post-graduation",
    name: "Post Graduation",
    href: "/admin/courses/post-graduation",
    description: "Postgraduate master's degree courses (MA, M.Com, M.Sc, MBA, MCA).",
    count: "8 Programs",
    badge: "PG Masters",
    icon: "📜",
  },
  {
    id: "btech-mtech",
    name: "B-Tech / M-Tech",
    href: "/admin/courses/btech-mtech",
    description: "Engineering and technology degree programs with credit transfer and lateral entry options.",
    count: "6 Streams",
    badge: "Engineering",
    icon: "⚙️",
  },
  {
    id: "diploma",
    name: "Diploma",
    href: "/admin/courses/diploma",
    description: "Polytechnic, executive, and specialized diploma certification courses.",
    count: "10 Courses",
    badge: "Certifications",
    icon: "📄",
  },
  {
    id: "apprenticeship",
    name: "Apprenticeship",
    href: "/admin/courses/apprenticeship",
    description: "Hands-on industry apprenticeship, workplace training, and stipend programs.",
    count: "5 Tracks",
    badge: "Industry",
    icon: "🛠️",
  },
];

export default function AdminCoursesPage() {
  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Academic Programs</span>
        <h1 className="tims-admin-heading">Courses Management</h1>
        <p className="tims-admin-subtitle">
          Select a category below or from the sidebar menu to manage specific course listings, curricula, and admissions.
        </p>
      </div>

      <div className="tims-admin-stats">
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Total Categories</span>
          <div className="tims-admin-stat-value">6</div>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Active Programs</span>
          <div className="tims-admin-stat-value">45+</div>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Partner Universities</span>
          <div className="tims-admin-stat-value">18</div>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Enrollment Status</span>
          <div className="tims-admin-stat-value" style={{ color: "#16a34a" }}>Open (2026)</div>
        </div>
      </div>

      <div className="tims-admin-grid-2">
        {courseCategories.map((cat) => (
          <div key={cat.id} className="tims-admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "2rem", lineHeight: 1 }}>{cat.icon}</span>
                <span className="tims-admin-badge">{cat.badge}</span>
              </div>
              <h2 className="tims-admin-card-title" style={{ fontSize: "1.2rem", margin: "0 0 0.5rem" }}>
                {cat.name}
              </h2>
              <p className="tims-admin-subtitle" style={{ fontSize: "0.875rem", marginBottom: "1rem", lineHeight: 1.5 }}>
                {cat.description}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--aa-border)" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--aa-muted)", fontWeight: 600 }}>
                {cat.count}
              </span>
              <Link href={cat.href} className="tims-admin-secondary-button" style={{ textDecoration: "none" }}>
                Manage {cat.name} &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
