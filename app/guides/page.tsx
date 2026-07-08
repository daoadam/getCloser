import type { Metadata } from "next";
import GuidesRoute from "./GuidesRoute";

export const metadata: Metadata = {
  title: "Guides — closing the distance, explained · Close the Distance",
  description:
    "Plain-English guides for couples making the move: partner visas, the real cost of moving in together, surviving long distance, and city-by-city breakdowns.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Guides — closing the distance, explained · Close the Distance",
    description:
      "Visas, money, and surviving long distance until you don't have to.",
    type: "website",
  },
};

export default function Page() {
  return <GuidesRoute />;
}
