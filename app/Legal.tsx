"use client";

// Privacy & Terms — "plain-English legal." Two tabs over one page: the Privacy
// Policy and the Terms of Use. The voice matches the FAQ and Methodology pages
// and every claim stays honest about what Close the Distance actually does — it runs in
// your browser, stores an email only if you opt in, and never sells data.

import { useState } from "react";
import Mascot from "./Mascot";

// Wordmark glyph, matching Landing's heart-with-a-gap.
function HeartGap({ stroke = "currentColor" }: { stroke?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.2 1.2 4 2.3"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 21s7-4.35 9.5-8.5C23.5 9 21.5 5 18 5c-2 0-3.2 1.2-4 2.3"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export type LegalTab = "privacy" | "terms";

type Section = { id: string; title: string; body: React.ReactNode };
type Doc = {
  tab: LegalTab;
  label: string;
  summaryTitle: string;
  summary: string[];
  sections: Section[];
};

// Honest, plain-English copy. Every line matches what the app actually does and
// how it's built (browser-side simulator, opt-in email + plan snapshot stored in
// Supabase, live rates from a public API, no accounts, no ad tracking).
const DOCS: Record<LegalTab, Doc> = {
  privacy: {
    tab: "privacy",
    label: "Privacy Policy",
    summaryTitle: "The short version",
    summary: [
      "Close the Distance runs in your browser. Your incomes, savings and plan stay on your device.",
      "We only store an email address (and the plan attached to it) if you choose to save or email your plan.",
      "No accounts, no selling data, no ad tracking. Ask us any time and we’ll delete your email.",
    ],
    sections: [
      {
        id: "collect",
        title: "What we collect",
        body: (
          <>
            By default, nothing personal. The simulator computes everything locally in your
            browser — the numbers you enter are never sent to us. The only personal information we
            receive is an <strong>email address</strong>, and only if you actively submit one to
            save or be emailed your plan. When you do, we store that email alongside a snapshot of
            the plan you chose to save (your destination, the headline figures, and your verdict) so
            we can send it to you and let you know as the product grows.
          </>
        ),
      },
      {
        id: "plan",
        title: "How your plan works",
        body: (
          <>
            When you share a plan, the entire scenario is encoded directly into the link — there’s
            no server-side record of it and no account required. Anyone with the link can open a
            read-only copy; anyone without it cannot. If you never save or share, your session
            simply disappears when you close the tab.
          </>
        ),
      },
      {
        id: "cookies",
        title: "Cookies & analytics",
        body: (
          <>
            We use only the minimal storage needed to make the tool work (for example, remembering
            your place on the page). We do not use advertising cookies or sell your activity. If we
            add privacy-friendly, aggregate analytics to understand which guides are useful, it will
            never be tied to your identity or the figures you enter.
          </>
        ),
      },
      {
        id: "third-parties",
        title: "Third parties",
        body: (
          <>
            Saved plans and emails are stored with <strong>Supabase</strong>, our database provider,
            and are only created when you opt in. Live exchange rates are fetched from a public
            rates API (open.er-api.com), which receives no personal data — just a request for the
            day’s rates. We don’t share your email with anyone else.
          </>
        ),
      },
      {
        id: "choices",
        title: "Your choices",
        body: (
          <>
            You can use the entire calculator without giving us anything. If you’ve saved an email
            and want it gone, email us and we’ll delete it and any attached plan. Where local
            privacy law gives you rights to access or correct your data, we’ll honour them.
          </>
        ),
      },
      {
        id: "contact",
        title: "Contact",
        body: (
          <>
            Questions about privacy? Email{" "}
            <a
              href="mailto:privacy@closethedistance.blog?subject=Close%20the%20Distance%20privacy%20question"
              className="font-semibold text-[#b25c72] hover:underline"
            >
              privacy@closethedistance.blog
            </a>{" "}
            and a real person will reply.
          </>
        ),
      },
    ],
  },
  terms: {
    tab: "terms",
    label: "Terms of Use",
    summaryTitle: "The short version",
    summary: [
      "Close the Distance is a free planning tool to help two people start a conversation about moving in together.",
      "The figures are honest estimates, not financial or immigration advice — confirm anything that matters.",
      "Use it for your own planning, don’t abuse it, and treat the numbers as a starting point.",
    ],
    sections: [
      {
        id: "what-it-is",
        title: "What Close the Distance is (and isn’t)",
        body: (
          <>
            Close the Distance is a free tool that estimates what it might cost two people in different places
            to live together. It’s a starting point for the conversation — <strong>not</strong>{" "}
            financial, tax, legal or immigration advice. Your real numbers will differ, and big
            decisions deserve a chat with a qualified professional. By using the tool you accept
            that it’s for general planning only.
          </>
        ),
      },
      {
        id: "estimates",
        title: "Estimates & accuracy",
        body: (
          <>
            Rents, prices and living costs are indicative figures designed to be internally
            consistent so comparisons are fair — they’re a realistic starting point, not a live feed
            of today’s listings. Visa, stamp-duty and mortgage figures are rough global estimates
            that change over time. Every line on your results is editable, so drop in your own real
            quotes the moment you have them. We make no promise that any figure is exact.
          </>
        ),
      },
      {
        id: "your-use",
        title: "Your use of the tool",
        body: (
          <>
            Use Close the Distance for your own personal planning. Please don’t try to break, overload,
            scrape or misuse it, or use it to harm anyone. Plans you share carry the scenario inside
            the link, so only pass a link to people you’d trust with those numbers. You’re
            responsible for the information you enter and the decisions you make from it.
          </>
        ),
      },
      {
        id: "no-warranty",
        title: "No warranties",
        body: (
          <>
            Close the Distance is provided “as is.” We work hard to keep it accurate and available, but we
            can’t guarantee it will be error-free, uninterrupted, or right for your exact situation.
            Live exchange rates and third-party data can move or be unavailable, in which case we
            fall back to sensible built-in values.
          </>
        ),
      },
      {
        id: "liability",
        title: "Limitation of liability",
        body: (
          <>
            To the extent the law allows, we’re not liable for decisions made, or losses incurred,
            from relying on the estimates this tool produces. It’s a conversation-starter — please
            verify the numbers that matter before you act on them.
          </>
        ),
      },
      {
        id: "changes",
        title: "Changes & contact",
        body: (
          <>
            We may update these terms as the product grows; the “last updated” date above always
            reflects the current version. Questions? Email{" "}
            <a
              href="mailto:hello@closethedistance.blog?subject=Close%20the%20Distance%20terms%20question"
              className="font-semibold text-[#b25c72] hover:underline"
            >
              hello@closethedistance.blog
            </a>
            .
          </>
        ),
      },
    ],
  },
};

function ContactCard() {
  return (
    <div className="rounded-[16px] border border-[#b25c72]/20 bg-[#b25c72]/[0.07] p-[18px]">
      <div className="text-sm font-semibold">Questions?</div>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6b6068]">
        A real person reads every message.
      </p>
      <a
        href="mailto:hello@closethedistance.blog?subject=Close%20the%20Distance%20legal%20question"
        className="mt-3 block rounded-xl bg-[#b25c72] py-[11px] text-center text-[13.5px] font-semibold text-white transition hover:brightness-105"
      >
        Email us
      </a>
    </div>
  );
}

export default function Legal({
  onBack,
  onStart,
  initialTab = "privacy",
}: {
  onBack: () => void;
  onStart: () => void;
  initialTab?: LegalTab;
}) {
  const [tab, setTab] = useState<LegalTab>(initialTab);
  const doc = DOCS[tab];

  const jumpTo = (id: string) =>
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-full bg-[#faf6f1] pb-20">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <button onClick={onBack} className="flex items-center gap-2" aria-label="Close the Distance home">
          <HeartGap stroke="#b25c72" />
          <span className="font-display text-lg font-semibold text-[#b25c72]">Close the Distance</span>
        </button>
        <button
          onClick={onBack}
          className="rounded-xl border border-[#ddd5cb] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#3f3a40] transition hover:bg-[#faf6f1]"
        >
          ← Back to the calculator
        </button>
      </div>

      <div className="mx-auto max-w-[1040px] px-5 py-10 sm:px-12 sm:py-12">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
              Legal
            </div>
            <h1 className="mt-2.5 font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[46px]">
              Privacy &amp; Terms
            </h1>
            <p className="mt-3 text-[15px] text-[#a59ca2]">Last updated 27 June 2026</p>
          </div>
          <Mascot mood="wave" size={80} className="hidden shrink-0 sm:block" />
        </div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div
          className="mt-6 inline-flex gap-1.5 rounded-[13px] bg-[#f1ece4] p-1.5"
          role="tablist"
          aria-label="Legal documents"
        >
          {(Object.values(DOCS) as Doc[]).map((d) => {
            const active = tab === d.tab;
            return (
              <button
                key={d.tab}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(d.tab)}
                className={`rounded-[9px] px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-white text-[#b25c72] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                    : "text-[#8a7f86] hover:text-[#5a525a]"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-[220px_1fr] sm:items-start">
          {/* ── Section rail (desktop) ──────────────────────── */}
          <div className="sticky top-20 hidden sm:block">
            <div className="rounded-[16px] border border-[#ece5db] bg-white p-2.5">
              <button
                onClick={() => jumpTo("summary")}
                className="block w-full rounded-[11px] bg-[#b25c72]/10 px-3.5 py-2.5 text-left text-sm font-semibold text-[#b25c72] transition"
              >
                {doc.summaryTitle}
              </button>
              {doc.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jumpTo(s.id)}
                  className="block w-full rounded-[11px] px-3.5 py-2.5 text-left text-sm font-medium text-[#5a525a] transition hover:bg-[#faf6f1]"
                >
                  {s.title}
                </button>
              ))}
            </div>
            <div className="mt-3.5">
              <ContactCard />
            </div>
          </div>

          {/* ── Body ────────────────────────────────────────── */}
          <div>
            {/* Summary callout */}
            <div
              id="sec-summary"
              className="scroll-mt-20 rounded-[18px] border border-[#b25c72]/20 bg-[#b25c72]/[0.07] p-[22px] sm:px-6"
            >
              <div className="font-display text-[20px] font-semibold text-[#7a3f54]">
                {doc.summaryTitle}
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {doc.summary.map((line, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="text-[#b25c72]">✓</span>
                    <span className="text-[14px] leading-relaxed text-[#5a4a50]">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            {doc.sections.map((s) => (
              <div key={s.id} id={`sec-${s.id}`} className="mt-7 scroll-mt-20">
                <div className="font-display text-[22px] font-semibold tracking-[-0.01em] sm:text-[24px]">
                  {s.title}
                </div>
                <p className="mt-2.5 text-[14.5px] leading-[1.65] text-[#56504f]">{s.body}</p>
              </div>
            ))}

            {/* Disclaimer */}
            <div className="mt-7 border-t border-[#e3dbd0] pt-[18px] text-[12px] leading-relaxed text-[#a59ca2]">
              This is plain-English summary copy, not a substitute for legal advice. Before relying
              on it, have your final policy and terms reviewed by a qualified legal professional and
              tailored to the places you operate in.
            </div>

            {/* Contact — inline on mobile */}
            <div className="mt-7 sm:hidden">
              <ContactCard />
            </div>

            {/* ── CTA ───────────────────────────────────────── */}
            <div className="mt-10 text-center sm:text-left">
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
                Ready to see your own numbers?
              </h2>
              <button
                onClick={onStart}
                className="mt-4 inline-flex items-center gap-2.5 rounded-[15px] bg-[#b25c72] px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_22px_-8px_rgba(178,92,114,0.75)] transition hover:brightness-105"
              >
                Start your plan — free →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
