import Link from "next/link";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const recentPages = [
  { name: "Home", path: "/", status: "Published" },
  { name: "SVSU Online", path: "/universities/study-materials/svsu-online", status: "Published" },
  { name: "AMU Online", path: "/universities/study-materials/amu-online", status: "Published" },
  { name: "Contact", path: "/contact", status: "Published" },
];

async function loadEnquiryCounts() {
  try {
    const db = await getDb();
    const collection = db.collection("enquiries");
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, thisMonth] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    return { total, thisMonth };
  } catch (error) {
    console.error("Failed to load enquiry counts:", error);
    return { total: null, thisMonth: null };
  }
}

export default async function AdminDashboardPage() {
  const { total, thisMonth } = await loadEnquiryCounts();

  const stats = [
    { label: "Published Pages", value: "32" },
    { label: "Enquiries This Month", value: thisMonth === null ? "—" : String(thisMonth) },
    { label: "Total Enquiries", value: total === null ? "—" : String(total) },
    { label: "Study Material Links", value: "84" },
  ];

  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Overview</span>
        <h1 className="tims-admin-heading">Dashboard</h1>
        <p className="tims-admin-subtitle">
          A quick look at the site. Enquiry counts are live from MongoDB — everything else here is still a UI shell.
        </p>
      </div>

      <div className="tims-admin-stats">
        {stats.map((stat) => (
          <div className="tims-admin-stat-card" key={stat.label}>
            <span className="tims-admin-stat-label">{stat.label}</span>
            <span className="tims-admin-stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="tims-admin-card">
        <h2 className="tims-admin-card-title">Recently Updated Pages</h2>
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
              {recentPages.map((page) => (
                <tr key={page.path}>
                  <td>{page.name}</td>
                  <td>{page.path}</td>
                  <td>
                    <span className="tims-admin-badge">{page.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="tims-admin-subtitle">
        See every submission on the <Link href="/admin/enquiries">Enquiries</Link> page.
      </p>
    </div>
  );
}
