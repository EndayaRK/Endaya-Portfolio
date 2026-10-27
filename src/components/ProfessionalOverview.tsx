import { professionalOverview } from "../data";

export default function ProfessionalOverview() {
  return (
    <section id="overview" className="border-b border-border bg-bg">
      <div className="max-w-site mx-auto px-6 md:px-10 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {professionalOverview.map((item) => (
            <div
              key={item.index}
              className="flex flex-col justify-between p-5 rounded-2xl border border-border bg-surface hover:border-ink/30 hover:bg-surface transition-all duration-200"
            >
              <div>
                {/* Index + Label */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
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
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-muted bg-surface-strong border border-border rounded-md px-2 py-0.5"
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
