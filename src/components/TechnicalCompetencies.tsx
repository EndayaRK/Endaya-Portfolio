import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "../motion";

gsap.registerPlugin(ScrollTrigger);

export type TechnicalCompetenciesProps = {
  onHoverGroup?: (projectIds: string[] | null) => void;
};

interface ProcessProjectRef {
  label: string;
  projectId: string;
}

interface ProcessStage {
  number: string;
  title: string;
  description: string;
  contextLabel: string;
  contextDetail: string;
  lesson?: string;
  projects: ProcessProjectRef[];
}

const PROCESS_STAGES: ProcessStage[] = [
  {
    number: "01",
    title: "Understand the Problem",
    description:
      "Start by understanding the people who will use the system, the difficulties they encounter, and the requirements the solution needs to address.",
    contextLabel: "Applied in PalengkeHub",
    contextDetail:
      "Mapped the distinct needs of three user groups in Lipa City Public Market: consumers comparing prices and preordering produce, vendors managing stall products, and administrators organizing market operations.",
    projects: [{ label: "PalengkeHub", projectId: "palengkehub" }],
  },
  {
    number: "02",
    title: "Explore and Plan",
    description:
      "Explore possible approaches, develop prototypes, test ideas, and determine how the system's components should work together.",
    contextLabel: "Iterative Prototyping",
    contextDetail:
      "PalengkeHub went through multiple prototypes and testing cycles—refining how price comparison, stall-location directories, and pickup scheduling connect—before the appropriate system structure became clear.",
    projects: [{ label: "PalengkeHub", projectId: "palengkehub" }],
  },
  {
    number: "03",
    title: "Build and Integrate",
    description:
      "Turn the selected approach into functional application features by connecting interfaces, application logic, and data.",
    contextLabel: "Across Selected Work",
    contextDetail:
      "Connected mobile and desktop interfaces with backend routes and databases across PalengkeHub's marketplace workflows, EventPulse's role-based event registration, and Auto Avenue IMS's parts inventory and procurement ledger.",
    projects: [
      { label: "PalengkeHub", projectId: "palengkehub" },
      { label: "EventPulse", projectId: "event-tracker" },
      { label: "Auto Avenue IMS", projectId: "auto-avenue" },
    ],
  },
  {
    number: "04",
    title: "Test and Improve",
    description:
      "Validate functionality, identify overlooked requirements, and refine the implementation to create a more reliable system.",
    contextLabel: "Implementation Lesson",
    contextDetail:
      "Reviewing end-to-end user flows across roles, edge cases, and data states to catch missing details and refine usability.",
    lesson:
      "Building a good system takes time and effort. Careful testing and attention to detail help ensure that important requirements and functionality are not overlooked.",
    projects: [
      { label: "PalengkeHub", projectId: "palengkehub" },
      { label: "EventPulse", projectId: "event-tracker" },
      { label: "Auto Avenue IMS", projectId: "auto-avenue" },
    ],
  },
];

export default function TechnicalCompetencies({
  onHoverGroup,
}: TechnicalCompetenciesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  // 5-Step GSAP Entrance Choreography (Respects Reduced Motion)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const headingMasks = section.querySelectorAll("[data-how-mask]");
      const firstStageNumber = section.querySelector('[data-how-num="0"]');
      const otherStageNumbers = section.querySelectorAll(
        '[data-how-num]:not([data-how-num="0"])'
      );
      const connectorLine = section.querySelector("[data-how-connector]");
      const mobileConnector = section.querySelector("[data-how-connector-mobile]");
      const stageBodies = section.querySelectorAll("[data-how-stage]");
      const projectRefs = section.querySelectorAll("[data-how-ref]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      // 1. Reveal heading and introduction using a text mask
      if (headingMasks.length > 0) {
        tl.fromTo(
          headingMasks,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.82,
            stagger: 0.08,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          0
        );
      }

      // 2. Introduce the first stage number prominently
      if (firstStageNumber) {
        tl.fromTo(
          firstStageNumber,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          0.18
        );
      }

      // 3. Draw the connecting line progressively across the progression
      if (connectorLine) {
        tl.fromTo(
          connectorLine,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.05,
            ease: "expo.out",
            clearProps: "transform",
          },
          0.26
        );
      }

      if (mobileConnector) {
        tl.fromTo(
          mobileConnector,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.05,
            ease: "expo.out",
            clearProps: "transform",
          },
          0.26
        );
      }

      // 4. Reveal remaining stage numbers and each stage body with staggered movement
      if (otherStageNumbers.length > 0) {
        tl.fromTo(
          otherStageNumbers,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.1,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          0.34
        );
      }

      if (stageBodies.length > 0) {
        tl.fromTo(
          stageBodies,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.78,
            stagger: 0.1,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          0.38
        );
      }

      // 5. Introduce supporting project references
      if (projectRefs.length > 0) {
        tl.fromTo(
          projectRefs,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.68,
            stagger: 0.08,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          0.56
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleStageActivate = (index: number, stage: ProcessStage) => {
    setActiveStageIndex(index);
    onHoverGroup?.(stage.projects.map((p) => p.projectId));
  };

  const handleStageLeave = () => {
    onHoverGroup?.(null);
  };

  const handleProjectNavigate = (projectId: string) => {
    scrollToSection("projects");
    window.dispatchEvent(
      new CustomEvent("select-portfolio-project", { detail: projectId })
    );
    window.dispatchEvent(
      new CustomEvent("select-project", { detail: projectId })
    );
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="how-i-build-heading"
      className="py-24 lg:py-36 border-b border-black/8 dark:border-white/8 bg-transparent transition-colors duration-300"
    >
      <div className="max-w-site mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* ── 1. Section Header (Editorial Monochrome Typography) ── */}
        <div className="max-w-3xl pb-14 lg:pb-20">
          <div className="overflow-hidden mb-3">
            <p
              data-how-mask
              className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted"
            >
              DEVELOPMENT APPROACH
            </p>
          </div>

          <div className="overflow-hidden">
            <h2
              id="how-i-build-heading"
              data-how-mask
              className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold text-ink tracking-[-0.03em] leading-[1.06]"
            >
              How I Build.
            </h2>
          </div>

          <div className="overflow-hidden mt-5">
            <p
              data-how-mask
              className="font-body text-base sm:text-[18px] text-muted max-w-2xl leading-[1.68]"
            >
              Good software takes more than writing code. It starts with
              understanding the problem, exploring solutions, and refining the
              result.
            </p>
          </div>
        </div>

        {/* ── 2. Connected Four-Stage Editorial Progression ── */}
        <div
          className="relative"
          onMouseLeave={handleStageLeave}
        >
          {/* Continuous Horizontal Visual Connector (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:block relative w-full h-[1px] bg-black/12 dark:bg-white/12 overflow-hidden"
          >
            <div
              data-how-connector
              className="w-full h-full bg-ink/40 dark:bg-white/40 origin-left"
            />
            {/* Active Stage Segment Highlight */}
            <div
              className="absolute top-0 bottom-0 w-1/4 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(${activeStageIndex * 100}%)`,
              }}
            />
          </div>

          {/* Continuous Vertical Visual Connector (Mobile) */}
          <div
            data-how-connector-mobile
            aria-hidden="true"
            className="lg:hidden absolute left-0 top-0 bottom-0 w-[1px] bg-black/15 dark:bg-white/15 origin-top"
          />

          {/* Four Editorial Columns (Desktop Horizontal / Mobile Vertical) */}
          <ol className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-black/10 dark:divide-white/10 border-b border-black/10 dark:border-white/10">
            {PROCESS_STAGES.map((stage, idx) => {
              const isActive = activeStageIndex === idx;

              return (
                <li
                  key={stage.number}
                  onMouseEnter={() => handleStageActivate(idx, stage)}
                  onFocus={() => handleStageActivate(idx, stage)}
                  onClick={() => handleStageActivate(idx, stage)}
                  tabIndex={0}
                  className={`group relative pl-6 pr-2 sm:px-6 lg:px-8 py-10 lg:py-12 flex flex-col justify-between transition-colors duration-300 outline-none cursor-default ${
                    isActive
                      ? "bg-black/[0.018] dark:bg-white/[0.02]"
                      : "hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
                  }`}
                >
                  {/* Mobile Active Vertical Rule Indicator */}
                  <span
                    aria-hidden="true"
                    className={`lg:hidden absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-300 ${
                      isActive ? "bg-ink opacity-100" : "opacity-0"
                    }`}
                  />

                  <div className="space-y-8">
                    {/* Oversized Stage Number & Progression Node */}
                    <div
                      data-how-num={idx}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <span
                        className={`font-display text-[clamp(2.5rem,3.8vw,3.75rem)] font-semibold tracking-[-0.04em] leading-none tabular-nums transition-all duration-300 ${
                          isActive
                            ? "text-ink translate-x-0.5"
                            : "text-ink/30 group-hover:text-ink/65"
                        }`}
                      >
                        {stage.number}
                      </span>

                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                        Stage {stage.number} / 04
                      </span>
                    </div>

                    {/* Stage Heading & Core Description */}
                    <div data-how-stage className="space-y-3.5">
                      <h3
                        className={`font-display text-xl sm:text-[22px] tracking-[-0.02em] leading-[1.22] transition-colors duration-300 ${
                          isActive
                            ? "text-ink font-semibold"
                            : "text-ink/85 group-hover:text-ink font-medium"
                        }`}
                      >
                        {stage.title}
                      </h3>

                      <p className="font-body text-sm sm:text-[15px] text-muted leading-[1.72]">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Supporting Project Context & Personal Lesson */}
                  <div
                    data-how-ref
                    className={`mt-10 pt-6 border-t transition-colors duration-300 space-y-4 ${
                      isActive
                        ? "border-black/15 dark:border-white/15"
                        : "border-black/8 dark:border-white/8"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/75 font-semibold">
                        {stage.contextLabel}
                      </p>
                      <p className="font-body text-xs sm:text-[13px] text-muted leading-[1.65]">
                        {stage.contextDetail}
                      </p>
                    </div>

                    {stage.lesson && (
                      <blockquote className="pl-3.5 border-l-2 border-ink/40 dark:border-white/40 py-0.5">
                        <p className="font-body text-xs sm:text-[13px] text-ink/90 leading-[1.65] font-medium">
                          &ldquo;{stage.lesson}&rdquo;
                        </p>
                      </blockquote>
                    )}

                    {/* Direct Links to Corresponding Existing Projects */}
                    <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                      {stage.projects.map((proj) => (
                        <button
                          key={proj.projectId}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProjectNavigate(proj.projectId);
                          }}
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-ink/75 hover:text-ink transition-colors cursor-pointer group/link"
                        >
                          <span className="underline underline-offset-4 decoration-black/20 dark:decoration-white/20 group-hover/link:decoration-ink">
                            {proj.label}
                          </span>
                          <ArrowUpRight
                            size={12}
                            className="opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}


