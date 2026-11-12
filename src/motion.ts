import type Lenis from "lenis";

/**
 * Shared motion constants for the first-screen sequence.
 *
 * INTRO_DELAY lines the hero entrance up with the exit of InitialPreloader
 * (≈850ms progress + 160ms hold), so the hero choreography starts while the
 * preloader is fading instead of playing underneath it.
 */
export const INTRO_DELAY = 0.95;

/** Expo-out: fast departure, long soft landing — used for reveals. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Symmetric in-out — used for wipes/masks that travel a full distance. */
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

/** Header height used to offset in-page anchor scrolling. */
const NAV_OFFSET = 72;

/**
 * Scroll to a section by id. Uses Lenis when it is active so anchor jumps
 * stay in sync with smooth scrolling; falls back to native scrolling.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -NAV_OFFSET });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

