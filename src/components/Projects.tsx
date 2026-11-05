import { useMemo, useState } from "react";
import { ArrowUpRight, Filter, Github } from "lucide-react";
import { projects } from "../data";
import ProjectPreview from "./ProjectPreview";
import PalengkeHubSimulator from "./PalengkeHubSimulator";

type ProjectsProps = {
  highlightedProjectId?: string | null;
};

export default function Projects({ highlightedProjectId }: ProjectsProps) {
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");

  const visibleProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const showPalengkeHubShowcase =
    activeCategory === "All" || activeCategory === "Mobile & Capstone";

  // Grid projects exclude PalengkeHub (since it is showcased in the primary 2-column interactive simulator)
  const gridProjects = useMemo(() => {
    if (activeCategory === "All" || activeCategory === "Mobile & Capstone") {
      return visibleProjects.filter((p) => p.id !== "palengkehub");
    }
    return visibleProjects;
  }, [activeCategory, visibleProjects]);

  return (
    <section
      id="projects"
      className="py-20 lg:py-28 border-b border-black/5 dark:border-white/5 bg-band-secondary/70 transition-colors duration-300"
    >
      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/5 dark:border-white/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
              Evidence of Production Ability
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Selected Work
            </h2>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-xl leading-relaxed">
              Full-stack applications and collaborative systems built from concept to production.
              Each project reflects concrete engineering decisions and type-safe architecture.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted flex items-center gap-1.5">
              <Filter size={12} />
              Filter
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold rounded-full px-3.5 py-1.5 border transition-all ${
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

        {/* ── #1 FEATURED FLAGSHIP SHOWCASE: PALENGKEHUB INTERACTIVE SIMULATOR ── */}
        {showPalengkeHubShowcase && (
          <div className="mt-12">
            <PalengkeHubSimulator
              isHighlighted={highlightedProjectId === "palengkehub"}
            />
          </div>
        )}

        {/* ── GRID PROJECTS: EVENT TRACKER & AUTO AVENUE ── */}
        {gridProjects.length > 0 && (
          <div className={showPalengkeHubShowcase ? "mt-16" : "mt-12"}>
            {activeCategory === "All" ? (
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-ink">
                    Additional Production Systems
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Full-stack web applications, supplier portals, and type-safe database architectures.
                  </p>
                </div>
                <span className="text-xs font-mono text-muted">
                  {gridProjects.length} systems
                </span>
              </div>
            ) : (
              <div className="mb-6 text-xs text-muted font-medium">
                Showing {gridProjects.length} project(s) in{" "}
                <span className="text-ink font-semibold">{activeCategory}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {gridProjects.map((project) => (
                <article
                  key={project.id}
                  id={project.id}
                  className={`rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md ${
                    highlightedProjectId === project.id
                      ? "border-ink shadow-[0_12px_36px_-6px_rgb(0_0_0/0.12)] dark:shadow-[0_12px_36px_-6px_rgb(0_0_0/0.6)] ring-2 ring-ink"
                      : "border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  <div>
                    {/* Card meta */}
                    <div className="flex items-center justify-between text-xs text-muted mb-4 pb-3 border-b border-black/5 dark:border-white/5 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-ink font-semibold">{project.version}</span>
                        <span className="text-muted/40">·</span>
                        <span>{project.dateRange}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md border border-black/5 dark:border-white/10 bg-surface-strong text-[10px] font-semibold text-muted">
                        {project.category}
                      </span>
                    </div>

                    <ProjectPreview
                      variant={project.previewVariant}
                      label={`${project.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.app`}
                      liveUrl={project.liveUrl}
                    />

                    <h3 className="font-display text-xl font-bold text-ink mt-5">
                      {project.title}
                    </h3>
                    <p className="text-xs font-medium text-muted mt-0.5">Role: {project.role}</p>

                    <p className="text-xs sm:text-sm text-muted mt-3 leading-relaxed">
                      {project.summary}
                    </p>

                    <ul className="mt-4 space-y-1.5 text-xs text-muted">
                      {project.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <span className="text-ink mt-0.5 select-none font-bold">―</span>
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                    {/* Stack pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-medium text-muted bg-surface-strong border border-black/5 dark:border-white/10 rounded-md px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cta-primary-text bg-cta-primary hover:opacity-85 rounded-full px-4 py-2 transition-opacity shadow-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cta-primary-text/60 animate-[pulseSoft_2.5s_ease-in-out_infinite]" />
                          Live App
                          <ArrowUpRight size={12} />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink bg-white/80 dark:bg-[#18181C]/80 border border-black/5 dark:border-white/10 rounded-full px-3.5 py-2 transition-colors shadow-xs"
                        >
                          <Github size={13} />
                          Repository
                          <ArrowUpRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
