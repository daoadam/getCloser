"use client";

// Standalone, deep-linkable /terms route. Wraps the shared Legal view on the
// Terms tab and wires its navigation to the Next router: Back returns to the
// home simulator, Start hands off to the intake via ?start=1.

import { useRouter } from "next/navigation";
import Legal from "../Legal";

export default function LegalRoute() {
  const router = useRouter();
  return (
    <Legal
      initialTab="terms"
      onBack={() => router.push("/")}
      onStart={() => router.push("/?start=1")}
    />
  );
}
