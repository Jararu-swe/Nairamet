"use client";

import { Suspense, lazy } from "react";

const LazySkyscraperAd = lazy(() =>
  import("./skyscraper-ad").then((mod) => ({
    default: mod.SkyscraperAd,
  }))
);

const LazyStickySkyscraperAd = lazy(() =>
  import("./skyscraper-ad").then((mod) => ({
    default: mod.StickySkyscraperAd,
  }))
);

const LazyLeaderboardAd = lazy(() =>
  import("./leaderboard-ad").then((mod) => ({
    default: mod.LeaderboardAd,
  }))
);

/**
 * Lazy-loaded Skyscraper Ad wrapper (AdSense)
 * Returns null while loading so no empty grey placeholder boxes appear.
 */
export function LazySkyscraperAdWrapper(props: {
  slot?: string;
  zoneId?: string;
  className?: string;
}) {
  return (
    <Suspense fallback={null}>
      <LazySkyscraperAd slot={props.slot} className={props.className} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Sticky Skyscraper Ad wrapper (AdSense)
 */
export function LazyStickySkyscraperAdWrapper(props: {
  slot?: string;
  zoneId?: string;
}) {
  return (
    <Suspense fallback={null}>
      <LazyStickySkyscraperAd slot={props.slot} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Leaderboard Ad wrapper (AdSense)
 */
export function LazyLeaderboardAdWrapper(props: {
  slot?: string;
  zoneId?: string;
  network?: string;
  className?: string;
}) {
  return (
    <Suspense fallback={null}>
      <LazyLeaderboardAd slot={props.slot} className={props.className} />
    </Suspense>
  );
}
