import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { profile } from "../data";
import HeroPhoto from "./HeroPhoto";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 border-b border-black/5 dark:border-white/5 bg-transparent transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ── Left Column: Staggered Text Reveal Container ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Status Pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6 self-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-[pulseSoft_2.5s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full bg-ink opacity-30" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ink" />
              </span>
              <span className="text-xs font-medium text-muted tracking-wide">
                Available for IT Roles
              </span>
            </motion.div>

            {/* H1 Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-ink"
            >
              Building full-stack software,{" "}
              <span className="text-muted">from interface to implementation.</span>
            </motion.h1>

            {/* Bio Paragraph */}
            <motion.p
              variants={itemVariants}
              className="font-body text-base sm:text-[17px] text-muted mt-6 leading-relaxed max-w-xl"
            >
              Fourth-year IT student at De La Salle Lipa specializing in System Development. I build
              scalable web and mobile applications using React, TypeScript, Node.js, Express, and PHP.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mt-8">
              {/* Primary CTA with Shimmer sweep: "Explore Projects ↓" */}
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative group overflow-hidden inline-flex items-center gap-2 text-sm font-semibold text-[#FFFFFF] dark:text-[#0A0A0C] bg-[#1A1A18] dark:bg-[#F3F3F5] rounded-full px-6 py-3.5 shadow-sm"
              >
                <span
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none -translate-x-full group-hover:animate-shimmer"
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center gap-2">
                  Explore Projects
                  <ArrowDown size={15} strokeWidth={2.5} />
                </span>
              </motion.a>

              {/* Secondary CTA: "Download CV ↓" */}
              <motion.a
                href="/resume.pdf"
                download="Rhon-Kelly-Endaya-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A1A18] dark:text-[#F3F3F5] border border-black/5 dark:border-white/10 bg-[#EFECE6] dark:bg-[#1F1F23] rounded-full px-6 py-3.5 hover:opacity-90 transition-opacity shadow-xs"
              >
                Download CV
                <ArrowDown size={15} strokeWidth={2.5} />
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 pt-6 border-t border-black/5 dark:border-white/5 text-sm text-muted"
            >
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-ink transition-colors font-medium"
              >
                <Github size={14} /> GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-ink transition-colors font-medium"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 hover:text-ink transition-colors font-medium"
              >
                <Mail size={14} /> Email
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Vertically Centered Portrait Aligned with H1 Eyeline ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.15 }}
            className="lg:col-span-5 w-full flex items-center justify-center lg:justify-end"
          >
            <HeroPhoto src="/formalpic.png" name={profile.name} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
