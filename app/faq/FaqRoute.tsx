"use client";

// Standalone, deep-linkable /faq route. Wraps the shared FAQ view and wires its
// navigation to the Next router: Back returns to the home simulator, Start hands
// off to the intake via ?start=1.

import { useRouter } from "next/navigation";
import Faq from "../Faq";

export default function FaqRoute() {
  const router = useRouter();
  return (
    <Faq
      onBack={() => router.push("/calculator")}
      onStart={() => router.push("/calculator?start=1")}
    />
  );
}
