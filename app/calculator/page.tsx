import type { Metadata } from "next";
import Simulator from "../Simulator";

// The calculator — the actual simulator app. It used to live at "/", but the
// homepage is now the Journal, so the tool has its own route. The Landing +
// wizard + results all render inside <Simulator/>; ?start=1 drops into intake.

export const metadata: Metadata = {
  title: "The calculator · Close the Distance",
  description:
    "Run your own numbers: see exactly what moving in together would cost the two of you, where in the world you can afford it, and how long until you can close the distance.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  return <Simulator />;
}
