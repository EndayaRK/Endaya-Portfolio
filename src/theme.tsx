import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import { useReducedMotion } from "framer-motion";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  isTransitioning: boolean;
  toggleTheme: () => void;
};

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (
    updateCallback: () => Promise<void> | void
  ) => ViewTransitionLike;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const WIPE_DURATION_MS = 780;
const WIPE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function computeCircleWipeEndpoints(nextTheme: Theme) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Oversized circle so the boundary sweeps across the viewport as a weighty circular arc
  // and covers all four corners cleanly in both directions.
  const radius = Math.ceil(Math.hypot(w, h) * 1.15);
  const halfH = h / 2;
  const cornerSag =
    radius - Math.sqrt(Math.max(0, radius * radius - halfH * halfH));

  if (nextTheme === "dark") {
    // Dark mode: sweeps from Left -> Right
    // Rightmost leading edge starts at x = 0 and clears top-right/bottom-right corners
    const startCx = -radius;
    const endCx = Math.ceil(w + cornerSag + 4 - radius);
    return { radius, startCx, endCx };
  } else {
    // Light mode: sweeps from Right -> Left
    // Leftmost leading edge starts at x = w and clears top-left/bottom-left corners
    const startCx = w + radius;
    const endCx = Math.floor(radius - cornerSag - 4);
    return { radius, startCx, endCx };
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return getSystemTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const prefersReducedMotion = useReducedMotion();

  const activeVtRef = useRef<ViewTransitionLike | null>(null);
  const activeAnimRef = useRef<Animation | null>(null);
  const transitionIdRef = useRef(0);

  // Sync the root .dark class on initial mount and whenever theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Follow OS color scheme changes only when the visitor hasn't set an explicit preference
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Cleanup any active animation or view transition on unmount
  useEffect(() => {
    return () => {
      if (activeAnimRef.current) {
        activeAnimRef.current.cancel();
        activeAnimRef.current = null;
      }
      if (activeVtRef.current) {
        try {
          activeVtRef.current.skipTransition();
        } catch {
          // Ignore if already finished
        }
        activeVtRef.current = null;
      }
      document.documentElement.classList.remove("theme-circular-wipe");
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;

    // Cancel any in-flight transition cleanly so rapid repeated clicks never glitch
    if (activeAnimRef.current) {
      activeAnimRef.current.cancel();
      activeAnimRef.current = null;
    }
    if (activeVtRef.current) {
      try {
        activeVtRef.current.skipTransition();
      } catch {
        // Ignore if already finished
      }
      activeVtRef.current = null;
    }

    const currentTheme: Theme = root.classList.contains("dark")
      ? "dark"
      : "light";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    // Persist preference immediately
    localStorage.setItem("theme", nextTheme);

    const systemReducedMotion =
      prefersReducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const docWithVT = document as DocumentWithViewTransition;

    if (
      systemReducedMotion ||
      typeof docWithVT.startViewTransition !== "function"
    ) {
      root.classList.remove("theme-circular-wipe");
      root.classList.toggle("dark", nextTheme === "dark");
      setTheme(nextTheme);
      return;
    }

    const currentRunId = ++transitionIdRef.current;
    root.classList.add("theme-circular-wipe");

    try {
      const vt = docWithVT.startViewTransition(() => {
        flushSync(() => {
          root.classList.toggle("dark", nextTheme === "dark");
          setTheme(nextTheme);
        });
      });
      activeVtRef.current = vt;

      vt.ready
        .then(() => {
          if (transitionIdRef.current !== currentRunId) return;
          const { radius, startCx, endCx } =
            computeCircleWipeEndpoints(nextTheme);

          const anim = root.animate(
            [
              { clipPath: `circle(${radius}px at ${startCx}px 50%)` },
              { clipPath: `circle(${radius}px at ${endCx}px 50%)` },
            ],
            {
              duration: WIPE_DURATION_MS,
              easing: WIPE_EASING,
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          );
          activeAnimRef.current = anim;
        })
        .catch(() => {
          if (transitionIdRef.current === currentRunId) {
            activeVtRef.current = null;
            activeAnimRef.current = null;
            root.classList.remove("theme-circular-wipe");
          }
        });

      vt.finished.finally(() => {
        if (transitionIdRef.current === currentRunId) {
          activeVtRef.current = null;
          activeAnimRef.current = null;
          // Remove transition suppression on the next frame after the view-transition overlay unmounts
          window.requestAnimationFrame(() => {
            if (transitionIdRef.current === currentRunId) {
              root.classList.remove("theme-circular-wipe");
            }
          });
        }
      });
    } catch {
      root.classList.remove("theme-circular-wipe");
      root.classList.toggle("dark", nextTheme === "dark");
      setTheme(nextTheme);
    }
  }, [prefersReducedMotion]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isTransitioning: false,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
