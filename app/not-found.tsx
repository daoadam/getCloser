import Link from "next/link";
import Mascot from "./Mascot";

// 404 — Pip, lost, being honest about it.

export default function NotFound() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#faf6f1] px-6 py-24 text-center">
      <Mascot mood="worry" size={110} />
      <h1 className="mt-6 font-display text-[40px] font-semibold tracking-[-0.02em] text-[#2b2329]">
        404 — this page is long distance
      </h1>
      <p className="mt-3 max-w-[440px] text-[15.5px] leading-relaxed text-[#6b6068]">
        it exists in another timezone, or it never existed at all. pip looked everywhere.
        pip is a very thorough bird.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-[#b25c72] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-105"
        >
          back to the journal →
        </Link>
        <Link
          href="/calculator"
          className="rounded-xl border border-[#ddd5cb] bg-white px-5 py-3 text-[14px] font-semibold text-[#3f3a40] transition hover:bg-[#faf6f1]"
        >
          or run your numbers
        </Link>
      </div>
    </main>
  );
}
