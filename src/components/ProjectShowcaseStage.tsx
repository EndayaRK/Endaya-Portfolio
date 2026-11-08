import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ProjectStageItem = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: "Mobile & Capstone" | "Full-Stack" | "Database & Web";
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

  // Auto-switch index if highlightedProjectId changes from skills hover
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

  const handleGoToIndex = (targetIndex: number) => {
    if (targetIndex === currentIndex) return;
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setCurrentIndex(targetIndex);
    onSelectProject?.(projects[targetIndex].id);
  };

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + projects.length) % projects.length;
    setDirection(-1);
    setCurrentIndex(nextIdx);
    onSelectProject?.(projects[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % projects.length;
    setDirection(1);
    setCurrentIndex(nextIdx);
    onSelectProject?.(projects[nextIdx].id);
  };

  // Keyboard navigation (Left / Right arrows)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, projects.length]);

  const activeProject = projects[currentIndex];

  return (
    <div className="w-full space-y-6">
      {/* ── Top Rail Paging Controls ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2.5 sm:p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md shadow-sm">
        {/* Segmented Control Bar (3 Flagship Projects) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-xl">
          {projects.map((proj, idx) => {
            const isActive = idx === currentIndex;

            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => handleGoToIndex(idx)}
                className={`relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-[#1F1F24] text-ink shadow-sm border border-black/5 dark:border-white/10"
                    : "text-muted hover:text-ink hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                }`}
              >
                <span className="font-mono text-[11px] opacity-60">
                  {proj.number}
                </span>
                <span className="font-bold">{proj.title}</span>
                <span className="text-[10px] text-muted hidden sm:inline">
                  ({proj.subtitle})
                </span>

                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeDeckTab"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-ink rounded-full"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── De-boxed Sleek Pill Pagination Controls ── */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 px-1 select-none">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous project in deck"
            className="px-4 py-2 rounded-full text-xs font-medium border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 text-current transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <ChevronLeft size={13} />
            <span>Prev</span>
          </button>

          <span className="text-xs font-mono font-medium text-muted px-2">
            {currentIndex + 1} / {projects.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next project in deck"
            className="px-4 py-2 rounded-full text-xs font-medium border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 text-current transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Animated Project Deck Stage ── */}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={activeProject.id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 35 : -35,
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
              },
              exit: (dir: number) => ({
                x: dir > 0 ? -35 : 35,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: "easeOut" }}
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
