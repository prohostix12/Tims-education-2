import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminHeader from "@/components/AdminHeader/AdminHeader";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin | TIMS Education",
  description: "TIMS Education admin panel.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="tims-admin-shell">
      <AdminHeader />
      <main className="tims-admin-main">{children}</main>
    </div>
  );
}
