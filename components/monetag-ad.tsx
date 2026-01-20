"use client";

// Note: This file is kept for backward compatibility with existing imports
// The main Monetag ads (Popunder, Push, In-Page Push) are loaded via MonetagScript in layout.tsx

// These components now return null since we're using In-Page Push Banner instead
// In-Page Push Banner is less intrusive and works better for currency sites

export function TopBannerAd() {
  return null;
}

export function SidebarAd() {
  return null;
}

export function InContentAd() {
  return null;
}

export function BottomBannerAd() {
  return null;
}

export function InFeedAd() {
  return null;
}

export function SidebarAdCard() {
  return null;
}
