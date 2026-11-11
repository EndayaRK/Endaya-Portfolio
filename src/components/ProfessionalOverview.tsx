import { motion, useReducedMotion } from "framer-motion";
import { professionalOverview } from "../data";

const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

export default function ProfessionalOverview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="overview"
      className="border-b border-black/5 dark:border-white/5 bg-transparent transition-colors duration-300 py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10 space-y-12 sm:space-y-16">
        {/* Editorial Section Masthead */}
        <motion.div
          initial={{
            opacity: shouldReduceMotion ? 1 : 0,
            y: shouldReduceMotion ? 0 : 16,
          }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.55,
            ease: EASE_OUT_QUART,
          }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-ink" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted">
                Foundational Pillars &amp; Core Disciplines
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
              Engineering Principles
            </h2>
          </div>
          <p className="text-sm sm:text-base text-muted max-w-md leading-relaxed font-normal">
            A disciplined full-stack approach connecting reactive client interfaces directly to
            resilient runtime services and persistent schemas.
          </p>
        </motion.div>

        {/* ── Asymmetric Typographic Ledger / Editorial Spread (ZERO BOXES) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-12 sm:gap-y-14">
          {professionalOverview.map((item, idx) => (
            <motion.article
              key={item.index}
              initial={{
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : 20,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                delay: shouldReduceMotion ? 0 : idx * 0.08,
                ease: EASE_OUT_QUART,
              }}
              className="py-8 sm:py-9 border-t border-black/10 dark:border-white/10 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Subtle Monospace Numbering & Label */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-semibold">
                    {item.index}
                  </span>
                  <span className="text-neutral-300 dark:text-neutral-700">/</span>
                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-semibold">
                    {item.label}
                  </span>
                </div>

                {/* Large Editorial Headline */}
                <h3 className="font-display text-2xl sm:text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-ink transition-colors">
                  {item.statement}
                </h3>
              </div>

              {/* Clean Technical Annotation */}
              <div className="space-y-4 pt-1">
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                  {item.description}
                </p>

                {/* Technical Stack Annotation */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-neutral-400 dark:text-neutral-500 pt-2 border-t border-black/5 dark:border-white/5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="hover:text-ink transition-colors">
                      · {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
