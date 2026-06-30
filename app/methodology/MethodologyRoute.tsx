"use client";

// Standalone, deep-linkable /methodology route. Wraps the shared Methodology
// view and wires its navigation to the Next router: Back returns to the home
// simulator, Start hands off to the intake via ?start=1.

import { useRouter } from "next/navigation";
import Methodology from "../Methodology";

export default function MethodologyRoute() {
  const router = useRouter();
  return (
    <Methodology
      onBack={() => router.push("/")}
      onStart={() => router.push("/?start=1")}
    />
  );
}
