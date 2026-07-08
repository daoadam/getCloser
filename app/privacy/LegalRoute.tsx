"use client";

// Standalone, deep-linkable /privacy route. Wraps the shared Legal view on the
// Privacy tab and wires its navigation to the Next router: Back returns to the
// home simulator, Start hands off to the intake via ?start=1.

import { useRouter } from "next/navigation";
import Legal from "../Legal";

export default function LegalRoute() {
  const router = useRouter();
  return (
    <Legal
      initialTab="privacy"
      onBack={() => router.push("/calculator")}
      onStart={() => router.push("/calculator?start=1")}
    />
  );
}
