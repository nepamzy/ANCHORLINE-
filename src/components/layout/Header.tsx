"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { contactNav, navigation } from "@/content/site";

export function Header({ whatsappHref, whatsappNumber }: { whatsappHref: string; whatsappNumber: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`relative text-sm font-medium transition-colors hover:text-navy-900 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 ${
                pathname === item.href
                  ? "text-navy-900 after:w-full"
                  : "text-slate after:w-0 hover:after:w-full"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <WhatsAppButton href={whatsappHref} number={whatsappNumber} />
          <Button href={contactNav.href}>Get a Quote</Button>
        </div>

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
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`min-h-11 flex items-center rounded-control px-2 text-base font-medium ${
                  pathname === item.href ? "text-navy-900 bg-navy-50" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-3">
              <Button href={contactNav.href} onClick={() => setOpen(false)}>
                Get a Quote
              </Button>
              <WhatsAppButton href={whatsappHref} number={whatsappNumber} />
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
