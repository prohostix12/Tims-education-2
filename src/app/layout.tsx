import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
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
    <html lang="en" className={spaceMono.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
