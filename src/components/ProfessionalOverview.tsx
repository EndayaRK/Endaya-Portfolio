import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_OUT_EXPO, scrollToSection } from "../motion";

interface ProjectReference {
  id: string;
  name: string;
  role: string;
}

interface SkillCategoryData {
  id: "frontend" | "backend" | "database" | "workflow";
  index: string;
  title: string;
  description: string;
  primaryTech: string[];
  secondaryTech: string[];
  additionalTech: string[];
  projectContext: string;
  projects: ProjectReference[];
}

const SKILL_CATEGORIES: SkillCategoryData[] = [
  {
    id: "frontend",
    index: "01",
    title: "Frontend Development",
    description:
      "Building responsive web and mobile interfaces with reusable component architecture, strict TypeScript contracts, and predictable client state.",
    primaryTech: ["React", "TypeScript", "JavaScript", "Tailwind CSS"],
    secondaryTech: [
      "Responsive Interfaces",
      "Component-Based Development",
      "HTML5 & CSS3",
    ],
    additionalTech: [
      "React Native",
      "Expo",
      "Vite",
      "TanStack Query",
      "Zustand",
    ],
    projectContext:
      "Applied in PalengkeHub to build the mobile-first Presyo Check price comparison interface and scheduled stall pickup ticket flow, and in EventPulse to structure the role-based campus event dashboard and live registration views.",
    projects: [
      { id: "palengkehub", name: "PalengkeHub", role: "Mobile & Web UI" },
      { id: "event-tracker", name: "EventPulse", role: "Campus Dashboard" },
    ],
  },
  {
    id: "backend",
    index: "02",
    title: "Backend Development",
    description:
      "Developing server-side application logic, structured RESTful APIs, request validation, and role-based authentication for multi-user systems.",
    primaryTech: ["Node.js", "Express.js", "PHP", "REST APIs"],
    secondaryTech: [
      "Server-Side Application Development",
      "JWT Authentication",
      "Zod Validation",
    ],
    additionalTech: ["Python", "FastAPI", "Java", "C++", "Role-Based Routing"],
    projectContext:
      "Used in EventPulse to implement Express.js REST endpoints and JWT role separation across Students, Organizers, and Admins, alongside backend inventory routes, procurement workflows, and server-side coursework in Node.js and PHP.",
    projects: [
      { id: "event-tracker", name: "EventPulse", role: "Express API & JWT" },
      {
        id: "auto-avenue",
        name: "Auto Avenue IMS",
        role: "Inventory & PO Logic",
      },
    ],
  },
  {
    id: "database",
    index: "03",
    title: "Database Management",
    description:
      "Modeling relational schemas and document collections for reliable persistence, indexed queries, and structured data management.",
    primaryTech: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"],
    secondaryTech: [
      "Database Design",
      "Data Management",
      "Relational & Document Schemas",
    ],
    additionalTech: ["MongoDB Atlas", "Mongoose ORM", "SQLite"],
    projectContext:
      "Used in Auto Avenue IMS to design relational SQL tables tracking automotive parts stock levels, reorder thresholds, and purchase orders, and in EventPulse to persist campus event registrations and member directories in MongoDB.",
    projects: [
      {
        id: "auto-avenue",
        name: "Auto Avenue IMS",
        role: "MySQL / PostgreSQL Schema",
      },
      {
        id: "event-tracker",
        name: "EventPulse",
        role: "MongoDB Collections",
      },
      { id: "palengkehub", name: "PalengkeHub", role: "Market Price Records" },
    ],
  },
  {
    id: "workflow",
    index: "04",
    title: "Tools & Workflow",
    description:
      "Managing version control, collaborative repositories, API verification, and production deployments across the development lifecycle.",
    primaryTech: ["Git", "GitHub", "VS Code", "Vercel"],
    secondaryTech: [
      "Version Control",
      "Development Workflow",
      "Deployment Tools",
    ],
    additionalTech: ["Postman", "Linux", "Preview & Production Builds"],
    projectContext:
      "Supports every project from local development in VS Code and collaborative Git/GitHub branching to REST endpoint verification in Postman and automated production deployments on Vercel.",
    projects: [
      { id: "palengkehub", name: "PalengkeHub", role: "Git & Vercel" },
      { id: "event-tracker", name: "EventPulse", role: "CI/CD & Hosting" },
      {
        id: "auto-avenue",
        name: "Auto Avenue IMS",
        role: "Repo & API Verification",
      },
    ],
  },
];

export default function ProfessionalOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelInnerRef = useRef<HTMLSpanElement>(null);
  const headingInnerRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardEntranceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // Close expanded category when pressing Escape
  useEffect(() => {
    if (!expandedId) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExpandedId(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedId]);

  // ── 5-Step Kinetic Editorial Entrance Choreography (GSAP + ScrollTrigger) ──
  // 1. Section heading reveals through a clipping animation.
  // 2. The four cards enter from coordinated directions into the aligned 2×2 grid.
  // 3. Large editorial numbers appear with staggered masked movement & rule draw.
  // 4. Card titles, descriptions, and technology typography reveal in sequence.
  // 5. All inline transforms are cleared after settling so hover/expand never conflict.
  useEffect(() => {
    const prefersReduced =
      reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !sectionRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const dist = isMobile ? 0.4 : 1;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 76%",
          once: true,
        },
      });

      // Step 1: Section label & main heading clip-mask reveal + description
      if (labelInnerRef.current) {
        tl.fromTo(
          labelInnerRef.current,
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 0.75,
            ease: "expo.out",
            clearProps: "transform",
          },
          0
        );
      }

      if (headingInnerRef.current) {
        tl.fromTo(
          headingInnerRef.current,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 0.95,
            ease: "expo.out",
            clearProps: "transform",
          },
          0.06
        );
      }

      if (descriptionRef.current) {
        tl.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          0.18
        );
      }

      // Step 2: Four cards enter from coordinated directions into the 2×2 grid
      // 01 (Top-Left): from left & slightly up
      // 02 (Top-Right): from right & slightly up
      // 03 (Bottom-Left): from left & below
      // 04 (Bottom-Right): from right & below
      //
      // Horizontal travel is clamped to the real side gutter between the grid and the
      // section edge, so entering cards never cross the section boundary and get cut off.
      // Top-row cards enter from above (not below) so they never pass through the
      // grid gap into the bottom row during the stagger.
      const sectionWidth = sectionRef.current?.clientWidth ?? window.innerWidth;
      const gridWidth = gridRef.current?.clientWidth ?? sectionWidth;
      const gutter = Math.max(0, (sectionWidth - gridWidth) / 2 - 8);
      const maxX = Math.min(52 * dist, gutter);
      const cardVectors = [
        { x: -maxX, y: -18 * dist },
        { x: maxX, y: -18 * dist },
        { x: -maxX * 0.8, y: 54 * dist },
        { x: maxX * 0.8, y: 54 * dist },
      ];

      cardEntranceRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const v = cardVectors[idx] ?? cardVectors[0];
        const startAt = 0.2 + idx * 0.09;

        tl.fromTo(
          cardEl,
          {
            opacity: 0,
            x: v.x,
            y: v.y,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.95,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          startAt
        );

        // Step 3: Large editorial number masked reveal & horizontal hairline draw
        const numEl = cardEl.querySelector("[data-card-number]");
        const lineEl = cardEl.querySelector("[data-card-line]");
        const titleEl = cardEl.querySelector("[data-card-title]");
        const descEl = cardEl.querySelector("[data-card-desc]");
        const techItems = cardEl.querySelectorAll("[data-card-tech]");

        if (numEl) {
          tl.fromTo(
            numEl,
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: 0.85,
              ease: "expo.out",
              clearProps: "transform",
            },
            startAt + 0.08
          );
        }

        if (lineEl) {
          tl.fromTo(
            lineEl,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.85,
              ease: "expo.out",
              clearProps: "transform",
            },
            startAt + 0.14
          );
        }

        // Step 4: Typography sequence inside each card (Title → Description → Tech list)
        if (titleEl) {
          tl.fromTo(
            titleEl,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.8,
              ease: "expo.out",
              clearProps: "transform",
            },
            startAt + 0.16
          );
        }

        if (descEl) {
          tl.fromTo(
            descEl,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              clearProps: "transform,opacity",
            },
            startAt + 0.24
          );
        }

        if (techItems.length > 0) {
          tl.fromTo(
            techItems,
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.035,
              ease: "power3.out",
              clearProps: "transform,opacity",
            },
            startAt + 0.3
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  const toggleCategory = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCardKeyDown = (
    e: ReactKeyboardEvent<HTMLElement>,
    id: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      if ((e.target as HTMLElement).tagName === "BUTTON") return;
      e.preventDefault();
      toggleCategory(id);
    }
  };

  // Restrained monochrome pointer light-sweep coordinates on desktop
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reduceMotion || window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${mx.toFixed(1)}%`);
    e.currentTarget.style.setProperty("--my", `${my.toFixed(1)}%`);
  };

  const handleJumpToProject = (
    e: MouseEvent<HTMLButtonElement>,
    projectId: string
  ) => {
    e.stopPropagation();
    scrollToSection("projects");
    window.dispatchEvent(
      new CustomEvent("select-portfolio-project", { detail: projectId })
    );
  };

  return (
    <section
      id="overview"
      ref={sectionRef}
      aria-labelledby="what-i-work-with-heading"
      className="relative py-20 sm:py-24 lg:py-32 border-b border-black/[0.06] dark:border-white/[0.06] bg-transparent transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10">
        {/* ───────────────────── Cohesive Sans-Serif Section Header ───────────────────── */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-14 sm:mb-16 lg:mb-20">
          <div className="lg:col-span-7">
            <p className="overflow-hidden mb-3.5">
              <span
                ref={labelInnerRef}
                className="block font-mono text-[11px] sm:text-xs font-medium uppercase tracking-[0.24em] text-muted"
              >
                SKILLS &amp; TECHNOLOGIES
              </span>
            </p>

            <h2
              id="what-i-work-with-heading"
              className="text-ink select-none"
            >
              <span className="sr-only">What I Work With</span>
              <span
                aria-hidden="true"
                className="block overflow-hidden font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-ink leading-[1.04] pb-[0.14em] -mb-[0.14em]"
              >
                <span ref={headingInnerRef} className="block">
                  What I Work With
                </span>
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pb-1">
            <p
              ref={descriptionRef}
              className="font-body text-sm sm:text-base text-muted leading-relaxed"
            >
              The technologies and tools I use to develop functional, responsive
              applications.
            </p>
          </div>
        </div>

        {/* ───────────────────── Balanced 2×2 Editorial Grid ───────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 items-stretch"
        >
          {SKILL_CATEGORIES.map((category, idx) => {
            const isExpanded = expandedId === category.id;
            const isDimmed = expandedId !== null && !isExpanded;

            return (
              <div
                key={category.id}
                ref={(el) => {
                  cardEntranceRefs.current[idx] = el;
                }}
                className="h-full"
              >
                <article
                  role="region"
                  aria-labelledby={`skill-card-title-${category.id}`}
                  tabIndex={0}
                  onClick={() => toggleCategory(category.id)}
                  onKeyDown={(e) => handleCardKeyDown(e, category.id)}
                  onMouseMove={handleMouseMove}
                  style={
                    {
                      "--mx": "50%",
                      "--my": "50%",
                    } as CSSProperties
                  }
                  className={`group relative h-full min-h-[360px] sm:min-h-[390px] flex flex-col justify-between rounded-2xl p-7 sm:p-9 lg:p-10 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-ink/50 transition-[background-color,border-color,box-shadow,transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isExpanded
                      ? "bg-[#FFFFFF] dark:bg-[#16161B] border border-black/25 dark:border-white/25 shadow-[0_26px_70px_-20px_rgba(0,0,0,0.16)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] lg:-translate-y-1"
                      : "bg-[#F5F2EB]/90 dark:bg-[#111115]/95 hover:bg-[#FFFFFF] dark:hover:bg-[#15151A] border border-black/[0.07] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 shadow-[0_10px_32px_-18px_rgba(0,0,0,0.05)] dark:shadow-[0_18px_42px_-22px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_54px_-18px_rgba(0,0,0,0.11)] dark:hover:shadow-[0_26px_64px_-18px_rgba(0,0,0,0.7)] lg:hover:-translate-y-1.5"
                  } ${isDimmed ? "opacity-50" : "opacity-100"}`}
                >
                  {/* Restrained monochrome radial surface sweep on hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(560px circle at var(--mx) var(--my), rgb(var(--c-text) / 0.035), transparent 65%)",
                    }}
                  />

                  {/* Top monochrome hairline sweep */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-9 top-0 h-[1.5px] origin-left bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isExpanded
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />

                  {/* ── Top Zone: Large Editorial Number, Kinetic Rule & Expand Control ── */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-5">
                      {/* Mask keeps the reveal clip; hover scale lives on the mask itself
                          (with glyph-safe padding) so the scaled number is never cut off. */}
                      <span
                        className={`overflow-hidden block py-[0.06em] -my-[0.06em] pr-1 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isExpanded
                            ? "scale-[1.04] translate-x-0.5"
                            : "group-hover:scale-[1.04] group-hover:translate-x-0.5"
                        }`}
                      >
                        <span
                          data-card-number
                          className={`block font-display text-5xl sm:text-6xl font-light tracking-tightest leading-none transition-colors duration-500 ${
                            isExpanded
                              ? "text-ink"
                              : "text-ink/25 dark:text-white/20 group-hover:text-ink dark:group-hover:text-white"
                          }`}
                        >
                          {category.index}
                        </span>
                      </span>

                      {/* Architectural connecting line */}
                      <div
                        aria-hidden="true"
                        className="flex-1 h-px bg-black/[0.07] dark:bg-white/[0.07] overflow-hidden"
                      >
                        <div
                          data-card-line
                          className={`h-full w-full origin-left bg-ink/35 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isExpanded
                              ? "scale-x-100 bg-ink/70"
                              : "scale-x-50 group-hover:scale-x-100 group-hover:bg-ink/60"
                          }`}
                        />
                      </div>

                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`skill-card-panel-${category.id}`}
                        aria-label={
                          isExpanded
                            ? `Collapse ${category.title}`
                            : `Expand ${category.title}`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category.id);
                        }}
                        className={`shrink-0 h-9 w-9 rounded-full grid place-items-center border transition-all duration-300 ${
                          isExpanded
                            ? "bg-ink text-cta-primary-text border-ink"
                            : "border-black/10 dark:border-white/15 text-muted group-hover:text-ink group-hover:border-black/30 dark:group-hover:border-white/30"
                        }`}
                      >
                        {isExpanded ? (
                          <X size={15} strokeWidth={2} />
                        ) : (
                          <Plus
                            size={16}
                            strokeWidth={1.9}
                            className="transition-transform duration-300 group-hover:rotate-90"
                          />
                        )}
                      </button>
                    </div>

                    {/* ── Category Title & Supporting Description ── */}
                    <div className="mt-7 sm:mt-8">
                      <h3
                        id={`skill-card-title-${category.id}`}
                        className="overflow-hidden pb-[0.1em] -mb-[0.1em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                      >
                        <span
                          data-card-title
                          className="block font-display text-2xl sm:text-[1.75rem] lg:text-[1.95rem] font-bold tracking-tight text-ink leading-[1.14]"
                        >
                          {category.title}
                        </span>
                      </h3>

                      <p
                        data-card-desc
                        className="mt-3.5 font-body text-sm sm:text-[15px] text-muted leading-relaxed"
                      >
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* ── Bottom Zone: Typographic Technology Hierarchy & Expandable Drawer ── */}
                  <div className="relative z-10 mt-9 pt-6 border-t border-black/[0.07] dark:border-white/[0.08]">
                    {/* Primary Technologies — Set as expressive editorial typography */}
                    <div
                      aria-label={`${category.title} primary technologies`}
                      className="flex flex-wrap items-center gap-y-2"
                    >
                      {category.primaryTech.map((tech, i) => (
                        <span
                          key={tech}
                          data-card-tech
                          className="inline-flex items-center"
                        >
                          <span
                            className={`font-display text-base sm:text-[18px] lg:text-[19px] font-semibold tracking-tight transition-colors duration-300 ${
                              isExpanded
                                ? "text-ink"
                                : "text-ink/80 group-hover:text-ink"
                            }`}
                          >
                            {tech}
                          </span>
                          {i < category.primaryTech.length - 1 && (
                            <span
                              aria-hidden="true"
                              className="mx-3 sm:mx-3.5 h-3.5 w-px bg-black/15 dark:bg-white/15 transition-colors duration-300 group-hover:bg-black/30 dark:group-hover:bg-white/30"
                            />
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Supporting Capabilities — Refined secondary typographic line */}
                    <p
                      data-card-tech
                      className="mt-3 font-body text-xs sm:text-[13px] text-muted transition-colors duration-300 group-hover:text-ink/75"
                    >
                      {category.secondaryTech.join("  ·  ")}
                    </p>

                    {/* Smooth Expandable Details */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={`skill-card-panel-${category.id}`}
                          key="expanded-details"
                          initial={
                            reduceMotion
                              ? { opacity: 1 }
                              : { height: 0, opacity: 0 }
                          }
                          animate={{ height: "auto", opacity: 1 }}
                          exit={
                            reduceMotion
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{
                            duration: reduceMotion ? 0 : 0.42,
                            ease: EASE_OUT_EXPO,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 space-y-5">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                                Project Application
                              </p>
                              <p className="font-body text-xs sm:text-sm text-ink/90 leading-relaxed">
                                {category.projectContext}
                              </p>
                            </div>

                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1.5">
                                Additional Technologies
                              </p>
                              <p className="font-display text-xs sm:text-sm font-medium text-ink leading-relaxed">
                                {category.additionalTech.join("  ·  ")}
                              </p>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.05] dark:border-white/[0.06]">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mr-1">
                                  Referenced Work:
                                </span>
                                {category.projects.map((proj) => (
                                  <button
                                    key={proj.id}
                                    type="button"
                                    onClick={(e) =>
                                      handleJumpToProject(e, proj.id)
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-ink text-cta-primary-text hover:opacity-85 transition-opacity"
                                  >
                                    <span>{proj.name}</span>
                                    <span className="opacity-65 font-normal hidden sm:inline">
                                      · {proj.role}
                                    </span>
                                    <ArrowUpRight size={12} />
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(null);
                                }}
                                className="text-xs font-medium text-muted hover:text-ink underline underline-offset-4"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Collapsed Footer Row */}
                    {!isExpanded && (
                      <div className="mt-5 pt-3.5 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between text-xs text-muted group-hover:text-ink transition-colors duration-300">
                        <span>
                          Used in{" "}
                          {category.projects.map((p) => p.name).join(" & ")}
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium">
                          <span>Details</span>
                          <ArrowUpRight
                            size={13}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
