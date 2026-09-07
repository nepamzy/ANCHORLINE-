"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { TierIcon } from "@/components/sections/TierIcon";
import { navigation } from "@/content/site";
import type { Tier } from "@/lib/content";

export function Header({ tiers }: { tiers: Tier[] }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navigation.map((item) =>
            item.label === "About" ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  aria-expanded={aboutOpen}
                  onFocus={() => setAboutOpen(true)}
                  className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-navy-900 after:absolute after:-bottom-0 after:left-3 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 ${
                    pathname === item.href || pathname === "/why-anchorline"
                      ? "text-navy-900 after:w-6"
                      : "text-slate after:w-0 hover:after:w-6"
                  }`}
                >
                  {item.label}
                  <svg viewBox="0 0 12 8" className="h-2.5 w-2.5" aria-hidden="true">
                    <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </Link>

                {aboutOpen && (
                  <div
                    className="absolute top-full left-1/2 w-56 -translate-x-1/2 pt-2"
                    onFocus={() => setAboutOpen(true)}
                  >
                    <div className="rounded-card border border-line bg-paper p-2 shadow-lg">
                      <Link
                        href="/why-anchorline"
                        className="block rounded-control px-3 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50 hover:text-navy-900"
                      >
                        Why Anchorline
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : item.label === "Services" ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  aria-expanded={servicesOpen}
                  onFocus={() => setServicesOpen(true)}
                  className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-navy-900 after:absolute after:-bottom-0 after:left-3 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 ${
                    pathname.startsWith(item.href)
                      ? "text-navy-900 after:w-6"
                      : "text-slate after:w-0 hover:after:w-6"
                  }`}
                >
                  {item.label}
                  <svg viewBox="0 0 12 8" className="h-2.5 w-2.5" aria-hidden="true">
                    <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </Link>

                {servicesOpen && (
                  <div
                    className="absolute top-full left-1/2 w-80 -translate-x-1/2 pt-2"
                    onFocus={() => setServicesOpen(true)}
                  >
                    <div className="rounded-card border border-line bg-paper p-2 shadow-lg">
                      {tiers.map((tier) => (
                        <Link
                          key={tier.name}
                          href={`/services/${tier.name.toLowerCase()}`}
                          className="flex items-start gap-3 rounded-control px-3 py-2.5 hover:bg-navy-50"
                        >
                          <TierIcon name={tier.name} className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                          <span>
                            <span className="block text-sm font-semibold text-navy-900">{tier.name}</span>
                            <span className="block text-xs text-slate">{tier.forWhom}</span>
                          </span>
                        </Link>
                      ))}
                      <div className="mt-1 border-t border-line pt-1">
                        <Link
                          href="/services"
                          className="block rounded-control px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50 hover:text-navy-900"
                        >
                          See all tiers →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-navy-900 after:absolute after:-bottom-0 after:left-3 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 ${
                  pathname === item.href
                    ? "text-navy-900 after:w-6"
                    : "text-slate after:w-0 hover:after:w-6"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-control border border-line text-navy-900"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="lg:hidden border-t border-line bg-paper animate-fade-up motion-reduce:animate-none"
          style={{ animationDuration: "250ms" }}
        >
          <Container className="flex flex-col gap-1 py-4">
            {navigation.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`min-h-11 flex items-center rounded-control px-2 text-base font-medium ${
                    pathname === item.href ? "text-navy-900 bg-navy-50" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
                {item.label === "About" && (
                  <Link
                    href="/why-anchorline"
                    onClick={() => setOpen(false)}
                    aria-current={pathname === "/why-anchorline" ? "page" : undefined}
                    className={`ml-4 flex min-h-11 items-center rounded-control px-2 text-sm font-medium ${
                      pathname === "/why-anchorline" ? "text-navy-900 bg-navy-50" : "text-slate"
                    }`}
                  >
                    Why Anchorline
                  </Link>
                )}
              </div>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
