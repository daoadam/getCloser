import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Soft, romantic display serif for headings — the "editorial & sweet" voice.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // Makes every relative canonical/OG URL below (and in child pages) absolute.
  metadataBase: new URL(SITE_URL),
  title: "Close the Distance — Can you afford to move in together?",
  description:
    "A free simulator for couples living apart. See exactly what moving in together costs, where in the world you can afford to live, and how long until you can close the distance.",
  keywords: [
    "close the distance",
    "move in together cost",
    "long distance relationship",
    "afford to live together",
    "long distance relationship calculator",
    "cost to move in together",
  ],
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    title: "Close the Distance — Can you afford to move in together?",
    description:
      "See what moving in together actually costs, and where you two can afford to live.",
    type: "website",
    siteName: "Close the Distance",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
