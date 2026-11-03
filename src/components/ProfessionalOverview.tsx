import { professionalOverview } from "../data";

export default function ProfessionalOverview() {
  return (
    <section id="overview" className="border-b border-black/5 dark:border-white/5 bg-transparent transition-colors duration-300">
      <div className="max-w-site mx-auto px-6 md:px-10 py-10 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {professionalOverview.map((item) => (
            <div
              key={item.index}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-black/20 dark:hover:border-white/20 transition-all duration-200"
            >
              <div>
                {/* Index + Label */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
                  <span className="text-xs font-bold text-ink opacity-40">
                    {item.index}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                    {item.label}
                  </span>
                </div>

                <h3 className="font-display text-sm font-semibold text-ink mt-1">
                  {item.title}
                </h3>

                <p className="text-xs text-muted mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Tags — clean sans-serif pills */}
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-muted bg-surface-strong border border-black/5 dark:border-white/10 rounded-md px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
