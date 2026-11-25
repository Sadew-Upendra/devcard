import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "DevCard · Your GitHub. Your card.",
  description:
    "Enter a GitHub username and get a FUT-style developer card with ranking.",
  icons: { icon: "/devcard-icon.svg" },
  openGraph: { siteName: "DevCard", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 pt-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}