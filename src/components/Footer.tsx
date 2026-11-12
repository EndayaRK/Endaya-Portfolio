import type { MouseEvent } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "../data";
import { EASE_OUT_EXPO, scrollToSection } from "../motion";

type FooterProps = {
  onCopyEmail: () => void;
  emailCopied: boolean;
};

const footerNavLinks = [
  { label: "About", id: "overview" },
  { label: "Work", id: "projects" },
  { label: "Process", id: "skills" },
  { label: "Credentials", id: "certificates" },
];

export default function Footer({ onCopyEmail, emailCopied }: FooterProps) {
  const reduce = useReducedMotion() ?? false;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  function handleNavClick(e: MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    scrollToSection(id);
  }

  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-black/8 dark:border-white/8 bg-band-secondary/70 transition-colors duration-300"
    >
      {/* Wider responsive container for balanced full-width editorial composition */}
      <div className="max-w-[84rem] mx-auto px-6 md:px-12 lg:px-16 pt-24 lg:pt-36 pb-12 lg:pb-16 relative z-10">
        {/* ── 1. Two-Column Editorial Introduction ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* LEFT: Section Label & Editorial Headline */}
          <div className="lg:col-span-7">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: reduce ? 0 : 0.65,
                ease: EASE_OUT_EXPO,
              }}
              className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted"
            >
              CONTACT
            </motion.p>

            <motion.h2
              id="contact-heading"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: reduce ? 0 : 0.78,
                delay: reduce ? 0 : 0.06,
                ease: EASE_OUT_EXPO,
              }}
              className="font-display text-[clamp(2.35rem,4.8vw,4.35rem)] font-semibold text-ink tracking-[-0.032em] leading-[1.06]"
            >
              <span className="block">Let&apos;s make</span>
              <span className="block">something useful.</span>
            </motion.h2>
          </div>

          {/* RIGHT: Restrained Editorial Availability & Secondary Context */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: reduce ? 0 : 0.78,
              delay: reduce ? 0 : 0.14,
              ease: EASE_OUT_EXPO,
            }}
            className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-black/10 dark:lg:border-white/10 space-y-3"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block">
              Availability
            </span>
            <p className="font-body text-base sm:text-[17px] text-muted leading-[1.68]">
              I&apos;m currently open to{" "}
              <span className="text-ink font-medium">
                internship and OJT opportunities
              </span>
              , with flexibility for{" "}
              <span className="text-ink font-medium">
                remote or onsite arrangements
              </span>
              .
            </p>
          </motion.div>
        </div>

        {/* ── 2. Primary Email Area (Most Prominent Element) ── */}
        <div className="mt-16 lg:mt-24">
          {/* Animated Top Divider */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: reduce ? 0 : 0.85,
              delay: reduce ? 0 : 0.16,
              ease: EASE_OUT_EXPO,
            }}
            className="h-px w-full bg-black/10 dark:bg-white/10 origin-left"
          />

          <div className="py-12 lg:py-16 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div className="space-y-3 min-w-0">
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: reduce ? 0 : 0.6,
                  delay: reduce ? 0 : 0.18,
                  ease: EASE_OUT_EXPO,
                }}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted block"
              >
                Direct Email
              </motion.span>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: reduce ? 0 : 0.78,
                  delay: reduce ? 0 : 0.22,
                  ease: EASE_OUT_EXPO,
                }}
                className="pb-1"
              >
                <a
                  href={`mailto:${profile.email}`}
                  className="group relative inline-block max-w-full font-display text-[clamp(1.45rem,3.8vw,3.35rem)] font-semibold text-ink tracking-[-0.03em] leading-[1.12] break-all sm:break-normal"
                >
                  <span>{profile.email}</span>
                  <span
                    aria-hidden="true"
                    className="block h-[2px] w-full bg-ink/20 mt-2 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-ink origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  </span>
                </a>
              </motion.div>
            </div>

            {/* Functional Actions: Copy Email & Open Mail Client */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: reduce ? 0 : 0.72,
                delay: reduce ? 0 : 0.26,
                ease: EASE_OUT_EXPO,
              }}
              className="flex flex-wrap items-center gap-3.5 sm:gap-4 shrink-0"
            >
              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium px-6 py-3.5 rounded-full bg-cta-primary text-cta-primary-text hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
              >
                {emailCopied ? (
                  <>
                    <Check size={15} strokeWidth={2.25} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-6 py-3.5 rounded-full border border-black/15 dark:border-white/15 text-ink hover:border-ink dark:hover:border-white transition-colors"
              >
                <span>Open Mail Client</span>
                <ArrowUpRight
                  size={14}
                  className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </a>
            </motion.div>
          </div>

          {/* Animated Bottom Divider */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: reduce ? 0 : 0.9,
              delay: reduce ? 0 : 0.34,
              ease: EASE_OUT_EXPO,
            }}
            className="h-px w-full bg-black/10 dark:bg-white/10 origin-left"
          />
        </div>

        {/* ── 3. Structured 4-Column Horizontal Contact Information Layout ── */}
        <div className="pt-10 lg:pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          {/* GitHub */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: reduce ? 0 : 0.68,
              delay: reduce ? 0 : 0.38,
              ease: EASE_OUT_EXPO,
            }}
            className="space-y-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block">
              GitHub
            </span>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 font-display text-sm sm:text-base font-medium text-ink"
            >
              <span className="relative">
                github.com/EndayaRK
                <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <ArrowUpRight
                size={14}
                className="text-muted group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </a>
          </motion.div>

          {/* LinkedIn */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: reduce ? 0 : 0.68,
              delay: reduce ? 0 : 0.44,
              ease: EASE_OUT_EXPO,
            }}
            className="space-y-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block">
              LinkedIn
            </span>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 font-display text-sm sm:text-base font-medium text-ink"
            >
              <span className="relative">
                Rhon Kelly Endaya
                <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <ArrowUpRight
                size={14}
                className="text-muted group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </a>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: reduce ? 0 : 0.68,
              delay: reduce ? 0 : 0.5,
              ease: EASE_OUT_EXPO,
            }}
            className="space-y-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block">
              Phone
            </span>
            <a
              href={`tel:${profile.phone.replace(/\s+/g, "")}`}
              className="group inline-flex items-center gap-1.5 font-mono text-sm sm:text-[15px] text-ink/90 hover:text-ink transition-colors"
            >
              <span className="relative">
                {profile.phone}
                <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </a>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: reduce ? 0 : 0.68,
              delay: reduce ? 0 : 0.56,
              ease: EASE_OUT_EXPO,
            }}
            className="space-y-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block">
              Location
            </span>
            <p className="font-body text-sm sm:text-[15px] text-muted">
              {profile.location}
            </p>
          </motion.div>
        </div>

        {/* ── 4. Connected Minimal Footer Bar ── */}
        <div className="mt-20 lg:mt-28 pt-8 border-t border-black/8 dark:border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-muted">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] text-ink font-medium">
              © {new Date().getFullYear()} {profile.name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center gap-x-5 gap-y-1"
            >
              {footerNavLinks.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="hover:text-ink transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <span
              className="hidden sm:inline-block h-3 w-px bg-black/15 dark:bg-white/15"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp
                size={12}
                className="group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
