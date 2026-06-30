"use client";

// Standalone, deep-linkable /guides route. Wraps the shared Guides view and
// wires its navigation to the Next router: Back returns to the home simulator,
// Start hands off to the intake via ?start=1.

import { useRouter } from "next/navigation";
import Guides from "../Guides";

export default function GuidesRoute() {
  const router = useRouter();
  return (
    <Guides
      onBack={() => router.push("/")}
      onStart={() => router.push("/?start=1")}
    />
  );
}
