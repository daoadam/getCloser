import type { Metadata } from "next";
import LegalRoute from "./LegalRoute";

export const metadata: Metadata = {
  title: "Privacy Policy — your numbers stay yours · Close the Distance",
  description:
    "How Close the Distance handles your data: the simulator runs in your browser, your incomes and plan stay on your device, and we only store an email if you choose to save or email your plan. No accounts, no selling data, no ad tracking.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — your numbers stay yours · Close the Distance",
    description:
      "Runs in your browser. We store an email only if you opt in. No accounts, no data selling, no ad tracking.",
    type: "article",
  },
};

export default function Page() {
  return <LegalRoute />;
}
