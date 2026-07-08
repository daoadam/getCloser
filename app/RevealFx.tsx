"use client";

// Scroll-in animation for the journal: anything inside carrying [data-reveal]
// fades up as it enters the viewport (GSAP + ScrollTrigger, once per element).
// Respects prefers-reduced-motion via gsap.matchMedia — reduced users just see
// the content, no tricks.

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RevealFx({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const els = ref.current!.querySelectorAll<HTMLElement>("[data-reveal]");
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            delay: (i % 2) * 0.08, // neighbours in the grid land offset
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
