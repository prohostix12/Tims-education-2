import Link from "next/link";

const users = [{ name: "Admin", email: "info@timseducation.com", role: "Administrator", status: "Active" }];

export default function AdminUsersPage() {
  return (
    <div>
      <div className="tims-admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="tims-admin-eyebrow">Access</span>
          <h1 className="tims-admin-heading">Users</h1>
          <p className="tims-admin-subtitle">Accounts with access to this admin panel.</p>
        </div>
        <Link href="/admin/change-password" className="tims-admin-save-button" style={{ textDecoration: "none" }}>
          Change Password
        </Link>
      </div>

      <div className="tims-admin-card">
        <div className="tims-admin-table-wrap">
          <table className="tims-admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className="tims-admin-badge">{user.status}</span>
                  </td>
                  <td>
                    <Link
                      href="/admin/change-password"
                      style={{ fontSize: "0.8125rem", color: "#6b21a8", fontWeight: 600, textDecoration: "none" }}
                    >
                      Change Password
                    </Link>
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
