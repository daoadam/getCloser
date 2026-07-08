"use client";

// The dark mode button. Explicit opt-in: light by default, remembered in
// localStorage ("ctd-theme"), applied as [data-theme="dark"] on <html>.
// A tiny inline script in layout.tsx applies the saved choice before paint.

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggle() {
    const next = !(document.documentElement.dataset.theme === "dark");
    if (next) {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem("ctd-theme", next ? "dark" : "light");
    } catch {
      /* private mode */
    }
    setDark(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "lights on" : "lights off"}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ddd5cb] bg-white text-[15px] transition hover:border-[#b25c72]/50"
    >
      {/* render both to avoid hydration flicker; CSS hides the wrong one */}
      <span className="theme-icon-moon" aria-hidden>🌙</span>
      <span className="theme-icon-sun" aria-hidden>☀️</span>
    </button>
  );
}
