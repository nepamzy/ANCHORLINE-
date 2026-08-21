"use client";

import { useSyncExternalStore } from "react";

const query = "(max-width: 820px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

/** True below 820px — used to pick the smaller film-shot image variant. */
export function useIsNarrowViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
