import type { MouseEvent } from "react";
import {
  ArrowUpRight,
  Award,
  GraduationCap,
  Layers,
  MapPin,
  Users,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { education, leadership } from "../data";

// ── Refined Editorial Easing Curves ──
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  // Smooth jump to Selected Work with target project simulator activation
  const handleJumpToSimulator = (
    e: MouseEvent<HTMLAnchorElement>,
    projectId: string,
    projectIndex: number
  ) => {
    e.preventDefault();
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    // Synchronize both project selection event patterns without page remount
    window.dispatchEvent(
      new CustomEvent("select-portfolio-project", { detail: projectId })
    );
    window.dispatchEvent(
      new CustomEvent("select-project", { detail: projectIndex })
    );
  };

  // ── Animation Variants ──
  const fadeUpVariant: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: EASE_OUT_QUART,
      },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const workflowStepVariant: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 10,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: EASE_OUT_QUART,
      },
    },
  };

  const chipStaggerContainer: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const chipItemVariant: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: EASE_OUT_QUART,
      },
    },
  };

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 border-b border-black/5 dark:border-white/5 bg-band-secondary/70 transition-colors duration-300 overflow-hidden"
    >
      {/* ── Background Subtle Pattern ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04] bg-[url('/background-pattern.svg')] bg-repeat"
        aria-hidden="true"
      />

      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10 space-y-24 sm:space-y-32">
        {/* ── Section Master Masthead ── */}
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUpVariant}
          className="max-w-3xl pb-8 border-b border-black/5 dark:border-white/5"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-ink" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted">
              Developer Journey &amp; Engineering Philosophy
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-[1.12]">
            Background, Architecture &amp; Horizons
          </h2>

          <p className="text-sm sm:text-base text-muted mt-3.5 leading-relaxed max-w-2xl">
            An editorial perspective on foundational software principles, data flow architectures,
            shipped production systems, and ongoing academic milestones at De La Salle Lipa.
          </p>

          {/* Editorial Chapter Indicator Nav */}
          <nav
            aria-label="Developer Journey Chapters"
            className="flex flex-wrap items-center gap-2 pt-6"
          >
            <span className="text-xs font-mono text-muted mr-1">Index:</span>
            {[
              { label: "01 Focus", href: "#chapter-focus" },
              { label: "02 Architecture", href: "#chapter-architecture" },
              { label: "03 Experience", href: "#chapter-experience" },
              { label: "04 Horizons", href: "#chapter-horizons" },
            ].map((chip) => (
              <a
                key={chip.label}
                href={chip.href}
                className="text-xs font-mono font-medium px-3 py-1 rounded-full border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#141416]/80 text-muted hover:text-ink hover:border-black/20 dark:hover:border-white/20 hover:scale-105 active:scale-95 transition-all shadow-2xs"
              >
                {chip.label}
              </a>
            ))}
          </nav>
        </motion.header>

        {/* ════════════════════════════════════════════════════════════════
            CHAPTER 01 — DEVELOPMENT FOCUS (Editorial Typography Focus)
           ════════════════════════════════════════════════════════════════ */}
        <article
          id="chapter-focus"
          className="space-y-8 scroll-mt-28"
          aria-labelledby="heading-chapter-01"
        >
          {/* Chapter Metadata Marker */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE_OUT_QUART }}
            className="flex items-center gap-3"
          >
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/5 dark:bg-white/10 text-ink border border-black/5 dark:border-white/10">
              01 / 04
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Chapter One · Development Focus
            </span>
          </motion.div>

          {/* Oversized Editorial Headline with Masked Reveal */}
          <div className="max-w-4xl">
            <h3
              id="heading-chapter-01"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.18]"
            >
              <span className="block overflow-hidden pb-1.5">
                <motion.span
                  className="inline-block"
                  initial={{
                    y: shouldReduceMotion ? 0 : "105%",
                    opacity: shouldReduceMotion ? 1 : 0,
                  }}
                  whileInView={{ y: "0%", opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.65,
                    ease: EASE_OUT_EXPO,
                    delay: shouldReduceMotion ? 0 : 0.05,
                  }}
                >
                  Building from{" "}
                  <span className="text-muted underline decoration-black/15 dark:decoration-white/20 decoration-2 underline-offset-6">
                    interface
                  </span>
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1.5">
                <motion.span
                  className="inline-block"
                  initial={{
                    y: shouldReduceMotion ? 0 : "105%",
                    opacity: shouldReduceMotion ? 1 : 0,
                  }}
                  whileInView={{ y: "0%", opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.65,
                    ease: EASE_OUT_EXPO,
                    delay: shouldReduceMotion ? 0 : 0.15,
                  }}
                >
                  to infrastructure.
                </motion.span>
              </span>
            </h3>
          </div>

          {/* Asymmetric Composition */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Primary Narrative */}
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                ease: EASE_OUT_QUART,
                delay: shouldReduceMotion ? 0 : 0.2,
              }}
              className="lg:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed text-muted"
            >
              <p className="text-ink font-medium text-base sm:text-lg leading-relaxed">
                Designing responsive interfaces and connecting them to reliable application
                logic and data systems.
              </p>
              <p>
                My engineering focus centers on closing the gap between interface ergonomics and
                backend persistence. Rather than treating visual client design and server runtimes
                as disconnected disciplines, I approach web software as a continuous, deterministic
                loop.
              </p>
              <p>
                From building reactive client components in{" "}
                <strong className="text-ink font-semibold">React</strong> and{" "}
                <strong className="text-ink font-semibold">TypeScript</strong> to defining strict
                API validation boundaries in <strong className="text-ink font-semibold">Node.js</strong>{" "}
                and <strong className="text-ink font-semibold">Express.js</strong>, I prioritize
                predictable data contracts: legible typography, type-safe protocols, and clean
                storage persistence.
              </p>
            </motion.div>

            {/* Architectural Discipline Card */}
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                ease: EASE_OUT_QUART,
                delay: shouldReduceMotion ? 0 : 0.3,
              }}
              className="lg:col-span-5 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md p-6 sm:p-7 shadow-xs space-y-5 hover:border-black/15 dark:hover:border-white/20 transition-colors duration-200"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-black/5 dark:border-white/5 text-xs font-mono uppercase tracking-wider text-muted">
                <Layers size={14} />
                <span>Foundational Disciplines</span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="font-semibold text-ink flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>Interface Ergonomics</span>
                  </div>
                  <p className="text-xs text-muted pl-3.5 leading-relaxed">
                    Fast, accessible client components with predictable state transitions and
                    minimal cognitive friction for end users.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-ink flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>Runtime &amp; Schema Integrity</span>
                  </div>
                  <p className="text-xs text-muted pl-3.5 leading-relaxed">
                    Type-checked route boundaries, validated request schemas, and structured
                    relational transactions that prevent corrupted state.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Restrained Technical Stack References */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={chipStaggerContainer}
            className="pt-2 flex flex-wrap items-center gap-2"
          >
            {[
              "React 18",
              "TypeScript",
              "Node.js",
              "Express.js",
              "Tailwind CSS",
              "PostgreSQL",
              "MongoDB",
              "REST Architecture",
            ].map((tech) => (
              <motion.span
                key={tech}
                variants={chipItemVariant}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.18 }}
                className="text-xs font-mono font-medium px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#16161B]/80 text-muted shadow-2xs hover:text-ink hover:border-black/20 dark:hover:border-white/20 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </article>

        {/* ════════════════════════════════════════════════════════════════
            CHAPTER 02 — ARCHITECTURE & DATA (Technical Editorial Illustration)
           ════════════════════════════════════════════════════════════════ */}
        <article
          id="chapter-architecture"
          className="space-y-8 scroll-mt-28"
          aria-labelledby="heading-chapter-02"
        >
          {/* Chapter Metadata Marker */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE_OUT_QUART }}
            className="flex items-center gap-3"
          >
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/5 dark:bg-white/10 text-ink border border-black/5 dark:border-white/10">
              02 / 04
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Chapter Two · Architecture &amp; Data
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              ease: EASE_OUT_QUART,
              delay: shouldReduceMotion ? 0 : 0.1,
            }}
            className="max-w-3xl"
          >
            <h3
              id="heading-chapter-02"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight"
            >
              Three-Tier Architectural Pipeline
            </h3>
            <p className="text-sm sm:text-base text-muted mt-2 leading-relaxed">
              A structured view of how data flows through my applications &mdash; separating client
              presentation, runtime validation, and storage persistence across defined protocol boundaries.
            </p>
          </motion.div>

          {/* ── Custom Editorial Technical SVG Diagram ── */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.65,
              ease: EASE_OUT_QUART,
              delay: shouldReduceMotion ? 0 : 0.15,
            }}
            className="rounded-3xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-[#121216]/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden"
          >
            {/* Header Annotation */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/5 dark:border-white/5 text-xs text-muted font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Synchronous Request &amp; Persistence Cycle</span>
              </span>
              <span className="text-[11px] font-mono hidden sm:inline">
                Contract: TypeScript Interface ↔ Zod Validation ↔ Database Schema
              </span>
            </div>

            {/* Desktop / Tablet Technical SVG Illustration */}
            <div className="hidden md:block w-full">
              <svg
                viewBox="0 0 940 380"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto text-ink"
                aria-label="Software architecture diagram showing client, runtime services, and persistence layers"
              >
                {/* ── Outer Coordinate Grid Guides ── */}
                <line
                  x1="20"
                  y1="190"
                  x2="920"
                  y2="190"
                  stroke="currentColor"
                  strokeOpacity="0.06"
                  strokeDasharray="4 4"
                />

                {/* ── Tier 01: Client Layer ── */}
                <motion.g
                  initial={{
                    opacity: shouldReduceMotion ? 1 : 0,
                    y: shouldReduceMotion ? 0 : 12,
                  }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.55,
                    delay: shouldReduceMotion ? 0 : 0.1,
                    ease: EASE_OUT_QUART,
                  }}
                >
                  <rect
                    x="20"
                    y="70"
                    width="260"
                    height="240"
                    rx="16"
                    className="fill-white dark:fill-[#16161B] stroke-black/10 dark:stroke-white/15"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="20"
                    y="70"
                    width="260"
                    height="42"
                    rx="16"
                    className="fill-black/[0.02] dark:fill-white/[0.02] stroke-black/5 dark:stroke-white/10"
                    strokeWidth="1"
                  />
                  {/* Tier Pill */}
                  <rect
                    x="36"
                    y="84"
                    width="68"
                    height="18"
                    rx="4"
                    className="fill-black/5 dark:fill-white/10"
                  />
                  <text
                    x="70"
                    y="96"
                    textAnchor="middle"
                    className="fill-current text-[10px] font-mono font-bold tracking-wider"
                  >
                    01 CLIENT
                  </text>

                  {/* Layer Titles & Copy */}
                  <text
                    x="36"
                    y="145"
                    className="fill-current font-display text-base font-bold tracking-tight"
                  >
                    Client Layer
                  </text>
                  <text
                    x="36"
                    y="170"
                    className="fill-current opacity-60 text-xs font-mono font-semibold"
                  >
                    React / TypeScript
                  </text>

                  <text
                    x="36"
                    y="204"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • Component tree &amp; state stores
                  </text>
                  <text
                    x="36"
                    y="226"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • Optimistic client updates
                  </text>
                  <text
                    x="36"
                    y="248"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • Tailwind responsive styling
                  </text>

                  {/* Micro Badge */}
                  <rect
                    x="36"
                    y="275"
                    width="228"
                    height="22"
                    rx="6"
                    className="fill-black/[0.03] dark:fill-white/[0.04] stroke-black/5 dark:stroke-white/5"
                    strokeWidth="1"
                  />
                  <text
                    x="46"
                    y="290"
                    className="fill-current opacity-50 text-[10px] font-mono"
                  >
                    PORT: 5173 / HTTPS CLIENT
                  </text>
                </motion.g>

                {/* ── Connector Line 1: Client -> Runtime (Animated Path Drawing) ── */}
                <g>
                  <motion.line
                    x1="280"
                    y1="190"
                    x2="344"
                    y2="190"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="stroke-black/30 dark:stroke-white/30"
                    initial={{
                      pathLength: shouldReduceMotion ? 1 : 0,
                      opacity: shouldReduceMotion ? 1 : 0.2,
                    }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.75,
                      delay: shouldReduceMotion ? 0 : 0.35,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.polygon
                    points="350,190 342,185 342,195"
                    fill="currentColor"
                    className="fill-black/40 dark:fill-white/40"
                    initial={{
                      opacity: shouldReduceMotion ? 1 : 0,
                      scale: shouldReduceMotion ? 1 : 0.6,
                    }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.3,
                      delay: shouldReduceMotion ? 0 : 1.05,
                    }}
                  />

                  {/* Technical Protocol Annotation */}
                  <motion.g
                    initial={{
                      opacity: shouldReduceMotion ? 1 : 0,
                      y: shouldReduceMotion ? 0 : 4,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.35,
                      delay: shouldReduceMotion ? 0 : 0.65,
                    }}
                  >
                    <rect
                      x="288"
                      y="152"
                      width="54"
                      height="24"
                      rx="4"
                      className="fill-black/5 dark:fill-white/10"
                    />
                    <text
                      x="315"
                      y="167"
                      textAnchor="middle"
                      className="fill-current text-[9px] font-mono font-bold"
                    >
                      REST API
                    </text>
                    <text
                      x="315"
                      y="218"
                      textAnchor="middle"
                      className="fill-current opacity-40 text-[8px] font-mono"
                    >
                      JSON / JWT
                    </text>
                  </motion.g>
                </g>

                {/* ── Tier 02: Runtime & Services Layer ── */}
                <motion.g
                  initial={{
                    opacity: shouldReduceMotion ? 1 : 0,
                    y: shouldReduceMotion ? 0 : 12,
                  }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.55,
                    delay: shouldReduceMotion ? 0 : 0.5,
                    ease: EASE_OUT_QUART,
                  }}
                >
                  <rect
                    x="350"
                    y="70"
                    width="260"
                    height="240"
                    rx="16"
                    className="fill-white dark:fill-[#16161B] stroke-black/10 dark:stroke-white/15"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="350"
                    y="70"
                    width="260"
                    height="42"
                    rx="16"
                    className="fill-black/[0.02] dark:fill-white/[0.02] stroke-black/5 dark:stroke-white/10"
                    strokeWidth="1"
                  />
                  {/* Tier Pill */}
                  <rect
                    x="366"
                    y="84"
                    width="80"
                    height="18"
                    rx="4"
                    className="fill-black/5 dark:fill-white/10"
                  />
                  <text
                    x="406"
                    y="96"
                    textAnchor="middle"
                    className="fill-current text-[10px] font-mono font-bold tracking-wider"
                  >
                    02 RUNTIME
                  </text>

                  {/* Layer Titles & Copy */}
                  <text
                    x="366"
                    y="145"
                    className="fill-current font-display text-base font-bold tracking-tight"
                  >
                    Runtime &amp; Services
                  </text>
                  <text
                    x="366"
                    y="170"
                    className="fill-current opacity-60 text-xs font-mono font-semibold"
                  >
                    Node.js / Express.js
                  </text>

                  <text
                    x="366"
                    y="204"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • Zod request validation
                  </text>
                  <text
                    x="366"
                    y="226"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • JWT session route guards
                  </text>
                  <text
                    x="366"
                    y="248"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • Transaction business logic
                  </text>

                  {/* Micro Badge */}
                  <rect
                    x="366"
                    y="275"
                    width="228"
                    height="22"
                    rx="6"
                    className="fill-black/[0.03] dark:fill-white/[0.04] stroke-black/5 dark:stroke-white/5"
                    strokeWidth="1"
                  />
                  <text
                    x="376"
                    y="290"
                    className="fill-current opacity-50 text-[10px] font-mono"
                  >
                    MIDDLEWARE / ROLE GUARDS
                  </text>
                </motion.g>

                {/* ── Connector Line 2: Runtime -> Persistence (Animated Path Drawing) ── */}
                <g>
                  <motion.line
                    x1="610"
                    y1="190"
                    x2="674"
                    y2="190"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="stroke-black/30 dark:stroke-white/30"
                    initial={{
                      pathLength: shouldReduceMotion ? 1 : 0,
                      opacity: shouldReduceMotion ? 1 : 0.2,
                    }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.75,
                      delay: shouldReduceMotion ? 0 : 0.8,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.polygon
                    points="680,190 672,185 672,195"
                    fill="currentColor"
                    className="fill-black/40 dark:fill-white/40"
                    initial={{
                      opacity: shouldReduceMotion ? 1 : 0,
                      scale: shouldReduceMotion ? 1 : 0.6,
                    }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.3,
                      delay: shouldReduceMotion ? 0 : 1.5,
                    }}
                  />

                  {/* Technical Protocol Annotation */}
                  <motion.g
                    initial={{
                      opacity: shouldReduceMotion ? 1 : 0,
                      y: shouldReduceMotion ? 0 : 4,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.35,
                      delay: shouldReduceMotion ? 0 : 1.1,
                    }}
                  >
                    <rect
                      x="618"
                      y="152"
                      width="54"
                      height="24"
                      rx="4"
                      className="fill-black/5 dark:fill-white/10"
                    />
                    <text
                      x="645"
                      y="167"
                      textAnchor="middle"
                      className="fill-current text-[9px] font-mono font-bold"
                    >
                      DRIVER
                    </text>
                    <text
                      x="645"
                      y="218"
                      textAnchor="middle"
                      className="fill-current opacity-40 text-[8px] font-mono"
                    >
                      ORM / POOL
                    </text>
                  </motion.g>
                </g>

                {/* ── Tier 03: Persistence Layer ── */}
                <motion.g
                  initial={{
                    opacity: shouldReduceMotion ? 1 : 0,
                    y: shouldReduceMotion ? 0 : 12,
                  }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.55,
                    delay: shouldReduceMotion ? 0 : 0.95,
                    ease: EASE_OUT_QUART,
                  }}
                >
                  <rect
                    x="680"
                    y="70"
                    width="240"
                    height="240"
                    rx="16"
                    className="fill-white dark:fill-[#16161B] stroke-black/10 dark:stroke-white/15"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="680"
                    y="70"
                    width="240"
                    height="42"
                    rx="16"
                    className="fill-black/[0.02] dark:fill-white/[0.02] stroke-black/5 dark:stroke-white/10"
                    strokeWidth="1"
                  />
                  {/* Tier Pill */}
                  <rect
                    x="696"
                    y="84"
                    width="96"
                    height="18"
                    rx="4"
                    className="fill-black/5 dark:fill-white/10"
                  />
                  <text
                    x="744"
                    y="96"
                    textAnchor="middle"
                    className="fill-current text-[10px] font-mono font-bold tracking-wider"
                  >
                    03 PERSISTENCE
                  </text>

                  {/* Layer Titles & Copy */}
                  <text
                    x="696"
                    y="145"
                    className="fill-current font-display text-base font-bold tracking-tight"
                  >
                    Persistence Layer
                  </text>
                  <text
                    x="696"
                    y="170"
                    className="fill-current opacity-60 text-xs font-mono font-semibold"
                  >
                    SQL &amp; Document Stores
                  </text>

                  <text
                    x="696"
                    y="204"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • PostgreSQL / MongoDB
                  </text>
                  <text
                    x="696"
                    y="226"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • MySQL / Supabase
                  </text>
                  <text
                    x="696"
                    y="248"
                    className="fill-current opacity-70 text-[11px] leading-relaxed"
                  >
                    • Relational integrity &amp; indexing
                  </text>

                  {/* Micro Badge */}
                  <rect
                    x="696"
                    y="275"
                    width="208"
                    height="22"
                    rx="6"
                    className="fill-black/[0.03] dark:fill-white/[0.04] stroke-black/5 dark:stroke-white/5"
                    strokeWidth="1"
                  />
                  <text
                    x="706"
                    y="290"
                    className="fill-current opacity-50 text-[10px] font-mono"
                  >
                    DISK PERSISTENCE / STORAGE
                  </text>
                </motion.g>
              </svg>
            </div>

            {/* Mobile Vertical Flow Stack (Clean, Responsive Fallback with Staggered Entrance) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="md:hidden space-y-4"
            >
              {/* Layer 1 Mobile */}
              <motion.div
                variants={fadeUpVariant}
                className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-[#16161B]/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-ink">01 — CLIENT</span>
                  <span className="text-muted">React / TypeScript</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Component state trees, optimistic user updates, and responsive layout chassis.
                </p>
              </motion.div>

              {/* Arrow Connector Mobile */}
              <motion.div
                variants={fadeUpVariant}
                className="flex items-center justify-center text-xs font-mono text-muted gap-2 py-0.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ink opacity-30" />
                <span>↓ REST API / JWT Protocol</span>
                <span className="w-1.5 h-1.5 rounded-full bg-ink opacity-30" />
              </motion.div>

              {/* Layer 2 Mobile */}
              <motion.div
                variants={fadeUpVariant}
                className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-[#16161B]/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-ink">02 — RUNTIME &amp; SERVICES</span>
                  <span className="text-muted">Node.js / Express</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Zod request schema boundary validation, route access control, and transaction logic.
                </p>
              </motion.div>

              {/* Arrow Connector Mobile */}
              <motion.div
                variants={fadeUpVariant}
                className="flex items-center justify-center text-xs font-mono text-muted gap-2 py-0.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ink opacity-30" />
                <span>↓ ORM / Driver Pool</span>
                <span className="w-1.5 h-1.5 rounded-full bg-ink opacity-30" />
              </motion.div>

              {/* Layer 3 Mobile */}
              <motion.div
                variants={fadeUpVariant}
                className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-[#16161B]/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-ink">03 — PERSISTENCE</span>
                  <span className="text-muted">Postgres / Mongo / MySQL / Supabase</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Relational schemas, ACID transactions, and persistent document storage.
                </p>
              </motion.div>
            </motion.div>

            {/* Bottom Invariant Footer */}
            <footer className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="text-muted font-mono">
                System Guarantee: No unvalidated client inputs reach persistence.
              </span>
              <span className="font-mono text-[11px] text-muted bg-surface-strong px-2.5 py-0.5 rounded-md">
                Strict Boundary Typing
              </span>
            </footer>
          </motion.div>
        </article>

        {/* ════════════════════════════════════════════════════════════════
            CHAPTER 03 — PRACTICAL EXPERIENCE (Editorial Project Exhibition)
           ════════════════════════════════════════════════════════════════ */}
        <article
          id="chapter-experience"
          className="space-y-8 scroll-mt-28"
          aria-labelledby="heading-chapter-03"
        >
          {/* Chapter Metadata Marker */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE_OUT_QUART }}
            className="flex items-center gap-3"
          >
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/5 dark:bg-white/10 text-ink border border-black/5 dark:border-white/10">
              03 / 04
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Chapter Three · Practical Experience
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              ease: EASE_OUT_QUART,
              delay: shouldReduceMotion ? 0 : 0.1,
            }}
            className="max-w-3xl"
          >
            <h3
              id="heading-chapter-03"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight"
            >
              Shipped Systems &amp; Engineering Milestones
            </h3>
            <p className="text-sm sm:text-base text-muted mt-2 leading-relaxed">
              Three systems built around specific operational problems. Each milestone highlights
              the core challenge solved and the architecture behind it.
            </p>
          </motion.div>

          {/* ── Asymmetric Editorial Exhibition Layout ── */}
          <div className="space-y-6">
            {/* ── 01. PalengkeHub (Visually Dominant Hero Milestone) ── */}
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.65,
                ease: EASE_OUT_QUART,
              }}
              className="group p-7 sm:p-9 rounded-3xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-[#141416]/90 backdrop-blur-md shadow-xs space-y-6 relative overflow-hidden hover:border-black/20 dark:hover:border-white/25 transition-all duration-300"
            >
              {/* Top Accent Stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-[#D95B16]"
                aria-hidden="true"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D95B16]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D95B16]">
                    CAPSTONE PROJECT / MOBILE COMMERCE
                  </span>
                </div>
                <span className="text-xs font-mono text-muted">Lipa City, Batangas · 2026</span>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <h4 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-ink tracking-tight">
                    PalengkeHub — Public Market Digital Marketplace &amp; Price Comparator
                  </h4>

                  <p className="text-sm sm:text-base leading-relaxed text-muted">
                    A digital marketplace and price-comparison platform focused on improving
                    product discovery and price visibility at Lipa City Public Market.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                        Operational Problem
                      </p>
                      <p className="text-muted leading-relaxed">
                        Heavy morning foot-traffic congestion and volatile, unindexed produce
                        prices across wet and dry market sections.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                        Architectural Solution
                      </p>
                      <p className="text-muted leading-relaxed">
                        Built the "Presyo Check" benchmark comparator and a scheduled pickup ticketing
                        system with zero delivery fees and fast vendor claim codes.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {["React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "REST APIs"].map(
                      (t) => (
                        <span
                          key={t}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface-strong text-muted border border-black/5 dark:border-white/5"
                        >
                          {t}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Minimalist Authentic Device Schematic Preview */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-[#FBF7EE] dark:bg-[#1A1815] space-y-4 group-hover:border-black/15 dark:group-hover:border-white/20 transition-colors">
                  <div className="w-16 h-28 rounded-2xl border-2 border-black/20 dark:border-white/20 p-2 flex flex-col justify-between bg-white dark:bg-[#141416] shadow-xs group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <span className="w-4 h-0.5 rounded-full bg-[#D95B16]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full rounded bg-[#D95B16]/80" />
                      <div className="h-1.5 w-3/4 rounded bg-black/20 dark:bg-white/30" />
                      <div className="h-1.5 w-1/2 rounded bg-emerald-500/60" />
                    </div>
                    <div className="flex justify-center">
                      <span className="w-5 h-0.5 rounded-full bg-black/20 dark:bg-white/30" />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-xs font-mono font-semibold text-ink">
                      Mobile Commerce Focus
                    </span>
                    <p className="text-[11px] text-muted">
                      Tailored for smartphone shoppers &amp; quick stall pickup
                    </p>
                  </div>

                  {/* Reserved Simulator Navigation Anchor */}
                  <a
                    href="#projects"
                    onClick={(e) => handleJumpToSimulator(e, "palengkehub", 0)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D95B16] hover:underline pt-1 group/btn"
                  >
                    <span>Jump to Simulator</span>
                    <ArrowUpRight
                      size={13}
                      className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-150"
                    />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── Secondary Grid: EventPulse & Auto Avenue IMS ── */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              {/* ── 02. EventPulse (Distinct Secondary Composition) ── */}
              <motion.div
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.6,
                  ease: EASE_OUT_QUART,
                  delay: shouldReduceMotion ? 0 : 0.1,
                }}
                className="group lg:col-span-6 p-7 rounded-3xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-[#141416]/90 backdrop-blur-md shadow-xs flex flex-col justify-between space-y-6 relative overflow-hidden hover:border-black/20 dark:hover:border-white/25 transition-all duration-300"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"
                  aria-hidden="true"
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/5 dark:border-white/5">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      CAMPUS WEB PLATFORM
                    </span>
                    <span className="text-xs font-mono text-muted">Full-Stack Web</span>
                  </div>

                  <h4 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight">
                    EventPulse — Campus Event Management &amp; Registration
                  </h4>

                  <p className="text-sm leading-relaxed text-muted">
                    A campus event management and registration platform supporting role-based
                    dashboards, waitlists, and verified student rosters.
                  </p>

                  <div className="space-y-2 text-xs">
                    <p className="text-muted leading-relaxed">
                      <strong className="text-ink">Architecture:</strong> Role-based JWT session
                      authentication, atomic capacity decrementing logic (
                      <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-surface-strong">
                        open
                      </code>{" "}
                      →{" "}
                      <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-surface-strong">
                        ongoing
                      </code>{" "}
                      →{" "}
                      <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-surface-strong">
                        closed
                      </code>
                      ), and multi-tenant organizer oversight.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted">
                    React · Node · Express · MongoDB
                  </span>
                  <a
                    href="#projects"
                    onClick={(e) => handleJumpToSimulator(e, "event-tracker", 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline group/btn"
                  >
                    <span>Jump to Simulator</span>
                    <ArrowUpRight
                      size={13}
                      className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-150"
                    />
                  </a>
                </div>
              </motion.div>

              {/* ── 03. Auto Avenue IMS (Typographic Conceptual Workflow Treatment) ── */}
              <motion.div
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.6,
                  ease: EASE_OUT_QUART,
                  delay: shouldReduceMotion ? 0 : 0.2,
                }}
                className="group lg:col-span-6 p-7 rounded-3xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-[#141416]/90 backdrop-blur-md shadow-xs flex flex-col justify-between space-y-6 relative overflow-hidden hover:border-black/20 dark:hover:border-white/25 transition-all duration-300"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-[#144A2A] dark:bg-emerald-400"
                  aria-hidden="true"
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/5 dark:border-white/5">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#144A2A] dark:text-emerald-400">
                      ENTERPRISE SYSTEM / INVENTORY MANAGEMENT
                    </span>
                    <span className="text-xs font-mono text-muted">ERP Workflow</span>
                  </div>

                  <h4 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight">
                    Auto Avenue IMS — Automotive Stock &amp; Procurement
                  </h4>

                  <p className="text-sm leading-relaxed text-muted">
                    An automotive inventory and procurement management system designed to eliminate
                    stockouts on critical dealership replacement parts.
                  </p>

                  {/* Typographic Conceptual Workflow Box with Progressive Sequential Reveal */}
                  <div className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold">
                      Conceptual Operational Workflow
                    </p>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={staggerContainer}
                      className="flex flex-wrap items-center gap-2 text-xs font-mono text-ink"
                    >
                      <motion.span
                        variants={workflowStepVariant}
                        className="px-2 py-1 rounded bg-white dark:bg-[#1F1F24] border border-black/10 dark:border-white/10 shadow-2xs"
                      >
                        01 Inventory
                      </motion.span>
                      <motion.span variants={workflowStepVariant} className="text-muted">
                        →
                      </motion.span>
                      <motion.span
                        variants={workflowStepVariant}
                        className="px-2 py-1 rounded bg-white dark:bg-[#1F1F24] border border-black/10 dark:border-white/10 shadow-2xs"
                      >
                        02 Requisition
                      </motion.span>
                      <motion.span variants={workflowStepVariant} className="text-muted">
                        →
                      </motion.span>
                      <motion.span
                        variants={workflowStepVariant}
                        className="px-2 py-1 rounded bg-white dark:bg-[#1F1F24] border border-black/10 dark:border-white/10 shadow-2xs"
                      >
                        03 Procurement
                      </motion.span>
                    </motion.div>
                    <p className="text-[11px] text-muted pt-1">
                      Automated threshold triggers dispatch requisitions to verified part suppliers.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted">
                    React · Node · MySQL / Postgres
                  </span>
                  <a
                    href="#projects"
                    onClick={(e) => handleJumpToSimulator(e, "auto-avenue", 2)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#144A2A] dark:text-emerald-400 hover:underline group/btn"
                  >
                    <span>Jump to Simulator</span>
                    <ArrowUpRight
                      size={13}
                      className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-150"
                    />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </article>

        {/* ════════════════════════════════════════════════════════════════
            CHAPTER 04 — CURRENT DIRECTION (Understated Editorial Conclusion)
           ════════════════════════════════════════════════════════════════ */}
        <article
          id="chapter-horizons"
          className="space-y-10 scroll-mt-28"
          aria-labelledby="heading-chapter-04"
        >
          {/* Chapter Metadata Marker */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE_OUT_QUART }}
            className="flex items-center gap-3"
          >
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/5 dark:bg-white/10 text-ink border border-black/5 dark:border-white/10">
              04 / 04
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Chapter Four · Current Direction
            </span>
          </motion.div>

          {/* Understated Display Headline */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              ease: EASE_OUT_QUART,
              delay: shouldReduceMotion ? 0 : 0.05,
            }}
            className="max-w-3xl space-y-4"
          >
            <h3
              id="heading-chapter-04"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight"
            >
              Still learning. Still building.{" "}
              <span className="text-muted">Moving forward.</span>
            </h3>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Fourth-year Information Technology student at{" "}
              <strong className="text-ink font-semibold">De La Salle Lipa</strong>, focused on
              system development and gaining practical experience building useful software. What
              started with exploring how things work under the hood has become a daily discipline of
              shipping reliable code.
            </p>
          </motion.div>

          {/* Authentic Academic & Leadership Dossier */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-5"
          >
            {/* Education Card */}
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md space-y-3 shadow-xs hover:border-black/15 dark:hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                <span className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-ink">
                  <GraduationCap size={18} />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-ink">Education</h4>
                  <span className="text-[11px] font-mono text-muted">{education.dateRange}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-ink">{education.school}</p>
                <p className="text-muted">
                  {education.degree} · {education.major}
                </p>
                <p className="flex items-center gap-1 text-muted text-[11px] pt-1">
                  <MapPin size={11} />
                  {education.location}
                </p>
              </div>
            </motion.div>

            {/* Academic Honors Card */}
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md space-y-3 shadow-xs hover:border-black/15 dark:hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                <span className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-ink">
                  <Award size={18} />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-ink">Academic Honors</h4>
                  <span className="text-[11px] font-mono text-muted">College Honors List</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Dean's Lister (1st Sem 24-25)</span>
                  <span className="font-mono font-bold text-ink">GPA 3.4615</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Dean's Lister (1st Sem 23-24)</span>
                  <span className="font-mono font-bold text-ink">GPA 3.3478</span>
                </div>
              </div>
            </motion.div>

            {/* Community Leadership Card */}
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md space-y-3 shadow-xs hover:border-black/15 dark:hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                <span className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-ink">
                  <Users size={18} />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-ink">Community</h4>
                  <span className="text-[11px] font-mono text-muted">Student Tech Network</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {leadership.map((item) => (
                  <div key={item.organization} className="space-y-1">
                    <p className="font-semibold text-ink">{item.organization}</p>
                    <p className="text-muted">
                      {item.role} ({item.dateRange})
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Understated Visual Transition Toward Contact ── */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              ease: EASE_OUT_QUART,
              delay: shouldReduceMotion ? 0 : 0.1,
            }}
            className="rounded-3xl border border-black/10 dark:border-white/15 bg-white/90 dark:bg-[#141416]/95 backdrop-blur-xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/10 text-xs font-semibold text-ink">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Active Internship Availability</span>
              </div>

              <h4 className="font-display text-xl sm:text-2xl font-bold text-ink">
                Ready to contribute to a forward-thinking engineering team.
              </h4>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Currently seeking software development and IT internship roles in Lipa City,
                Batangas, or remotely.
              </p>
            </div>

            {/* Reserved Navigation Prompt */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-6 py-3 rounded-full bg-cta-primary text-cta-primary-text hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
              >
                <span>Let's connect</span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={2.5}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
                />
              </a>
            </div>
          </motion.div>
        </article>
      </div>
    </section>
  );
}

// Export as both About and DeveloperJourney for semantic and backward compatibility
export { About as DeveloperJourney };
