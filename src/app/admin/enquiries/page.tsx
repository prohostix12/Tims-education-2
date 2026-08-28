import { getDb } from "@/lib/mongodb";
import { preferenceLabel } from "@/lib/coursePreferences";

export const dynamic = "force-dynamic";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preference: string;
  source: string;
  createdAt: Date;
};

async function loadEnquiries(): Promise<{ enquiries: Enquiry[]; error: string | null }> {
  try {
    const db = await getDb();
    const docs = await db.collection("enquiries").find().sort({ createdAt: -1 }).limit(200).toArray();
    return {
      enquiries: docs.map((doc) => ({
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        preference: doc.preference,
        source: doc.source,
        createdAt: doc.createdAt,
      })),
      error: null,
    };
  } catch (error) {
    console.error("Failed to load enquiries:", error);
    return { enquiries: [], error: "Could not connect to the database." };
  }
}

const sourceLabels: Record<string, string> = {
  "home-hero": "Home — Make Your Enquiry",
  "contact-page": "Contact — Get In Touch",
};

export default async function AdminEnquiriesPage() {
  const { enquiries, error } = await loadEnquiries();

  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Leads</span>
        <h1 className="tims-admin-heading">Enquiries</h1>
        <p className="tims-admin-subtitle">
          Live submissions from the &ldquo;Make Your Enquiry&rdquo; and &ldquo;Get In Touch&rdquo; forms.
        </p>
      </div>

      <div className="tims-admin-card">
        {error ? (
          <p className="tims-admin-subtitle">{error}</p>
        ) : enquiries.length === 0 ? (
          <p className="tims-admin-subtitle">No enquiries yet — submissions will show up here.</p>
        ) : (
          <div className="tims-admin-table-wrap">
            <table className="tims-admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Preference</th>
                  <th>Source</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td>{enquiry.name}</td>
                    <td>{enquiry.email}</td>
                    <td>{enquiry.phone}</td>
                    <td>
                      <span className="tims-admin-badge tims-admin-badge-muted">
                        {preferenceLabel(enquiry.preference)}
                      </span>
                    </td>
                    <td>{sourceLabels[enquiry.source] || enquiry.source}</td>
                    <td>{new Date(enquiry.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
