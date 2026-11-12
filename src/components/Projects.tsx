import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectShowcaseStage from "./ProjectShowcaseStage";
import type { ProjectStageItem } from "./ProjectShowcaseStage";
import PalengkeHubSimulator from "./PalengkeHubSimulator";
import EventPulseSimulator from "./EventPulseSimulator";
import AutoAvenueSimulator from "./AutoAvenueSimulator";

gsap.registerPlugin(ScrollTrigger);

type ProjectsProps = {
  highlightedProjectId?: string | null;
};

export default function Projects({ highlightedProjectId }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const sectionRef = useRef<HTMLElement>(null);

  const categories = ["All", "Mobile & Capstone", "Full-Stack", "Database & Web"];

  // Define the 3 interactive flagship projects for the editorial stage
  const stageProjects: ProjectStageItem[] = useMemo(
    () => [
      {
        id: "palengkehub",
        number: "01",
        title: "PalengkeHub",
        subtitle: "Mobile Marketplace",
        category: "Mobile & Capstone",
        domain: "Digital Marketplace & Price-Comparison Platform",
        tagline: "Lipa City Public Market",
        stack: [
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Node.js",
          "Express.js",
          "REST API",
        ],
        render: (isHighlighted) => (
          <PalengkeHubSimulator isHighlighted={isHighlighted} />
        ),
      },
      {
        id: "event-tracker",
        number: "02",
        title: "EventPulse",
        subtitle: "Campus Web Platform",
        category: "Full-Stack",
        domain: "Campus Event Management & Registration System",
        tagline: "Full-Stack Web Application",
        stack: [
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Node.js",
          "Express.js",
          "MongoDB",
          "JWT Authentication",
          "Vercel",
        ],
        render: (isHighlighted) => (
          <EventPulseSimulator isHighlighted={isHighlighted} />
        ),
      },
      {
        id: "auto-avenue",
        number: "03",
        title: "Auto Avenue IMS",
        subtitle: "Inventory & Procurement",
        category: "Database & Web",
        domain: "Automotive Parts Inventory & Procurement System",
        tagline: "Backend & Relational Database System",
        stack: [
          "React",
          "TypeScript",
          "Node.js",
          "Express.js",
          "MySQL / PostgreSQL",
          "Tailwind CSS",
        ],
        render: (isHighlighted) => (
          <AutoAvenueSimulator isHighlighted={isHighlighted} />
        ),
      },
    ],
    []
  );

  // Cinematic 4-Step GSAP Section Entrance Choreography
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const headingMasks = section.querySelectorAll("[data-selected-work-mask]");
      const indexBar = section.querySelector("[data-selected-work-index]");
      const previewStage = section.querySelector("[data-project-preview]");
      const copyBlocks = section.querySelectorAll("[data-project-copy]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      // 1. Reveal Selected Work heading & intro through text-mask animation
      if (headingMasks.length > 0) {
        tl.fromTo(
          headingMasks,
          { yPercent: 108, opacity: 0 },
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

      // 2. Introduce the editorial project navigation index
      if (indexBar) {
        tl.fromTo(
          indexBar,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          0.16
        );
      }

      // 3. Reveal the active project's preview container with refined scale/clip entrance
      if (previewStage) {
        tl.fromTo(
          previewStage,
          {
            clipPath: "inset(6% 0% 6% 0% round 16px)",
            scale: 0.975,
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            scale: 1,
            opacity: 1,
            duration: 0.92,
            ease: "expo.out",
            clearProps: "clipPath,transform,opacity",
          },
          0.26
        );
      }

      // 4. Bring project title, description, and contribution details into view in sequence
      if (copyBlocks.length > 0) {
        tl.fromTo(
          copyBlocks,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.78,
            stagger: 0.09,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          0.34
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 lg:py-36 border-b border-black/8 dark:border-white/8 bg-band-secondary/60 transition-colors duration-300"
    >
      <div className="max-w-site mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* ── Editorial Section Introduction ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 lg:pb-12">
          <div className="max-w-2xl">
            <div className="overflow-hidden mb-3">
              <p
                data-selected-work-mask
                className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted"
              >
                SELECTED WORK
              </p>
            </div>

            <div className="overflow-hidden">
              <h2
                data-selected-work-mask
                className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold text-ink tracking-[-0.03em] leading-[1.06]"
              >
                Selected Work
              </h2>
            </div>

            <div className="overflow-hidden mt-4">
              <p
                data-selected-work-mask
                className="font-body text-base sm:text-[17px] text-muted max-w-xl leading-[1.65]"
              >
                A selection of applications and systems I&apos;ve developed.
              </p>
            </div>
          </div>

          {/* Subtle Editorial Domain Filter */}
          <div
            data-selected-work-mask
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start lg:self-end"
            role="group"
            aria-label="Filter projects by domain"
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`font-mono text-[11px] uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-ink bg-ink text-cta-primary-text font-medium"
                      : "border-black/10 dark:border-white/10 bg-transparent text-muted hover:text-ink hover:border-black/25 dark:hover:border-white/25"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Editorial Project Index & Case-Study Stage ── */}
        <ProjectShowcaseStage
          projects={stageProjects}
          highlightedProjectId={highlightedProjectId}
          activeCategory={activeCategory}
        />
      </div>
    </section>
  );
}

export { Projects as SelectedWork };
