"use client";

/**
 * Small helper to prompt the sign-in modal once per browser (or until storage is cleared).
 * This avoids repeatedly popping the modal on every route change while still encouraging
 * unauthenticated visitors to sign in.
 */
export function promptSignInOnce(openModal: (v: boolean) => void) {
  if (typeof window === "undefined") return;
  try {
    const key = "nairamet:seenSignInPrompt";
    const seen = window.localStorage.getItem(key);
    if (!seen) {
      openModal(true);
      // mark as seen to avoid showing it again repeatedly
      window.localStorage.setItem(key, "1");
    }
  } catch (err) {
    // ignore storage errors
    console.warn("promptSignInOnce error", err);
  }
}

export function resetSignInPrompt() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("nairamet:seenSignInPrompt");
  } catch {}
}
