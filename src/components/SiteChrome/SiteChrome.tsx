"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

/**
 * The admin panel has its own header/nav (see AdminHeader), so the public
 * site chrome is skipped there instead of stacking both navbars.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <EnquiryModal />
    </>
  );
}
