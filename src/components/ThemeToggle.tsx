"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("uc.theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Theme umschalten"
      className="grid h-8 w-8 place-items-center rounded-full border border-line text-inksoft transition-colors hover:text-ink"
    >
      <span aria-hidden>{dark ? "☀️" : "🌙"}</span>
    </button>
  );
}
