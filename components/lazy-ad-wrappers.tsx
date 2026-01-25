"use client";

import { Suspense, lazy } from "react";

// Lazy load the actual ad components
const LazySkyscraperAd = lazy(() =>
  import("./skyscraper-ad").then((mod) => ({
    default: mod.SkyscraperAd,
  })),
);

const LazyStickySkyscraperAd = lazy(() =>
  import("./skyscraper-ad").then((mod) => ({
    default: mod.StickySkyscraperAd,
  })),
);

const LazyLeaderboardAd = lazy(() =>
  import("./leaderboard-ad").then((mod) => ({
    default: mod.LeaderboardAd,
  })),
);

/**
 * Fallback loading state for skyscraper ads
 */
function SkyscraperAdFallback() {
  return (
    <div className="w-[160px] h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse" />
  );
}

/**
 * Fallback loading state for leaderboard ads
 */
function LeaderboardAdFallback() {
  return (
    <div className="w-full max-w-[728px] h-[90px] bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse" />
  );
}

/**
 * Lazy-loaded Skyscraper Ad wrapper
 * Only loads when component is about to be visible
 */
export function LazySkyscraperAdWrapper(props: {
  zoneId: string;
  network?: "adcash" | "bidvertiser";
  publisherId?: string;
  className?: string;
}) {
  return (
    <Suspense fallback={<SkyscraperAdFallback />}>
      <LazySkyscraperAd {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Sticky Skyscraper Ad wrapper
 * Only loads when component is about to be visible
 */
export function LazyStickySkyscraperAdWrapper(props: {
  zoneId: string;
  network?: "adcash" | "bidvertiser";
  publisherId?: string;
}) {
  return (
    <Suspense fallback={<SkyscraperAdFallback />}>
      <LazyStickySkyscraperAd {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Leaderboard Ad wrapper
 * Only loads when component is about to be visible
 */
export function LazyLeaderboardAdWrapper(props: {
  zoneId: string;
  network?: "adcash" | "bidvertiser" | "adsense";
  publisherId?: string;
  className?: string;
}) {
  return (
    <Suspense fallback={<LeaderboardAdFallback />}>
      <LazyLeaderboardAd {...props} />
    </Suspense>
  );
}
