import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Filter, Github, Sparkles } from "lucide-react";
import { projects } from "../data";
import ProjectPreview from "./ProjectPreview";

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

  const featuredProject = projects.find((p) => p.featured) ?? projects[0];
  const otherProjects   = visibleProjects.filter((p) => !p.featured || activeCategory !== "All");

  return (
    <section id="projects" className="py-20 lg:py-28 border-b border-black/5 dark:border-white/5 bg-band-secondary/70 transition-colors duration-300">
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

        {/* Featured Project */}
        {activeCategory === "All" && featuredProject && (
          <div
            className={`mt-12 rounded-2xl border transition-all duration-300 p-6 sm:p-8 lg:p-10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md ${
              highlightedProjectId === featuredProject.id
                ? "border-ink shadow-[0_12px_36px_-6px_rgb(0_0_0/0.12)] dark:shadow-[0_12px_36px_-6px_rgb(0_0_0/0.6)]"
                : "border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-black/20 dark:hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/5 dark:border-white/5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink text-cta-primary-text font-semibold">
                  <Sparkles size={11} />
                  Featured
                </span>
                <span className="text-muted/40">·</span>
                <span className="font-medium text-muted">{featuredProject.version}</span>
                <span className="text-muted/40">·</span>
                <span className="text-muted">{featuredProject.dateRange}</span>
              </div>
              <span className="text-xs text-muted hidden sm:inline font-medium">
                {featuredProject.type}
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Preview */}
              <div className="lg:col-span-6">
                <ProjectPreview
                  variant={featuredProject.previewVariant}
                  label="event-tracker-endayark.vercel.app"
                  liveUrl={featuredProject.liveUrl}
                />
              </div>

              {/* Details */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    {featuredProject.title}
                  </h3>
                  <p className="text-xs font-medium text-muted mt-1">
                    Role: {featuredProject.role}
                  </p>

                  <p className="text-sm sm:text-[15px] leading-relaxed text-muted mt-4">
                    {featuredProject.summary}
                  </p>

                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-semibold text-ink">Implementation Contributions</p>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-muted">
                      {featuredProject.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <span className="text-ink mt-0.5 font-bold select-none">―</span>
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5">
                  {/* Stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {featuredProject.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium text-muted bg-surface-strong border border-black/5 dark:border-white/10 rounded-md px-2.5 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {featuredProject.liveUrl && (
                      <a
                        href={featuredProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-cta-primary-text bg-cta-primary hover:opacity-85 rounded-full px-5 py-2.5 transition-opacity shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cta-primary-text/60 animate-[pulseSoft_2.5s_ease-in-out_infinite]" />
                        Live App
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                    {featuredProject.repoUrl && (
                      <a
                        href={featuredProject.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink bg-white/80 dark:bg-[#18181C]/80 border border-black/5 dark:border-white/10 hover:bg-surface-strong rounded-full px-4 py-2.5 transition-colors"
                      >
                        <Github size={14} />
                        Repository
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                    <span className="text-xs text-muted flex items-center gap-1.5 ml-auto font-medium">
                      <Check size={13} />
                      Live Production Deployment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Projects Grid */}
        <div className="mt-12">
          {activeCategory !== "All" && (
            <div className="mb-6 text-xs text-muted font-medium">
              Showing {visibleProjects.length} project(s) in{" "}
              <span className="text-ink font-semibold">{activeCategory}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {otherProjects.map((project) => (
              <article
                key={project.id}
                className={`rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md ${
                  highlightedProjectId === project.id
                    ? "border-ink shadow-[0_12px_36px_-6px_rgb(0_0_0/0.12)] dark:shadow-[0_12px_36px_-6px_rgb(0_0_0/0.6)]"
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
                        <span className="text-ink mt-0.5 select-none">―</span>
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:underline underline-offset-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-ink/60 animate-[pulseSoft_2.5s_ease-in-out_infinite]" />
                        Live App
                        <ArrowUpRight size={12} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors"
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
      </div>
    </section>
  );
}
