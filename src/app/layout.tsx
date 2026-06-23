import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdunniChatbot from "@/components/AdunniChatbot";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SJMUSSO '07 Alumni",
  description:
    "Saint John/Mary's Unity Secondary School, Owo — 2007 Alumni Association",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute w-96 h-96 text-brand-blue top-[-80px] right-[-80px] animate-crest-drift"
            style={{ opacity: 0.03 }}
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 2L98 35V75L50 98L2 75V35L50 2Z" />
            <path d="M50 12L88 38V68L50 88L12 68V38L50 12Z" fill="white" opacity="0.3" />
            <path d="M35 42L50 32L65 42V58L50 68L35 58V42Z" />
          </svg>
          <svg
            className="absolute w-64 h-64 text-brand-gold animate-crest-drift-reverse"
            style={{ opacity: 0.03, bottom: "25%", left: "-64px" }}
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 2L98 35V75L50 98L2 75V35L50 2Z" />
            <path d="M50 12L88 38V68L50 88L12 68V38L50 12Z" fill="white" opacity="0.3" />
            <path d="M35 42L50 32L65 42V58L50 68L35 58V42Z" />
          </svg>
          <svg
            className="absolute w-48 h-48 text-brand-blue animate-crest-float"
            style={{ opacity: 0.02, top: "33%", right: "25%" }}
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 2L98 35V75L50 98L2 75V35L50 2Z" />
            <path d="M50 12L88 38V68L50 88L12 68V38L50 12Z" fill="white" opacity="0.3" />
            <path d="M35 42L50 32L65 42V58L50 68L35 58V42Z" />
          </svg>
        </div>
        <Header />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <AdunniChatbot />
      </body>
    </html>
  );
}
