import { useState } from "react";
import { Code, Cpu, Database, Globe, Wrench } from "lucide-react";
import { skillGroups } from "../data";
import type { SkillGroup } from "../data";

type SkillsProps = {
  onHoverGroup?: (projectIds: string[] | null) => void;
};

const categoryIcons: Record<string, typeof Code> = {
  "Frontend Development": Globe,
  "Backend & APIs":       Database,
  "Databases & Cloud":    Database,
  "Mobile & Capstone":    Cpu,
  "Development Tools":    Wrench,
};

const projectLabel: Record<string, string> = {
  "event-tracker": "Event Tracker",
  "palengkehub":   "PalengkeHub",
  "auto-avenue":   "Auto Avenue",
};

export default function Skills({ onHoverGroup }: SkillsProps) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  function handleMouseEnter(group: SkillGroup) {
    setActiveGroup(group.label);
    onHoverGroup?.(group.relatedProjectIds);
  }

  function handleMouseLeave() {
    setActiveGroup(null);
    onHoverGroup?.(null);
  }

  return (
    <section id="skills" className="py-20 lg:py-28 border-b border-black/5 dark:border-white/5 bg-transparent transition-colors duration-300">
      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10">

        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            Technical Foundations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Technical Competencies
          </h2>
          <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">
            Technologies and workflows applied across independent web projects, collaborative
            capstone software, and academic coursework. Hover over any category to see where it
            powers my work.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => {
            const Icon    = categoryIcons[group.label] || Code;
            const isHovered = activeGroup === group.label;

            return (
              <div
                key={group.label}
                onMouseEnter={() => handleMouseEnter(group)}
                onMouseLeave={handleMouseLeave}
                className={`rounded-2xl border transition-all duration-200 p-6 flex flex-col bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md ${
                  isHovered
                    ? "border-ink shadow-[0_12px_36px_-4px_rgb(0_0_0/0.12)] dark:shadow-[0_12px_36px_-4px_rgb(0_0_0/0.5)] -translate-y-0.5"
                    : "border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-black/20 dark:hover:border-white/20"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-black/5 dark:border-white/5">
                  <span className="p-2 rounded-xl bg-surface-strong border border-black/5 dark:border-white/10 text-ink">
                    <Icon size={16} />
                  </span>
                  <h3 className="font-display text-sm font-semibold text-ink">
                    {group.label}
                  </h3>
                </div>

                <p className="text-xs text-muted leading-relaxed mb-5">
                  {group.description}
                </p>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2 flex-1 content-start">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors font-medium ${
                        isHovered
                          ? "bg-ink text-cta-primary-text border-ink"
                          : "bg-surface-strong border-black/5 dark:border-white/10 text-ink"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Footer — project links */}
                <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/5 text-xs text-muted flex items-center justify-between">
                  <span className="font-medium">Applied in</span>
                  <span className="text-ink font-semibold">
                    {group.relatedProjectIds.map((id) => projectLabel[id] ?? id).join(", ")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
