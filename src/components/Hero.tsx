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

const SURNAME = "Endaya";

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
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, depth ? 36 : 0]);
  const nameY = useTransform(scrollYProgress, [0, 1], [0, depth ? -18 : 0]);

  const d = reduce ? 0 : INTRO_DELAY;

  /** Masked line reveal: content rises from below its own clipping box. */
  const lineReveal = (delay: number) => ({
    initial: reduce ? false : { y: "118%" },
    animate: { y: "0%" },
    transition: {
      duration: reduce ? 0 : 1.0,
      delay: d + delay,
      ease: EASE_OUT_EXPO,
    },
  });

  /** Quiet supporting entrance for copy and actions. */
  const support = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.78,
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
      {/* Unified Editorial Container — keeps Name, Copy, and Portrait proportionally aligned */}
      <div className="max-w-site mx-auto px-6 md:px-12 lg:px-16 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-6 xl:gap-x-10 items-center">
          {/* ───────────────────── 1. Name Lockup (Top-Left on Desktop, 1st on Mobile/Tablet) ───────────────────── */}
          <motion.div
            style={{ y: nameY }}
            className="order-1 lg:col-span-6 lg:row-start-1 relative z-20"
          >
            <motion.p
              {...support(0.05)}
              className="font-mono text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-muted"
            >
              BS Information Technology
              <span className="mx-2 text-ink/25" aria-hidden="true">
                /
              </span>
              System Development
            </motion.p>

            <h1 className="mt-5 sm:mt-6 text-ink select-none">
              <span className="sr-only">Rhon Kelly Endaya</span>

              {/* Line 1 — serif italic, the lighter editorial voice */}
              <span
                className="block overflow-hidden font-serif italic font-normal leading-[0.96] tracking-[-0.01em] text-[clamp(2.55rem,5.4vw,4.5rem)] pt-[0.08em] -mt-[0.08em] pb-[0.18em] -mb-[0.18em]"
                aria-hidden="true"
              >
                <motion.span {...lineReveal(0.1)} className="block">
                  Rhon Kelly
                </motion.span>
              </span>

              {/* Line 2 — bold display surname, fluidly scaled so it never wraps or collides */}
              <span
                className="block overflow-hidden font-display font-extrabold leading-[0.88] tracking-tightest text-[clamp(3.4rem,8.8vw,7.1rem)] pt-[0.06em] -mt-[0.06em] pb-[0.2em] -mb-[0.2em] -ml-[0.03em] whitespace-nowrap"
                aria-hidden="true"
              >
                <span className="inline-flex">
                  {SURNAME.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      {...lineReveal(0.22 + i * 0.045)}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
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
                          y: "4%",
                          scale: 1.03,
                        }
                  }
                  animate={{
                    clipPath: "inset(0% 0% 0% 0%)",
                    y: "0%",
                    scale: 1,
                  }}
                  transition={{
                    duration: reduce ? 0 : 1.25,
                    delay: d + 0.34,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="block w-full h-full object-contain object-center select-none pointer-events-none"
                />
              </motion.div>
            </div>
          </div>

          {/* ───────────────────── 3. Introduction & Actions (Aligned Below Name on Left) ───────────────────── */}
          <div className="order-3 lg:col-span-6 lg:row-start-2 relative z-20 pt-8 sm:pt-10 lg:pt-8">
            <div className="max-w-[33rem]">
              <motion.p
                {...support(0.78)}
                className="font-display text-lg sm:text-xl lg:text-[1.35rem] leading-[1.38] font-medium tracking-[-0.015em] text-ink"
              >
                I build web applications and software solutions focused on
                usability, functionality, and real-world problems.
              </motion.p>

              <motion.p
                {...support(0.86)}
                className="mt-3.5 text-sm sm:text-[15px] leading-[1.68] text-muted"
              >
                Fourth-year student at De La Salle Lipa, working mainly with
                React, TypeScript, Node.js, Express.js, and PHP.
              </motion.p>

              {/* Primary & Secondary Actions */}
              <motion.div
                {...support(0.94)}
                className="mt-7 sm:mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
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
                {...support(1.02)}
                className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-muted"
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
