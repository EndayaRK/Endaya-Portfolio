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
    <div ref={sectionRef} className="w-full">
      {/* ── 1. EDITORIAL PROJECT INDEX BAR ── */}
      <div
        data-selected-work-index
        className="w-full border-y border-black/10 dark:border-white/10 select-none"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch justify-between">
          {/* Numbered Project Chapters */}
          <nav
            aria-label="Selected work project index"
            className="grid grid-cols-1 sm:grid-cols-3 flex-1 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10"
          >
            {projects.map((proj, idx) => {
              const isActive = idx === currentIndex;
              const isDimmedByFilter =
                activeCategory !== "All" && proj.category !== activeCategory;

              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleGoToIndex(idx)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative text-left px-4 sm:px-6 py-5 transition-colors duration-300 cursor-pointer focus-visible:outline-none ${
                    isActive
                      ? "bg-black/[0.025] dark:bg-white/[0.03]"
                      : "hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
                  } ${isDimmedByFilter && !isActive ? "opacity-40" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span
                      className={`font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                        isActive
                          ? "text-ink font-semibold"
                          : "text-muted group-hover:text-ink/80"
                      }`}
                    >
                      {proj.number}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/75 truncate">
                      {proj.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-display text-lg sm:text-xl tracking-[-0.02em] transition-colors duration-300 ${
                        isActive
                          ? "text-ink font-semibold"
                          : "text-ink/55 group-hover:text-ink/90 font-medium"
                      }`}
                    >
                      {proj.title}
                    </span>
                  </div>

                  {/* Animated Active Editorial Rule */}
                  {isActive && (
                    <motion.div
                      layoutId="selectedWorkActiveRule"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Chapter Counter & Stepper Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-4 px-4 sm:px-6 py-3.5 lg:py-0 border-t lg:border-t-0 lg:border-l border-black/10 dark:border-white/10 shrink-0">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hidden xl:inline">
              Case Study
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Project"
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
              >
                <ChevronLeft size={15} strokeWidth={1.75} />
              </button>

              <div className="w-16 text-center font-mono tabular-nums text-xs tracking-[0.2em] select-none text-ink font-medium">
                0{currentIndex + 1} / 0{total}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Project"
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
              >
                <ChevronRight size={15} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. EDITORIAL CASE STUDY & INTERACTIVE SIMULATOR STAGE ── */}
      <div className="relative w-full pt-12 lg:pt-16">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={activeProject.id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                y: 16,
                x: dir > 0 ? 18 : -18,
                opacity: 0,
              }),
              center: {
                y: 0,
                x: 0,
                opacity: 1,
              },
              exit: (dir: number) => ({
                y: -10,
                x: dir > 0 ? -18 : 18,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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
