"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const TRIPLE_TAP_WINDOW_MS = 600;
const LONG_PRESS_MS = 5000;

/**
 * Official client-supplied logo (public/assets/logo/anchorline-logo.png).
 * Pairs the mark with the "PROJECTS | PEOPLE | PERFORMANCE | PARTNERSHIPS"
 * tagline. The source file's opaque white backing was keyed out to
 * transparent and the canvas cropped to the mark's bounding box, so it
 * sits directly on the header instead of showing a white plate; intrinsic
 * size (1631x491) reflects that crop. Rendered size is controlled by the
 * className below.
 *
 * Hidden admin entry point, per instruction: a normal single tap/click
 * still goes home. Three taps within 600ms, or a 5-second press-and-
 * hold, instead routes to /login — no visible "Login"/"Admin" link
 * anywhere in the public nav.
 */
export function Logo() {
  const router = useRouter();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFiredRef = useRef(false);

  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerDown = () => {
    longPressFiredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      router.push("/login");
    }, LONG_PRESS_MS);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (longPressFiredRef.current) {
      // The long-press already navigated; don't also follow the link.
      e.preventDefault();
      return;
    }

    tapCountRef.current += 1;
    if (tapCountRef.current >= 3) {
      e.preventDefault();
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      router.push("/login");
      return;
    }

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TRIPLE_TAP_WINDOW_MS);
  };

  return (
    <Link
      href="/"
      className="inline-flex items-center shrink-0"
      aria-label="Anchorline Project Partners, home"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={clearLongPress}
      onPointerLeave={clearLongPress}
      onPointerCancel={clearLongPress}
    >
      <Image
        src="/assets/logo/anchorline-logo.png"
        alt="Anchorline Project Partners"
        width={1631}
        height={491}
        className="h-11 w-auto sm:h-12"
        priority
      />
    </Link>
  );
}
