import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
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
  title: "GetCloser — Can you afford to move in together?",
  description:
    "A free simulator for couples living apart in Australia. See exactly what moving in together costs, where you can afford to live, and how long until you can close the distance.",
  keywords: [
    "move in together cost",
    "long distance relationship",
    "afford to live together",
    "rent calculator couples Australia",
    "closing the distance",
  ],
  openGraph: {
    title: "GetCloser — Can you afford to move in together?",
    description:
      "See what moving in together actually costs, and where you two can afford to live.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
