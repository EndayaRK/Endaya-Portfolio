import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Filter,
  GraduationCap,
  ShieldCheck,
  X,
} from "lucide-react";
import { certificates } from "../data";
import type { Certificate } from "../data";

export default function Certificates() {
  // Category list with canonical order
  const categories = useMemo(() => {
    const rawCategories = Array.from(new Set(certificates.map((c) => c.category)));
    const preferredOrder = [
      "All",
      "Programming",
      "IT Support & Operations",
      "Academic Honors",
    ];
    const ordered = preferredOrder.filter((cat) => cat === "All" || rawCategories.includes(cat));
    rawCategories.forEach((cat) => {
      if (!ordered.includes(cat)) ordered.push(cat);
    });
    return ordered;
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Certificate | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScroll = useRef(false);

  const visibleCertificates = useMemo(() => {
    return activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  // Center target card smoothly in viewport
  const scrollToCard = useCallback((index: number, smooth = true) => {
    const container = scrollContainerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    isProgrammaticScroll.current = true;
    setActiveIndex(index);

    const containerWidth = container.clientWidth;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.clientWidth;
    const targetScrollLeft = cardLeft - containerWidth / 2 + cardWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: smooth ? "smooth" : "auto",
    });

    const timer = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Handle category change: reset to first card
  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setActiveIndex(0);
    window.setTimeout(() => {
      scrollToCard(0, true);
    }, 50);
  };

  // Keep centered on mount and resize
  useEffect(() => {
    const timer = window.setTimeout(() => {
      scrollToCard(activeIndex, false);
    }, 100);

    const onResize = () => {
      scrollToCard(activeIndex, false);
    };

    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [activeIndex, scrollToCard]);

  // Handle manual scroll/touch: determine center card
  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  // Console Keyboard Listener: D-Pad navigation (ArrowLeft / ArrowRight) & Action (Enter / Space / X)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // If modal is open, let Escape close it
      if (selected) {
        if (e.key === "Escape") setSelected(null);
        return;
      }

      // Check if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = Math.max(0, activeIndex - 1);
        scrollToCard(prev, true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = Math.min(visibleCertificates.length - 1, activeIndex + 1);
        scrollToCard(next, true);
      } else if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "x") {
        if (visibleCertificates[activeIndex]) {
          e.preventDefault();
          setSelected(visibleCertificates[activeIndex]);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, activeIndex, visibleCertificates, scrollToCard]);

  return (
    <section
      id="certificates"
      className="py-20 lg:py-28 border-b border-black/5 dark:border-white/5 bg-[#F3EFEA] dark:bg-[#121216] relative transition-colors duration-300 overflow-hidden select-none"
    >
      {/* ── Background Sine Wave (Authentic PSP XMB Wave hommage) ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center opacity-[0.03] dark:opacity-[0.04]"
        aria-hidden="true"
      >
        <div className="w-[200%] h-full flex items-center animate-psp-wave transform-gpu">
          <svg
            className="w-full h-80 sm:h-96 text-ink"
            viewBox="0 0 2400 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Primary Flowing Sine Ribbon */}
            <path
              d="M0 160 C 300 60, 600 260, 900 160 C 1200 60, 1500 260, 1800 160 C 2100 60, 2400 260, 2700 160"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Secondary Harmonious Wave */}
            <path
              d="M0 180 C 350 270, 650 90, 950 180 C 1250 270, 1550 90, 1850 180 C 2150 270, 2450 90, 2750 180"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="8 6"
            />
            {/* Ambient Base Ribbon */}
            <path
              d="M0 140 C 400 80, 700 230, 1100 140 C 1500 50, 1800 240, 2200 140 C 2600 40, 2900 240, 3300 140"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-site mx-auto px-6 md:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/5 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Console XMB · Verified Credentials
              </p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Certificates & Honors
            </h2>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-xl leading-relaxed">
              Official academic recognitions and verified technical coursework certifications earned
              during my BSIT degree. Click any credential to inspect details or view official documents.
            </p>
          </div>

          {/* Category Filter Rail */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted flex items-center gap-1.5 mr-1">
              <Filter size={12} />
              Filter
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`text-xs font-semibold rounded-full px-4 py-1.5 border transition-all duration-200 ${
                    isActive
                      ? "border-ink bg-ink text-cta-primary-text shadow-sm scale-[1.02]"
                      : "border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#16161A]/80 backdrop-blur-md text-muted hover:text-ink hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Console Ribbon Carousel (UMD Cover Flow) ── */}
      <div className="relative mt-10 w-full overflow-hidden">
        {/* Hardware-Inspired D-Pad Navigation Buttons (< and >) */}
        <button
          type="button"
          onClick={() => scrollToCard(Math.max(0, activeIndex - 1), true)}
          disabled={activeIndex === 0}
          aria-label="Previous certificate (ArrowLeft)"
          className={`absolute left-3 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-[#18181C]/90 backdrop-blur-md shadow-lg text-ink flex items-center justify-center transition-all ${
            activeIndex === 0
              ? "opacity-20 cursor-not-allowed"
              : "hover:scale-110 active:scale-95 hover:bg-white dark:hover:bg-[#202026] hover:border-black/30 dark:hover:border-white/30"
          }`}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={() =>
            scrollToCard(Math.min(visibleCertificates.length - 1, activeIndex + 1), true)
          }
          disabled={activeIndex === visibleCertificates.length - 1}
          aria-label="Next certificate (ArrowRight)"
          className={`absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-[#18181C]/90 backdrop-blur-md shadow-lg text-ink flex items-center justify-center transition-all ${
            activeIndex === visibleCertificates.length - 1
              ? "opacity-20 cursor-not-allowed"
              : "hover:scale-110 active:scale-95 hover:bg-white dark:hover:bg-[#202026] hover:border-black/30 dark:hover:border-white/30"
          }`}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>

        {/* Horizontal Console Scroll Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory py-10 px-[15vw] sm:px-[25vw] lg:px-[33vw] scrollbar-none scroll-smooth focus:outline-none"
          tabIndex={0}
          aria-label="Certificates Cover Flow"
        >
          {visibleCertificates.map((cert, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={cert.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onClick={() => {
                  if (isActive) {
                    setSelected(cert);
                  } else {
                    scrollToCard(index, true);
                  }
                }}
                className={`snap-center flex-shrink-0 transition-all duration-300 transform-gpu cursor-pointer ${
                  isActive
                    ? "scale-105 z-20 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)] bg-white/90 dark:bg-[#16161A]/95 backdrop-blur-xl border border-black/10 dark:border-white/20 rounded-2xl p-4 sm:p-5 min-w-[320px] sm:min-w-[440px] max-w-[460px]"
                    : "scale-90 z-10 opacity-30 blur-[0.5px] hover:opacity-60 bg-white/70 dark:bg-[#16161A]/80 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-2xl p-4 sm:p-5 min-w-[320px] sm:min-w-[440px] max-w-[460px]"
                }`}
              >
                {/* Visual Media Header */}
                <div className="aspect-[16/10] rounded-xl bg-surface-strong border border-black/5 dark:border-white/10 flex items-center justify-center p-2.5 relative overflow-hidden transition-colors">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-full bg-surface border border-black/5 dark:border-white/10 text-ink flex items-center justify-center mb-2">
                        {cert.category === "Academic Honors" ? (
                          <GraduationCap size={24} />
                        ) : (
                          <Award size={24} />
                        )}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        {cert.issuer}
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold bg-white/85 dark:bg-[#18181C]/90 border border-black/5 dark:border-white/10 px-2.5 py-0.5 rounded-md text-muted backdrop-blur-sm shadow-xs">
                    {cert.category}
                  </span>

                  {/* Active UMD Indicator */}
                  {isActive && (
                    <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono font-semibold tracking-wider bg-black/70 dark:bg-white/15 text-white px-2 py-0.5 rounded backdrop-blur-md">
                      UMD #{String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Credential Meta */}
                <div className="mt-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base sm:text-lg font-bold text-ink tracking-tight line-clamp-1">
                      {cert.title}
                    </h3>
                    {cert.grade && (
                      <span className="text-[11px] font-bold text-ink shrink-0 bg-surface-strong border border-black/5 dark:border-white/10 px-2 py-0.5 rounded-md">
                        {cert.grade}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted mt-1 font-medium">{cert.issuer}</p>

                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-muted">
                    <span className="font-mono">{cert.date}</span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold transition-colors ${
                        isActive ? "text-ink underline" : "text-muted"
                      }`}
                    >
                      Inspect
                      <ExternalLink size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail Modal Dialog (Preserved Verification Overlay) ── */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#141416]/98 backdrop-blur-xl shadow-2xl overflow-hidden animate-[fadeUp_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <ShieldCheck size={14} />
                <span>Verified Credential</span>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center text-muted hover:text-ink hover:bg-surface-strong transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="aspect-[16/10] rounded-xl bg-surface-strong border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden p-3">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-surface border border-black/5 dark:border-white/10 text-ink flex items-center justify-center mx-auto mb-3">
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
                <h3 id="cert-modal-title" className="font-display text-xl font-bold text-ink">
                  {selected.title}
                </h3>
                <p className="text-xs text-muted mt-1">
                  Issued by <span className="font-semibold text-ink">{selected.issuer}</span> ·{" "}
                  {selected.date}
                </p>

                {selected.grade && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs bg-surface-strong border border-black/5 dark:border-white/10 text-ink px-3 py-1.5 rounded-lg font-semibold">
                    <CheckCircle size={13} />
                    Academic Grade: {selected.grade}
                  </div>
                )}

                {selected.description && (
                  <p className="text-sm text-muted mt-4 leading-relaxed border-t border-black/5 dark:border-white/5 pt-3">
                    {selected.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
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
                      className="inline-flex items-center gap-2 text-xs font-medium text-ink bg-white/80 dark:bg-[#18181C]/80 border border-black/5 dark:border-white/10 hover:bg-surface-strong px-4 py-2.5 rounded-full transition-colors"
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
                      className="inline-flex items-center gap-2 text-xs font-semibold text-ink bg-surface-strong border border-black/5 dark:border-white/10 hover:border-black/20 px-4 py-2.5 rounded-full transition-colors"
                    >
                      Verify Credential
                      <ExternalLink size={12} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="ml-auto text-xs font-medium text-muted hover:text-ink px-3 py-2 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}