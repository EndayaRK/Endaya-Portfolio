import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { profile } from "../data";
import { EASE_OUT_EXPO, INTRO_DELAY, scrollToSection } from "../motion";

/** Natural aspect ratio of /formalpic.png (transparent cut-out, 1056×976). */
const PORTRAIT_ASPECT = "1056 / 976";

/** Tracks the lg breakpoint (1024px) so subtle scroll depth only runs on desktop. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();
  const depth = isDesktop && !reduce;

  // Restrained desktop scroll depth: kept subtle so zoom levels never cause overlap or clipping
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, depth ? 32 : 0]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, depth ? -16 : 0]);

  const d = reduce ? 0 : INTRO_DELAY;

  /** Masked line reveal: content rises from below its own clipping box. */
  const lineReveal = (delay: number) => ({
    initial: reduce ? false : { y: "112%" },
    animate: { y: "0%" },
    transition: {
      duration: reduce ? 0 : 0.88,
      delay: d + delay,
      ease: EASE_OUT_EXPO,
    },
  });

  /** Quiet supporting entrance for descriptor, copy, and actions. */
  const support = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.72,
      delay: d + delay,
      ease: EASE_OUT_EXPO,
    },
  });

  const goToProjects = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection("projects");
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative overflow-hidden border-b border-black/[0.06] dark:border-white/[0.06] pt-24 sm:pt-28 lg:pt-32"
    >
      {/* Unified Editorial Container — keeps Headline, Copy, and Portrait proportionally aligned */}
      <div className="max-w-site mx-auto px-6 md:px-12 lg:px-16 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12 items-center">
          {/* ───────────────────── 1. Professional Descriptor & Two-Line Headline ───────────────────── */}
          <motion.div
            style={{ y: headlineY }}
            className="order-1 lg:col-span-6 lg:row-start-1 relative z-20"
          >
            {/* Step 1: Subtle professional descriptor */}
            <motion.p
              {...support(0.04)}
              className="font-mono text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-muted"
            >
              FULL-STACK DEVELOPMENT · PHILIPPINES
            </motion.p>

            {/* Step 2: Primary Headline revealed in two lines via clipping masks */}
            <h1 className="mt-5 sm:mt-6 font-display font-semibold text-ink tracking-[-0.032em] leading-[1.05] text-[clamp(2.35rem,4.6vw,4.25rem)]">
              <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span {...lineReveal(0.12)} className="block">
                  Web applications,
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <motion.span {...lineReveal(0.2)} className="block">
                  built around real needs.
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* ───────────────────── 2. Portrait Stage (Generously Sized & Vertically Centered with Left Text) ───────────────────── */}
          <div className="order-2 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 relative z-10 mt-6 sm:mt-8 lg:mt-0 w-full flex justify-center lg:justify-end items-center self-center">
            <div
              className="relative w-full max-w-[420px] sm:max-w-[500px] md:max-w-[560px] lg:max-w-none lg:w-[114%] xl:w-[122%] lg:-mr-6 xl:-mr-10"
              style={{ aspectRatio: PORTRAIT_ASPECT }}
            >
              <motion.div style={{ y: portraitY }} className="w-full h-full">
                {/* Step 4: Natural portrait reveal */}
                <motion.img
                  src={profile.photo}
                  alt="Portrait of Rhon Kelly Endaya"
                  width={1056}
                  height={976}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  initial={
                    reduce
                      ? false
                      : {
                          clipPath: "inset(100% 0% 0% 0%)",
                          y: "3%",
                          scale: 1.02,
                        }
                  }
                  animate={{
                    clipPath: "inset(0% 0% 0% 0%)",
                    y: "0%",
                    scale: 1,
                  }}
                  transition={{
                    duration: reduce ? 0 : 1.08,
                    delay: d + 0.34,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="block w-full h-full object-contain object-center select-none pointer-events-none"
                />
              </motion.div>
            </div>
          </div>

          {/* ───────────────────── 3. Supporting Statement & CTA Controls ───────────────────── */}
          <div className="order-3 lg:col-span-6 lg:row-start-2 relative z-20 pt-6 sm:pt-8 lg:pt-7">
            <div className="max-w-[33rem]">
              {/* Step 3: Supporting statement */}
              <motion.p
                {...support(0.28)}
                className="font-body text-base sm:text-lg lg:text-[1.2rem] leading-[1.55] text-muted"
              >
                I develop functional digital experiences, from responsive
                interfaces to backend systems.
              </motion.p>

              {/* Step 5: CTA Controls */}
              <motion.div
                {...support(0.42)}
                className="mt-8 sm:mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
              >
                <a
                  href="#projects"
                  onClick={goToProjects}
                  className="group inline-flex items-center gap-3 rounded-full bg-cta-primary text-cta-primary-text pl-6 pr-2 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                >
                  View selected work
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-cta-primary-text/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={15} strokeWidth={2.25} />
                  </span>
                </a>

                <a
                  href="/resume.pdf"
                  download="Rhon-Kelly-Endaya-Resume.pdf"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-ink"
                >
                  <span className="relative">
                    Download résumé
                    <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left bg-ink/30 transition-transform duration-300 group-hover:scale-x-0" />
                    <span className="absolute left-0 -bottom-0.5 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-300 delay-100 group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                  <ArrowDown
                    size={14}
                    strokeWidth={2.25}
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                </a>
              </motion.div>

              {/* Channels & Availability */}
              <motion.div
                {...support(0.5)}
                className="mt-9 sm:mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-muted"
              >
                <span className="inline-flex items-center gap-2 text-ink">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-ink"
                    aria-hidden="true"
                  />
                  Open to IT internships
                </span>
                <span
                  className="hidden sm:block h-3 w-px bg-ink/15"
                  aria-hidden="true"
                />
                <nav
                  aria-label="Social links"
                  className="flex items-center gap-5"
                >
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 hover:text-ink transition-colors"
                  >
                    GitHub <ArrowUpRight size={12} />
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 hover:text-ink transition-colors"
                  >
                    LinkedIn <ArrowUpRight size={12} />
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-0.5 hover:text-ink transition-colors"
                  >
                    Email <ArrowUpRight size={12} />
                  </a>
                </nav>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
