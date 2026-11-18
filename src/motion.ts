import type Lenis from "lenis";

/**
 * Opening sequence ("The Assembly") scheduling.
 *
 * The mode is decided once at module load so the loader and the hero/nav
 * entrance share one schedule:
 *  - "full":    first visit in this tab session — complete assembly (~2.7s).
 *  - "short":   reload within the same session — condensed assembly (~1.6s).
 *  - "reduced": prefers-reduced-motion — understated fade, prompt reveal.
 */
export type IntroMode = "full" | "short" | "reduced";

const INTRO_SEEN_KEY = "rk-intro-seen";

function detectIntroMode(): IntroMode {
  if (typeof window === "undefined") return "full";
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "reduced";
    }
    if (window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1") return "short";
  } catch {
    /* storage may be unavailable (privacy mode) — fall back to full */
  }
  return "full";
}

export const INTRO_MODE: IntroMode = detectIntroMode();

/** Seconds from mount at which the loader begins opening to reveal the page. */
export const LOADER_REVEAL_AT =
  INTRO_MODE === "full" ? 1.4 : INTRO_MODE === "short" ? 0.8 : 0.12;

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * INTRO_DELAY lines the hero entrance up with the moment the loader's panels
 * begin to open, so the hero choreography plays as the page is revealed
 * instead of underneath the loader.
 */
export const INTRO_DELAY = LOADER_REVEAL_AT + 0.12;

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

