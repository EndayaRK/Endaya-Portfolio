import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Database,
  LayoutGrid,
  Server,
  Smartphone,
  Wrench,
} from "lucide-react";

export type TechnicalCompetenciesProps = {
  onHoverGroup?: (projectIds: string[] | null) => void;
};

interface SkillItem {
  name: string;
  projects: string[];
}

interface CompetencyCategory {
  id: string;
  title: string;
  description: string;
  icon: typeof LayoutGrid;
  colSpan: string;
  skills: SkillItem[];
  verifiedProjects: {
    label: string;
    projectId: string;
  }[];
}

const COMPETENCY_DATA: CompetencyCategory[] = [
  {
    id: "frontend",
    title: "Frontend Architecture & Design Systems",
    description:
      "Building fluid, accessible, and reactive user interfaces with strict TypeScript contracts and custom design tokens.",
    icon: LayoutGrid,
    colSpan: "md:col-span-3 lg:col-span-7",
    skills: [
      { name: "React", projects: ["PalengkeHub", "EventPulse"] },
      { name: "TypeScript", projects: ["PalengkeHub", "EventPulse"] },
      { name: "Tailwind CSS", projects: ["PalengkeHub", "EventPulse"] },
      { name: "TanStack Query", projects: ["EventPulse"] },
      { name: "Framer Motion", projects: ["PalengkeHub", "EventPulse"] },
      { name: "Zustand", projects: ["EventPulse"] },
      { name: "Vite", projects: ["PalengkeHub", "EventPulse"] },
    ],
    verifiedProjects: [
      { label: "PalengkeHub", projectId: "palengkehub" },
      { label: "EventPulse", projectId: "event-tracker" },
    ],
  },
  {
    id: "backend",
    title: "Backend Services & Route Architecture",
    description:
      "Architecting RESTful endpoints, role middleware, and strict request-response schemas.",
    icon: Server,
    colSpan: "md:col-span-3 lg:col-span-5",
    skills: [
      { name: "Node.js", projects: ["Auto Avenue IMS", "EventPulse"] },
      { name: "Express.js", projects: ["Auto Avenue IMS", "EventPulse"] },
      { name: "PHP", projects: ["Auto Avenue IMS"] },
      { name: "Zod Validation", projects: ["EventPulse"] },
      { name: "JWT Auth", projects: ["EventPulse"] },
      { name: "REST APIs", projects: ["Auto Avenue IMS", "EventPulse"] },
    ],
    verifiedProjects: [
      { label: "Auto Avenue IMS", projectId: "auto-avenue" },
      { label: "EventPulse", projectId: "event-tracker" },
    ],
  },
  {
    id: "databases",
    title: "Databases & Persistence",
    description:
      "Relational and document schema modeling, migrations, and ORM pipelines.",
    icon: Database,
    colSpan: "md:col-span-2 lg:col-span-4",
    skills: [
      { name: "PostgreSQL", projects: ["PalengkeHub", "Auto Avenue IMS"] },
      { name: "MongoDB", projects: ["EventPulse"] },
      { name: "MySQL", projects: ["Auto Avenue IMS"] },
      { name: "Prisma ORM", projects: ["PalengkeHub"] },
      { name: "Supabase", projects: ["PalengkeHub"] },
    ],
    verifiedProjects: [
      { label: "Auto Avenue IMS", projectId: "auto-avenue" },
      { label: "PalengkeHub", projectId: "palengkehub" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile & Client Runtimes",
    description:
      "Translating responsive design systems into mobile-first web applications and cross-platform views.",
    icon: Smartphone,
    colSpan: "md:col-span-2 lg:col-span-4",
    skills: [
      { name: "React Native", projects: ["PalengkeHub"] },
      { name: "Expo", projects: ["PalengkeHub"] },
      { name: "Mobile UI Architecture", projects: ["PalengkeHub"] },
      { name: "PWA", projects: ["PalengkeHub"] },
    ],
    verifiedProjects: [{ label: "PalengkeHub", projectId: "palengkehub" }],
  },
  {
    id: "tooling",
    title: "Tooling & CI/CD",
    description:
      "Automated pipelines, testing environments, and serverless edge hosting.",
    icon: Wrench,
    colSpan: "md:col-span-2 lg:col-span-4",
    skills: [
      { name: "Git", projects: ["Global", "PalengkeHub", "EventPulse", "Auto Avenue IMS"] },
      { name: "GitHub", projects: ["Global", "PalengkeHub", "EventPulse", "Auto Avenue IMS"] },
      { name: "Vercel Serverless", projects: ["Global", "PalengkeHub", "EventPulse"] },
      { name: "Postman", projects: ["Global", "PalengkeHub", "EventPulse", "Auto Avenue IMS"] },
      { name: "Linux", projects: ["Global", "PalengkeHub", "EventPulse", "Auto Avenue IMS"] },
      { name: "VS Code", projects: ["Global", "PalengkeHub", "EventPulse", "Auto Avenue IMS"] },
    ],
    verifiedProjects: [
      { label: "Global CI/CD", projectId: "event-tracker" },
      { label: "PalengkeHub", projectId: "palengkehub" },
    ],
  },
];

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 180,
      damping: 22,
    },
  },
};

interface BentoCardProps {
  category: CompetencyCategory;
  onHoverGroup?: (projectIds: string[] | null) => void;
}

function BentoCard({ category, onHoverGroup }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoveredProjectLabel, setHoveredProjectLabel] = useState<string | null>(
    null
  );

  const IconComponent = category.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleProjectHover = (projectLabel: string, projectId: string) => {
    setHoveredProjectLabel(projectLabel);
    onHoverGroup?.([projectId]);
  };

  const handleProjectLeave = () => {
    setHoveredProjectLabel(null);
    onHoverGroup?.(null);
  };

  const handleProjectClick = (projectId: string) => {
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    window.dispatchEvent(
      new CustomEvent("select-portfolio-project", { detail: projectId })
    );
  };

  return (
    <motion.div
      variants={cardItemVariants}
      className={`${category.colSpan} relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200 select-none group bg-[#FFFFFF] dark:bg-[#121215] border border-[#EFECE6] dark:border-[#222226] shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)] overflow-hidden`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false);
        setHoveredProjectLabel(null);
      }}
    >
      {/* ── Mouse-Tracking Radial Spotlight Glow ── */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.08), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle Hairline Border Spotlight Accent */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.12), transparent 75%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* ── Card Header: Animated Icon & Category Title ── */}
        <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-[#EFECE6]/80 dark:border-[#222226]/80">
          <motion.div
            animate={
              isCardHovered
                ? { scale: 1.08, rotate: 4 }
                : { scale: 1, rotate: 0 }
            }
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            className="w-10 h-10 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-center justify-center text-[#1A1A18] dark:text-[#F3F3F5] shadow-xs shrink-0"
          >
            <IconComponent size={18} strokeWidth={2.2} />
          </motion.div>

          <h3 className="font-display text-sm sm:text-base font-bold text-[#1A1A18] dark:text-[#F3F3F5] tracking-tight leading-snug">
            {category.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-[#73716B] dark:text-[#8A8A93] leading-relaxed mb-6 font-normal">
          {category.description}
        </p>

        {/* ── Micro-Spring Skill Badges with Cross-Project Dimming ── */}
        <div className="flex flex-wrap gap-2 content-start mb-6">
          {category.skills.map((skill) => {
            const isHighlighted =
              hoveredProjectLabel !== null &&
              skill.projects.includes(hoveredProjectLabel);
            const isDimmed =
              hoveredProjectLabel !== null &&
              !skill.projects.includes(hoveredProjectLabel);

            return (
              <motion.span
                key={skill.name}
                whileHover={{ y: -2, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 cursor-default select-none ${
                  isHighlighted
                    ? "bg-[#1A1A18] dark:bg-[#F3F3F5] text-white dark:text-[#0A0A0C] border-[#1A1A18] dark:border-[#F3F3F5] font-bold shadow-sm"
                    : isDimmed
                    ? "opacity-35 bg-black/[0.01] dark:bg-white/[0.02] border-black/5 dark:border-white/5 text-[#73716B] dark:text-[#8A8A93]"
                    : "bg-black/[0.03] dark:bg-white/[0.04] border-black/5 dark:border-white/[0.08] text-neutral-800 dark:text-neutral-200 hover:border-black/20 dark:hover:border-white/20"
                }`}
              >
                {skill.name}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* ── Card Footer: Verified in Interactive Project Pills ── */}
      <div className="relative z-10 pt-4 border-t border-[#EFECE6]/80 dark:border-[#222226]/80 flex flex-wrap items-center justify-between gap-2.5 text-xs text-[#73716B] dark:text-[#8A8A93]">
        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#73716B] dark:text-[#8A8A93]">
          Verified in:
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {category.verifiedProjects.map((proj) => {
            const isHovered = hoveredProjectLabel === proj.label;

            return (
              <button
                key={proj.label}
                type="button"
                onMouseEnter={() => handleProjectHover(proj.label, proj.projectId)}
                onMouseLeave={handleProjectLeave}
                onClick={() => handleProjectClick(proj.projectId)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isHovered
                    ? "bg-[#1A1A18] dark:bg-[#F3F3F5] text-white dark:text-[#0A0A0C] shadow-xs"
                    : "bg-black/[0.03] dark:bg-white/[0.04] text-[#1A1A18] dark:text-[#F3F3F5] hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/10"
                }`}
              >
                <span>{proj.label}</span>
                <ArrowUpRight size={12} strokeWidth={2.2} />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function TechnicalCompetencies({
  onHoverGroup,
}: TechnicalCompetenciesProps) {
  return (
    <section
      id="skills"
      className="py-20 lg:py-28 border-b border-black/5 dark:border-white/5 bg-transparent transition-colors duration-300"
    >
      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#73716B] dark:text-[#8A8A93] mb-3">
            Technical Foundations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A18] dark:text-[#F3F3F5] tracking-tight">
            Technical Competencies
          </h2>
          <p className="text-sm sm:text-base text-[#73716B] dark:text-[#8A8A93] mt-3 leading-relaxed">
            Technologies and workflows applied across independent web projects,
            collaborative capstone software, and academic coursework. Hover over
            verified projects in each card to trace direct implementation.
          </p>
        </div>

        {/* ── Bento Grid Architecture (5-Card Layout, Zero Empty Holes) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5"
        >
          {COMPETENCY_DATA.map((category) => (
            <BentoCard
              key={category.id}
              category={category}
              onHoverGroup={onHoverGroup}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

