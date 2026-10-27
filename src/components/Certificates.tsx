import { useEffect, useMemo, useState } from "react";
import { Award, CheckCircle, ExternalLink, FileText, Filter, GraduationCap, ShieldCheck, X } from "lucide-react";
import { certificates } from "../data";
import type { Certificate } from "../data";

export default function Certificates() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(certificates.map((c) => c.category)))],
    []
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<Certificate | null>(null);

  const visibleCertificates =
    activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);

  useEffect(() => {
    if (!selected) return;
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <section id="certificates" className="py-20 lg:py-28 border-b border-border bg-bg">
      <div className="max-w-site mx-auto px-6 md:px-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
              Verified Qualifications
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Certificates & Honors
            </h2>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-xl leading-relaxed">
              Official academic recognitions and verified technical coursework certifications earned
              during my BSIT degree. Click any credential to inspect details or view official
              documents.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted flex items-center gap-1.5">
              <Filter size={12} />
              Category
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold rounded-full px-3.5 py-1.5 border transition-all ${
                  activeCategory === cat
                    ? "border-ink bg-ink text-cta-primary-text shadow-sm"
                    : "border-border bg-surface text-muted hover:text-ink hover:border-ink/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Certificate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {visibleCertificates.map((cert) => (
            <button
              key={cert.id}
              type="button"
              onClick={() => setSelected(cert)}
              className="text-left rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between transition-all duration-200 hover:border-ink/40 hover:-translate-y-1 hover:shadow-[0_8px_24px_-8px_rgb(0_0_0/0.10)] dark:hover:shadow-[0_8px_24px_-8px_rgb(0_0_0/0.4)] group"
            >
              <div>
                {/* Image / Fallback */}
                <div className="aspect-[16/10] rounded-xl bg-surface-strong border border-border flex items-center justify-center p-2.5 relative overflow-hidden transition-colors">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-contain rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-full bg-surface border border-border text-ink flex items-center justify-center mb-2">
                        {cert.category === "Academic Honors" ? (
                          <GraduationCap size={24} />
                        ) : (
                          <Award size={24} />
                        )}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        {cert.issuer}
                      </span>
                      {cert.grade && (
                        <span className="text-[11px] font-bold text-ink mt-1 bg-surface border border-border px-2 py-0.5 rounded-md">
                          {cert.grade}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Category badge */}
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold bg-surface/90 border border-border px-2 py-0.5 rounded-md text-muted backdrop-blur-sm shadow-sm">
                    {cert.category}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-ink mt-4 group-hover:opacity-75 transition-opacity">
                  {cert.title}
                </h3>
                <p className="text-xs text-muted mt-1">{cert.issuer}</p>

                {cert.description && (
                  <p className="text-xs text-muted mt-3 line-clamp-2 leading-relaxed">
                    {cert.description}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                <span className="font-medium">{cert.date}</span>
                <span className="font-semibold text-ink group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  Inspect <ExternalLink size={11} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Credential Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-overlay/75 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden animate-[fadeUp_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-strong">
              <span className="text-xs font-semibold text-muted flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-ink" />
                Credential · {selected.category}
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-ink hover:bg-surface-strong transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="aspect-[16/10] rounded-xl bg-surface-strong border border-border flex items-center justify-center overflow-hidden p-3">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-surface border border-border text-ink flex items-center justify-center mx-auto mb-3">
                      {selected.category === "Academic Honors" ? (
                        <GraduationCap size={32} />
                      ) : (
                        <Award size={32} />
                      )}
                    </div>
                    <p className="font-display text-sm font-semibold text-ink">
                      Official Institutional Recognition
                    </p>
                    <p className="text-xs text-muted mt-0.5">{selected.issuer}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-ink">{selected.title}</h3>
                <p className="text-xs text-muted mt-1">
                  Issued by <span className="font-semibold text-ink">{selected.issuer}</span> · {selected.date}
                </p>

                {selected.grade && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs bg-surface-strong border border-border text-ink px-3 py-1.5 rounded-lg font-semibold">
                    <CheckCircle size={13} />
                    Academic Grade: {selected.grade}
                  </div>
                )}

                {selected.description && (
                  <p className="text-sm text-muted mt-4 leading-relaxed border-t border-border pt-3">
                    {selected.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-border">
                  {selected.pdfUrl && (
                    <a
                      href={selected.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-cta-primary-text bg-cta-primary hover:opacity-85 px-4 py-2.5 rounded-full transition-opacity shadow-sm"
                    >
                      <FileText size={14} />
                      View PDF
                      <ExternalLink size={12} />
                    </a>
                  )}

                  {selected.image && (
                    <a
                      href={selected.image}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-ink bg-surface border border-border hover:bg-surface-strong px-4 py-2.5 rounded-full transition-colors"
                    >
                      Open Full Image
                      <ExternalLink size={12} />
                    </a>
                  )}

                  {selected.credentialUrl && (
                    <a
                      href={selected.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-muted border border-border hover:text-ink hover:border-ink/40 px-4 py-2.5 rounded-full transition-colors"
                    >
                      Verify Online
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border bg-surface-strong text-xs text-muted flex items-center justify-between">
              <span>Press ESC to close</span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="font-medium text-ink hover:underline transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
