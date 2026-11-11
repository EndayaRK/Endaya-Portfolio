import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function InitialPreloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Dismiss immediately if user prefers reduced motion
    if (shouldReduceMotion) {
      setIsVisible(false);
      return;
    }

    const startTime = performance.now();
    const duration = 850; // ms to reach 100%

    let animationFrameId: number;

    function frame(time: number) {
      const elapsed = time - startTime;
      const current = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(current);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(frame);
      } else {
        // Hold briefly at 100% then initiate aperture fadeout
        setTimeout(() => {
          setIsVisible(false);
        }, 160);
      }
    }

    animationFrameId = requestAnimationFrame(frame);

    // Hard fallback timeout
    const fallback = setTimeout(() => {
      setIsVisible(false);
    }, 1400);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fallback);
    };
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="executive-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.015,
            transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FBF9F5] dark:bg-[#0A0A0C] text-[#1A1A18] dark:text-[#F3F3F5] select-none transition-colors duration-300 pointer-events-none"
          aria-live="polite"
          aria-label="Loading Rhon Kelly Endaya Portfolio"
        >
          {/* Subtle geometric pattern with radial vignette */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.045] bg-[url('/background-pattern.svg')] bg-repeat"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Centered Brand Mark / Logo with subtle breathing halo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5"
            >
              <div className="absolute inset-0 bg-ink/5 rounded-full blur-xl scale-125 pointer-events-none" />
              <img
                src="/RK_logo_original.png"
                alt="Rhon Kelly Endaya"
                className="relative w-14 h-14 sm:w-16 sm:h-16 object-contain brightness-0 dark:brightness-100 transition-all duration-300 drop-shadow-sm"
              />
            </motion.div>

            {/* Typography Header & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5"
            >
              <h1 className="font-display text-sm sm:text-base font-bold tracking-[0.25em] uppercase text-ink">
                Rhon Kelly Endaya
              </h1>
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-muted">
                Portfolio · 2026
              </p>
            </motion.div>

            {/* Hairline Luxury Progress Track */}
            <div className="mt-6 w-36 sm:w-44 h-[1.5px] bg-black/[0.08] dark:bg-white/[0.12] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-ink rounded-full transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
