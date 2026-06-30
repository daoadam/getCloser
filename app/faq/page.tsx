import type { Metadata } from "next";
import FaqRoute from "./FaqRoute";

export const metadata: Metadata = {
  title: "FAQ — the honest answers · GetCloser",
  description:
    "What couples ask us most about GetCloser: where the numbers come from, how accurate they are, partner visas, your data and privacy, and what the tool is (and isn't).",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — the honest answers · GetCloser",
    description:
      "Honest answers about the numbers, visas, privacy, and what GetCloser is (and isn't).",
    type: "article",
  },
};

export default function Page() {
  return <FaqRoute />;
}
