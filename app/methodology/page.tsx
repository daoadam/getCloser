import type { Metadata } from "next";
import MethodologyRoute from "./MethodologyRoute";

export const metadata: Metadata = {
  title: "How we calculate this — GetCloser Methodology",
  description:
    "Exactly how GetCloser estimates the cost of moving in together: income & currency, rent & buying, everyday living, the move, the verdict, and your future — with every assumption laid out honestly.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "How we calculate this — GetCloser Methodology",
    description:
      "Every assumption behind the simulator, laid out plainly. What's real, what's indicative, and where we use a rough rule of thumb.",
    type: "article",
  },
};

export default function Page() {
  return <MethodologyRoute />;
}
