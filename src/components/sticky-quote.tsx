"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "./icons";
export function StickyQuote({ name }: { name: string }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const target = document.getElementById("wycena");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return hidden ? null : (
    <a className="mobile-sticky-quote" href="#wycena">
      Zapytaj o {name}
      <ArrowUpRight size={18} />
    </a>
  );
}
