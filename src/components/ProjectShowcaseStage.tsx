import { useCallback, useEffect, useRef, useState } from "react";
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

// ── Custom Mini-Schematic Graphics for the Editorial Thumbnails ──
function ProjectThumbnailGraphic({
  projectId,
  isActive,
}: {
  projectId: string;
  isActive: boolean;
}) {
  if (projectId === "palengkehub") {
    return (
      <div
        className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl border p-1.5 flex flex-col justify-between shrink-0 transition-all duration-300 ${
          isActive
            ? "border-[#D95B16]/50 bg-[#FBF7EE] dark:bg-[#1E1915] shadow-xs"
            : "border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]"
        }`}
      >
        {/* Phone speaker & live camera dot */}
        <div className="flex items-center justify-between">
          <span className="w-2.5 h-0.5 rounded-full bg-[#D95B16]/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        {/* Price comparison bars */}
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-[#D95B16]" />
          <div className="h-1 w-3/4 rounded bg-black/15 dark:bg-white/25" />
          <div className="h-1 w-1/2 rounded bg-emerald-600/70 dark:bg-emerald-400/70" />
        </div>
        {/* Home bar */}
        <div className="flex justify-center">
          <span className="w-3 h-0.5 rounded-full bg-black/20 dark:bg-white/30" />
        </div>
      </div>
    );
  }

  if (projectId === "event-tracker" || projectId === "eventpulse") {
    return (
      <div
        className={`w-13 h-11 sm:w-14 sm:h-12 rounded-xl border p-1.5 flex flex-col justify-between shrink-0 transition-all duration-300 ${
          isActive
            ? "border-indigo-500/50 bg-white dark:bg-[#161622] shadow-xs"
            : "border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]"
        }`}
      >
        {/* Browser chrome with traffic dots */}
        <div className="flex items-center gap-1 border-b border-black/5 dark:border-white/10 pb-0.5">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          <span className="w-3 h-0.5 rounded bg-indigo-500/30 ml-auto" />
        </div>
        {/* Event calendar tile & pulse bar */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-[7px] font-bold text-indigo-600 dark:text-indigo-400">
              15
            </span>
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="h-1 w-full rounded bg-indigo-600/80 dark:bg-indigo-400/80" />
            <div className="h-1 w-2/3 rounded bg-black/15 dark:bg-white/25" />
          </div>
        </div>
        {/* Live status dot */}
        <div className="flex items-center justify-between">
          <span className="h-0.5 w-1/3 rounded bg-emerald-500" />
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
        </div>
      </div>
    );
  }

  // Auto Avenue IMS (Default / Fallback)
  return (
    <div
      className={`w-13 h-11 sm:w-14 sm:h-12 rounded-xl border p-1.5 flex flex-col justify-between shrink-0 transition-all duration-300 ${
        isActive
          ? "border-emerald-600/50 dark:border-emerald-500/50 bg-white dark:bg-[#121915] shadow-xs"
          : "border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]"
      }`}
    >
      {/* ERP header */}
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-0.5">
        <span className="text-[7px] font-mono font-bold text-[#144A2A] dark:text-emerald-400">
          IMS
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>
      {/* Stock level indicators */}
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <div className="h-1 flex-1 rounded bg-[#144A2A]/80 dark:bg-emerald-500/80" />
          <span className="text-[6px] font-mono text-muted">98%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1 w-3/5 rounded bg-amber-500/80" />
          <span className="text-[6px] font-mono text-muted">LOW</span>
        </div>
      </div>
      {/* PO requisition bar */}
      <div className="h-0.5 w-1/2 rounded bg-[#144A2A]/40 dark:bg-emerald-400/40" />
    </div>
  );
}

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
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  const prevProject = projects[prevIndex];
  const nextProject = projects[nextIndex];

  return (
    <div ref={sectionRef} className="w-full space-y-6">
      {/* ── 1. EDITORIAL PROJECT EXHIBITION RIBBON ── */}
      <div className="relative w-full max-w-5xl mx-auto py-2">
        {/* Floating Previous Chevron (Left Outer Gutter) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Project"
          className="absolute -left-2 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-[#141416]/90 backdrop-blur-md border border-black/10 dark:border-white/15 text-ink shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-110 hover:border-black/20 dark:hover:border-white/30 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>

        {/* Floating Next Chevron (Right Outer Gutter) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Project"
          className="absolute -right-2 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-[#141416]/90 backdrop-blur-md border border-black/10 dark:border-white/15 text-ink shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-110 hover:border-black/20 dark:hover:border-white/30 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>

        {/* 3-Position Carousel Stage (Previous · Active Focal Point · Next) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-5 px-9 sm:px-12 select-none">
          {/* ── Left Flank: Previous Project (Compact Preview) ── */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label={`Switch to previous project: ${prevProject.title}`}
            className="hidden md:flex flex-1 max-w-[240px] lg:max-w-[260px] h-[92px] rounded-2xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-[#141416]/60 backdrop-blur-sm p-3 items-center gap-3 text-left transition-all duration-300 transform scale-[0.88] opacity-40 hover:opacity-75 hover:scale-[0.92] cursor-pointer group shadow-2xs"
          >
            <ProjectThumbnailGraphic
              projectId={prevProject.id}
              isActive={false}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted mb-0.5">
                <span>{prevProject.number}</span>
                <span>·</span>
                <span className="truncate">{prevProject.subtitle}</span>
              </div>
              <h4 className="font-display text-sm font-bold text-ink truncate group-hover:text-ink/80 transition-colors">
                {prevProject.title}
              </h4>
              <p className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                <span>← Previous</span>
              </p>
            </div>
          </button>

          {/* ── Center: Active Project (Focal Point with Illumination & Metadata) ── */}
          <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 h-[106px] rounded-2xl border border-black/15 dark:border-white/20 bg-white/95 dark:bg-[#16161B]/95 backdrop-blur-md p-3.5 sm:p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10 flex items-center gap-3.5">
            {/* Top Accent Color Bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 transition-colors duration-300"
              style={{
                backgroundColor: activeProject.accentColor || "#1E1E24",
              }}
            />

            {/* Thumbnail Graphic */}
            <ProjectThumbnailGraphic
              projectId={activeProject.id}
              isActive={true}
            />

            {/* Project Identity & Category */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-ink">
                    {activeProject.number}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active</span>
                  </span>
                </div>

                <span className="text-[10px] font-medium font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-muted shrink-0">
                  {activeProject.subtitle}
                </span>
              </div>

              <h3 className="font-display text-base sm:text-lg font-bold text-ink truncate leading-tight">
                {activeProject.title}
              </h3>

              <p className="text-[11px] text-muted truncate mt-0.5">
                {activeProject.domain || activeProject.category}
              </p>
            </div>
          </div>

          {/* ── Right Flank: Next Project (Compact Preview) ── */}
          <button
            type="button"
            onClick={handleNext}
            aria-label={`Switch to next project: ${nextProject.title}`}
            className="hidden md:flex flex-1 max-w-[240px] lg:max-w-[260px] h-[92px] rounded-2xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-[#141416]/60 backdrop-blur-sm p-3 items-center gap-3 text-left transition-all duration-300 transform scale-[0.88] opacity-40 hover:opacity-75 hover:scale-[0.92] cursor-pointer group shadow-2xs"
          >
            <ProjectThumbnailGraphic
              projectId={nextProject.id}
              isActive={false}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted mb-0.5">
                <span>{nextProject.number}</span>
                <span>·</span>
                <span className="truncate">{nextProject.subtitle}</span>
              </div>
              <h4 className="font-display text-sm font-bold text-ink truncate group-hover:text-ink/80 transition-colors">
                {nextProject.title}
              </h4>
              <p className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                <span>Next →</span>
              </p>
            </div>
          </button>
        </div>

        {/* ── Exhibition Index Navigation Track ── */}
        <div className="flex items-center justify-between pt-4 px-2 sm:px-4 text-xs text-muted">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="font-bold text-ink">
              {activeProject.number} / {String(total).padStart(2, "0")}
            </span>
            <span className="opacity-40">·</span>
            <span className="truncate hidden sm:inline">
              {activeProject.title} ({activeProject.category})
            </span>
          </div>

          {/* Segmented Dots Indicator (Direct Jump) */}
          <div className="flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-full border border-black/5 dark:border-white/10">
            {projects.map((proj, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleGoToIndex(idx)}
                  aria-label={`Jump to project ${proj.number}: ${proj.title}`}
                  className="relative px-2 py-1 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 text-muted hover:text-ink"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeExhibitionPill"
                      className="absolute inset-0 bg-white dark:bg-[#202026] rounded-full border border-black/10 dark:border-white/15 shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive ? "text-ink font-bold" : "text-muted"
                    }`}
                  >
                    {proj.number}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono opacity-60">
            <span>[ ← / → keys ]</span>
          </div>
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
