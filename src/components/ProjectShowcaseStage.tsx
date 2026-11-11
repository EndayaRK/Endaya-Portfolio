import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ProjectStageItem = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: "Mobile & Capstone" | "Full-Stack" | "Database & Web";
  domain?: string;
  tagline?: string;
  accentColor?: string;
  badge?: string;
  stack: string[];
  render: (isHighlighted: boolean) => React.ReactNode;
};

type ProjectShowcaseStageProps = {
  projects: ProjectStageItem[];
  highlightedProjectId?: string | null;
  activeCategory?: string;
  onSelectProject?: (id: string) => void;
};

export default function ProjectShowcaseStage({
  projects,
  highlightedProjectId,
  activeCategory = "All",
  onSelectProject,
}: ProjectShowcaseStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Monitor visibility of the selected work section for scoped keyboard navigation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-switch index if highlightedProjectId changes from skills hover / navbar search
  useEffect(() => {
    if (!highlightedProjectId) return;
    const matchIndex = projects.findIndex(
      (p) =>
        p.id === highlightedProjectId ||
        (highlightedProjectId === "eventpulse" && p.id === "event-tracker")
    );
    if (matchIndex !== -1 && matchIndex !== currentIndex) {
      setDirection(matchIndex > currentIndex ? 1 : -1);
      setCurrentIndex(matchIndex);
    }
  }, [highlightedProjectId, projects, currentIndex]);

  // If activeCategory changes and current project is not in category, switch to the first matching project
  useEffect(() => {
    if (activeCategory === "All") return;
    const matchIndex = projects.findIndex((p) => p.category === activeCategory);
    if (matchIndex !== -1 && matchIndex !== currentIndex) {
      setDirection(matchIndex > currentIndex ? 1 : -1);
      setCurrentIndex(matchIndex);
    }
  }, [activeCategory, projects, currentIndex]);

  const handleGoToIndex = useCallback(
    (targetIndex: number) => {
      if (targetIndex === currentIndex) return;
      setDirection(targetIndex > currentIndex ? 1 : -1);
      setCurrentIndex(targetIndex);
      onSelectProject?.(projects[targetIndex].id);
    },
    [currentIndex, projects, onSelectProject]
  );

  // Listen for direct custom project select events (by index 0-2 or project id)
  useEffect(() => {
    function handleCustomSelect(e: Event) {
      const ce = e as CustomEvent<number | string>;
      if (ce.detail !== undefined && ce.detail !== null) {
        let targetIndex = -1;
        if (typeof ce.detail === "number") {
          targetIndex = ce.detail;
        } else if (typeof ce.detail === "string") {
          targetIndex = projects.findIndex(
            (p) =>
              p.id === ce.detail ||
              (ce.detail === "eventpulse" && p.id === "event-tracker")
          );
        }
        if (targetIndex >= 0 && targetIndex < projects.length) {
          handleGoToIndex(targetIndex);
        }
      }
    }
    window.addEventListener("select-project", handleCustomSelect);
    return () => window.removeEventListener("select-project", handleCustomSelect);
  }, [projects, handleGoToIndex]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + projects.length) % projects.length;
    setDirection(-1);
    setCurrentIndex(prevIdx);
    onSelectProject?.(projects[prevIdx].id);
  }, [currentIndex, projects, onSelectProject]);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % projects.length;
    setDirection(1);
    setCurrentIndex(nextIdx);
    onSelectProject?.(projects[nextIdx].id);
  }, [currentIndex, projects, onSelectProject]);

  // Scoped Keyboard Navigation (ArrowLeft / ArrowRight only when section is active in view)
  useEffect(() => {
    if (!isInView) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInView, handlePrev, handleNext]);

  const total = projects.length;
  const activeProject = projects[currentIndex];

  return (
    <div ref={sectionRef} className="w-full space-y-6">
      {/* ── 1. UNBOXED EDITORIAL PROJECT STRIP & ROCK-SOLID CONTROLS ── */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10 select-none">
        {/* Simple text links spaced naturally: 01 PalengkeHub · 02 EventPulse · 03 Auto Avenue */}
        <nav
          aria-label="Editorial project exhibition"
          className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2"
        >
          {projects.map((proj, idx) => {
            const isActive = idx === currentIndex;
            return (
              <React.Fragment key={proj.id}>
                {idx > 0 && (
                  <span
                    className="text-black/20 dark:text-white/20 select-none hidden sm:inline"
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleGoToIndex(idx)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group inline-flex items-center gap-2 text-sm sm:text-base transition-opacity duration-200 cursor-pointer ${
                    isActive
                      ? "opacity-100 text-ink font-semibold"
                      : "opacity-40 hover:opacity-80 text-ink font-normal"
                  }`}
                >
                  <span className="font-mono text-xs text-muted">
                    {proj.number}
                  </span>
                  <span className="tracking-tight">{proj.title}</span>
                  {isActive && (
                    <motion.span
                      layoutId="editorialActiveDot"
                      className="w-1.5 h-1.5 rounded-full bg-ink"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                      }}
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Rock-solid Stepper Controls (Zero Layout Shift) */}
        <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
          {/* Chevron Left */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Project"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>

          {/* Fixed Index Counter */}
          <div className="w-14 text-center font-mono tabular-nums text-xs tracking-widest select-none text-ink font-medium">
            {currentIndex + 1} / {total}
          </div>

          {/* Chevron Right */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Project"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Project Subtitle / Domain context (unboxed, clean typography) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
            {activeProject.category}
          </span>
          <span className="opacity-30">·</span>
          <span>{activeProject.domain || activeProject.tagline}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] opacity-60">
          <span>Keyboard: [ ← / → ]</span>
        </div>
      </div>

      {/* ── 2. ANCHORED LIVE INTERACTIVE SIMULATOR (100% PRESERVED) ── */}
      <div className="relative w-full overflow-hidden pt-2">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={activeProject.id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 30 : -30,
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
              },
              exit: (dir: number) => ({
                x: dir > 0 ? -30 : 30,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {activeProject.render(
              highlightedProjectId === activeProject.id ||
                (highlightedProjectId === "eventpulse" &&
                  activeProject.id === "event-tracker")
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
