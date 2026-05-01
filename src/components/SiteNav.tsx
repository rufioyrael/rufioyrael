"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/listen", label: "Listen" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div
        className={[
          "transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-black/50 backdrop-blur-xl"
            : "border-b border-transparent bg-black/10 backdrop-blur-md",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-6">
          {/* Brand */}
          <Link
            href="/"
            className="group relative flex min-w-0 items-center gap-3"
            aria-label="Rufio Yrael home"
          >
            <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]/80 blur-[2px]" />
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_20px_rgba(255,90,60,0.45)]" />
            </span>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold uppercase tracking-[0.32em] text-white/95 transition group-hover:text-white">
                Rufio Yrael
              </div>
              <div className="truncate text-[10px] uppercase tracking-[0.26em] text-white/38 transition group-hover:text-white/50">
                Process &amp; Steel
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-full px-4 py-2 text-sm transition",
                      active
                        ? "bg-white/[0.10] text-white"
                        : "text-white/60 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 transition hover:bg-white/[0.08] hover:text-white md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="tracking-wide">{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        {/* Mobile panel */}
        <div
          className={[
            "overflow-hidden transition-all duration-300 md:hidden",
            menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="mx-auto max-w-6xl px-6 pb-4">
            <div className="rounded-3xl border border-white/10 bg-black/72 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <nav className="flex flex-col">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={[
                      "rounded-2xl px-4 py-3 text-sm transition",
                      active
                          ? "bg-white/[0.08] text-white"
                          : "text-white/68 hover:bg-white/[0.05] hover:text-white",
                      ].join(" ")}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
