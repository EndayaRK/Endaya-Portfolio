import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data";
import HeroPhoto from "./HeroPhoto";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 border-b border-border bg-bg overflow-hidden"
    >
      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Left Column: Identity & Introduction ── */}
          <div className="lg:col-span-7 flex flex-col justify-center animate-[fadeUp_0.5s_ease-out_both]">

            {/* Availability pill — shown exactly once */}
            <div className="inline-flex items-center gap-2 mb-6 self-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-[pulseSoft_2.5s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full bg-ink opacity-30" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ink" />
              </span>
              <span className="text-xs font-medium text-muted tracking-wide">
                Available for IT Roles
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-ink">
              Building full-stack software,{" "}
              <span className="text-muted">from interface to implementation.</span>
            </h1>

            {/* Refactored Bio */}
            <p className="font-body text-base sm:text-[17px] text-muted mt-6 leading-relaxed max-w-xl">
              Fourth-year IT student at De La Salle Lipa specializing in System Development. I build
              scalable web and mobile applications using React, TypeScript, Node.js, Express, and PHP.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cta-primary-text bg-cta-primary rounded-full px-6 py-3 hover:opacity-85 transition-opacity shadow-sm"
              >
                Explore Projects
                <ArrowDown size={15} strokeWidth={2.5} />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink border border-border bg-surface rounded-full px-6 py-3 hover:bg-surface-strong transition-colors"
              >
                Get in Touch
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </a>
            </div>

            {/* Social Links — clean, no status tag */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 pt-6 border-t border-border text-sm text-muted">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-ink transition-colors font-medium"
              >
                <Github size={14} />
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-ink transition-colors font-medium"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 hover:text-ink transition-colors font-medium"
              >
                <Mail size={14} />
                Email
              </a>
            </div>
          </div>

          {/* ── Right Column: Profile Photo ── */}
          <div className="lg:col-span-5 w-full animate-[fadeUp_0.5s_ease-out_0.2s_both]">
            <HeroPhoto
              src={profile.photo}
              name={profile.name}
              location="Lipa City, PH"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
