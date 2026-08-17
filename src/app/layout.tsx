import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nav",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIMS Education",
  description: "TIMS Education - Learning Without Boundaries",
  icons: {
    icon: "/images/tims_logo/tims_favicon.png",
    shortcut: "/images/tims_logo/tims_favicon.png",
    apple: "/images/tims_logo/tims_favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
