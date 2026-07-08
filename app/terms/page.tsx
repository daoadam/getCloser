import type { Metadata } from "next";
import LegalRoute from "./LegalRoute";

export const metadata: Metadata = {
  title: "Terms of Use — a planning tool, honestly · Close the Distance",
  description:
    "The terms for using Close the Distance: a free planning tool to start the conversation about moving in together. The figures are honest estimates, not financial or immigration advice — verify anything that matters.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use — a planning tool, honestly · Close the Distance",
    description:
      "A free conversation-starter, not financial or immigration advice. Estimates are a starting point — verify the numbers that matter.",
    type: "article",
  },
};

export default function Page() {
  return <LegalRoute />;
}
