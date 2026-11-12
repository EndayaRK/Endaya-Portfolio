import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme";

export default function ThemeToggle() {
  const { theme, isTransitioning, toggleTheme } = useTheme();
  const reduce = useReducedMotion() ?? false;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      aria-pressed={theme === "dark"}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/45 ${
        isTransitioning
          ? "border-ink/45 dark:border-white/45 bg-surface-strong text-ink"
          : "border-border text-muted hover:text-ink hover:border-ink/25 dark:hover:border-white/25 hover:bg-surface-strong active:scale-95"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={
            reduce
              ? false
              : {
                  opacity: 0,
                  y: theme === "dark" ? 8 : -8,
                  scale: 0.78,
                  rotate: theme === "dark" ? -28 : 28,
                }
          }
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={
            reduce
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  y: theme === "dark" ? -8 : 8,
                  scale: 0.78,
                  rotate: theme === "dark" ? 28 : -28,
                }
          }
          transition={{
            duration: reduce ? 0 : 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Sun size={15} strokeWidth={1.9} />
          ) : (
            <Moon size={15} strokeWidth={1.9} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
