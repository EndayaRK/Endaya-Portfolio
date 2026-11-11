import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import ProjectShowcaseStage from "./ProjectShowcaseStage";
import type { ProjectStageItem } from "./ProjectShowcaseStage";
import PalengkeHubSimulator from "./PalengkeHubSimulator";
import EventPulseSimulator from "./EventPulseSimulator";
import AutoAvenueSimulator from "./AutoAvenueSimulator";

type ProjectsProps = {
  highlightedProjectId?: string | null;
};

export default function Projects({ highlightedProjectId }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Mobile & Capstone", "Full-Stack", "Database & Web"];

  // Define the 3 interactive flagship projects for the stage
  const stageProjects: ProjectStageItem[] = useMemo(
    () => [
      {
        id: "palengkehub",
        number: "01",
        title: "PalengkeHub",
        subtitle: "Mobile App",
        category: "Mobile & Capstone",
        domain: "Public Market Platform & Presyo Check",
        tagline: "Lipa City Public Market",
        accentColor: "#D95B16",
        stack: [
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Node.js",
          "Express.js",
          "REST API",
          "Mobile UI",
        ],
        render: (isHighlighted) => (
          <PalengkeHubSimulator isHighlighted={isHighlighted} />
        ),
      },
      {
        id: "event-tracker",
        number: "02",
        title: "EventPulse",
        subtitle: "Campus Web",
        category: "Full-Stack",
        domain: "Campus Operations & Live Event Tracker",
        tagline: "Academic, Sports & Career Hub",
        accentColor: "#6366F1",
        stack: [
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Node.js",
          "Express.js",
          "MongoDB",
          "JWT Authentication",
          "Vercel",
        ],
        render: (isHighlighted) => (
          <EventPulseSimulator isHighlighted={isHighlighted} />
        ),
      },
      {
        id: "auto-avenue",
        number: "03",
        title: "Auto Avenue IMS",
        subtitle: "Enterprise ERP",
        category: "Database & Web",
        domain: "Automotive Inventory & Procurement Engine",
        tagline: "Stock Optimization & Procurement Workflow",
        accentColor: "#144A2A",
        stack: [
          "React",
          "TypeScript",
          "Node.js",
          "Express",
          "MySQL / PostgreSQL",
          "SQL",
          "Tailwind CSS",
        ],
        render: (isHighlighted) => (
          <AutoAvenueSimulator isHighlighted={isHighlighted} />
        ),
      },
    ],
    []
  );

  return (
    <section
      id="projects"
      className="py-20 lg:py-28 border-b border-black/5 dark:border-white/5 bg-band-secondary/70 transition-colors duration-300"
    >
      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
              Evidence of Production Ability
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Selected Work
            </h2>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-xl leading-relaxed">
              Full-stack applications and collaborative systems built from concept to production.
              Operate each working simulator directly in the interactive project stage below.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted flex items-center gap-1.5">
              <Filter size={12} />
              Domain:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold rounded-full px-3.5 py-1.5 border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "border-ink bg-ink text-cta-primary-text shadow-sm"
                    : "border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md text-muted hover:text-ink hover:border-black/20 dark:hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Paginated Project Deck Stage ── */}
        <ProjectShowcaseStage
          projects={stageProjects}
          highlightedProjectId={highlightedProjectId}
          activeCategory={activeCategory}
        />
      </div>
    </section>
  );
}

export { Projects as SelectedWork };
