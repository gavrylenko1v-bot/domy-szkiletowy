"use client";
import Link from "next/link";
import { Brand } from "./brand";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, Menu, X } from "./icons";
import { site } from "@/content/site";
const links = [
  ["Projekty domów", "/projekty"],
  ["Technologia", "/technologia"],
  ["O nas", "/o-nas"],
  ["Kontakt", "/kontakt"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (open) {
      const headerNode = header.current;
      document.body.style.overflow = "hidden";
      const background = document.querySelectorAll<HTMLElement>("main,footer");
      background.forEach((el) => (el.inert = true));
      const first =
        headerNode?.querySelector<HTMLAnchorElement>(".mobile-nav a");
      first?.focus();
      const trap = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
          return;
        }
        if (event.key !== "Tab") return;
        const nodes = Array.from(
          headerNode?.querySelectorAll<HTMLElement>(
            ".menu-toggle,.mobile-nav a",
          ) || [],
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      };
      document.addEventListener("keydown", trap);
      return () => {
        document.body.style.overflow = "";
        background.forEach((el) => (el.inert = false));
        document.removeEventListener("keydown", trap);
        headerNode?.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      };
    }
  }, [open]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 651px)");
    const close = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);
  return (
    <header ref={header} className="site-header">
      <div className="shell header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label={`${site.name} — strona główna`}
        >
          <Brand />
        </Link>
        <nav className="desktop-nav" aria-label="Menu główne">
          {links.map(([label, url]) => (
            <Link
              key={url}
              aria-current={pathname === url ? "page" : undefined}
              href={url}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/kontakt#wycena" className="button small header-cta">
          Zapytaj o wycenę <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Menu mobilne"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <Link
            href="/"
            className="mobile-brand"
            aria-label={`${site.name} — strona główna`}
            onClick={() => setOpen(false)}
          >
            <Brand />
          </Link>
          {links.map(([label, url]) => (
            <Link key={url} href={url} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight />
            </Link>
          ))}
          <Link href="/kontakt#wycena" onClick={() => setOpen(false)}>
            Zapytaj o wycenę <ArrowUpRight />
          </Link>
        </nav>
      )}
    </header>
  );
}
