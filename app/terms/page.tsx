import type { Metadata } from "next";
import LegalRoute from "./LegalRoute";

export const metadata: Metadata = {
  title: "Terms of Use — a planning tool, honestly · GetCloser",
  description:
    "The terms for using GetCloser: a free planning tool to start the conversation about moving in together. The figures are honest estimates, not financial or immigration advice — verify anything that matters.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use — a planning tool, honestly · GetCloser",
    description:
      "A free conversation-starter, not financial or immigration advice. Estimates are a starting point — verify the numbers that matter.",
    type: "article",
  },
};

export default function Page() {
  return <LegalRoute />;
}
