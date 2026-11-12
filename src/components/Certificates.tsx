import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, TouchEvent as ReactTouchEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Award,
  ExternalLink,
  GraduationCap,
  Maximize2,
  X,
} from "lucide-react";
import { certificates, education } from "../data";
import type { Certificate } from "../data";

export default function Certificates() {
  const prefersReducedMotion = useReducedMotion();

  // Category list with canonical order
  const categories = useMemo(() => {
    const rawCategories = Array.from(new Set(certificates.map((c) => c.category)));
    const preferredOrder = [
      "All",
      "Programming",
      "IT Support & Operations",
      "Academic Honors",
    ];
    const ordered = preferredOrder.filter(
      (cat) => cat === "All" || rawCategories.includes(cat)
    );
    rawCategories.forEach((cat) => {
      if (!ordered.includes(cat)) ordered.push(cat);
    });
    return ordered;
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [expandedCert, setExpandedCert] = useState<Certificate | null>(null);

  const selectorListRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isProgrammaticScroll = useRef(false);
  const scrollRafRef = useRef<number | null>(null);
  const scrollReleaseTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const visibleCertificates = useMemo(() => {
    return activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  const safeActiveIndex = Math.min(
    activeIndex,
    Math.max(0, visibleCertificates.length - 1)
  );
  const safeActiveIndexRef = useRef(safeActiveIndex);
  safeActiveIndexRef.current = safeActiveIndex;

  const activeCert = visibleCertificates[safeActiveIndex] ?? visibleCertificates[0];

  // Center the active entry inside the vertical selector container ONLY (never hijacks page scroll)
  const centerActiveItemInSelector = useCallback(
    (index: number, smooth = true, fastWrap = false) => {
      const container = selectorListRef.current;
      const item = itemRefs.current[index];
      if (!container || !item) return;

      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      if (scrollReleaseTimerRef.current !== null) {
        window.clearTimeout(scrollReleaseTimerRef.current);
        scrollReleaseTimerRef.current = null;
      }

      const containerHeight = container.clientHeight;
      const itemTop = item.offsetTop;
      const itemHeight = item.offsetHeight;
      const maxScrollTop = Math.max(0, container.scrollHeight - containerHeight);
      const targetScrollTop = Math.max(
        0,
        Math.min(maxScrollTop, itemTop - containerHeight / 2 + itemHeight / 2)
      );

      isProgrammaticScroll.current = true;

      if (!smooth || prefersReducedMotion) {
        container.scrollTop = targetScrollTop;
        scrollReleaseTimerRef.current = window.setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 100);
        return;
      }

      const startScrollTop = container.scrollTop;
      const distance = targetScrollTop - startScrollTop;

      if (Math.abs(distance) < 1) {
        scrollReleaseTimerRef.current = window.setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 80);
        return;
      }

      // Fast 240ms zip animation when wrapping 10 -> 1 or 1 -> 10; crisp 300ms for adjacent steps
      const durationMs = fastWrap ? 240 : 300;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        // Quintic ease-out for snappy PSP-style deceleration
        const eased = 1 - Math.pow(1 - progress, 5);
        container.scrollTop = startScrollTop + distance * eased;

        if (progress < 1) {
          scrollRafRef.current = window.requestAnimationFrame(step);
        } else {
          container.scrollTop = targetScrollTop;
          scrollRafRef.current = null;
          scrollReleaseTimerRef.current = window.setTimeout(() => {
            isProgrammaticScroll.current = false;
          }, 100);
        }
      };

      scrollRafRef.current = window.requestAnimationFrame(step);
    },
    [prefersReducedMotion]
  );

  // Select a credential by index with unlimited wrap-around support
  const selectCredential = useCallback(
    (nextIndex: number, smooth = true) => {
      const total = visibleCertificates.length;
      if (total === 0) return;

      const wrappedIndex = ((nextIndex % total) + total) % total;
      const isWrapping =
        (safeActiveIndex === total - 1 && wrappedIndex === 0) ||
        (safeActiveIndex === 0 && wrappedIndex === total - 1) ||
        Math.abs(wrappedIndex - safeActiveIndex) > 2;

      if (wrappedIndex !== safeActiveIndex) {
        if (safeActiveIndex === total - 1 && wrappedIndex === 0) {
          setDirection(-1);
        } else if (safeActiveIndex === 0 && wrappedIndex === total - 1) {
          setDirection(1);
        } else {
          setDirection(wrappedIndex > safeActiveIndex ? 1 : -1);
        }
        setActiveIndex(wrappedIndex);
      }

      centerActiveItemInSelector(wrappedIndex, smooth, isWrapping);
    },
    [visibleCertificates.length, safeActiveIndex, centerActiveItemInSelector]
  );

  const handlePrev = useCallback(() => {
    const total = visibleCertificates.length;
    if (total === 0) return;
    selectCredential((safeActiveIndex - 1 + total) % total, true);
  }, [safeActiveIndex, visibleCertificates.length, selectCredential]);

  const handleNext = useCallback(() => {
    const total = visibleCertificates.length;
    if (total === 0) return;
    selectCredential((safeActiveIndex + 1) % total, true);
  }, [safeActiveIndex, visibleCertificates.length, selectCredential]);

  // Handle category change: reset to first credential in category
  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setDirection(1);
    setActiveIndex(0);
    setHoveredIndex(null);
    window.setTimeout(() => {
      centerActiveItemInSelector(0, true, true);
    }, 40);
  };

  // Center active entry ONLY on initial mount and window resize (never on every step change)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      centerActiveItemInSelector(safeActiveIndexRef.current, false);
    }, 60);

    const handleResize = () => {
      centerActiveItemInSelector(safeActiveIndexRef.current, false);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [centerActiveItemInSelector]);

  // Update active selection when user manually scrolls the vertical selector
  const handleSelectorScroll = () => {
    if (isProgrammaticScroll.current) return;
    const container = selectorListRef.current;
    if (!container || visibleCertificates.length === 0) return;

    const maxScrollTop = container.scrollHeight - container.clientHeight;
    if (container.scrollTop <= 6) {
      if (safeActiveIndex !== 0) {
        setDirection(-1);
        setActiveIndex(0);
      }
      return;
    }
    if (maxScrollTop > 0 && container.scrollTop >= maxScrollTop - 6) {
      const lastIdx = visibleCertificates.length - 1;
      if (safeActiveIndex !== lastIdx) {
        setDirection(1);
        setActiveIndex(lastIdx);
      }
      return;
    }

    const containerCenter = container.scrollTop + container.clientHeight / 2;
    let closestIdx = safeActiveIndex;
    let minDistance = Infinity;

    itemRefs.current.forEach((item, idx) => {
      if (!item || idx >= visibleCertificates.length) return;
      const itemCenter = item.offsetTop + item.offsetHeight / 2;
      const dist = Math.abs(containerCenter - itemCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== safeActiveIndex) {
      setDirection(closestIdx > safeActiveIndex ? 1 : -1);
      setActiveIndex(closestIdx);
    }
  };

  // Keyboard navigation within the selector (ArrowUp / ArrowDown wrap around)
  const handleSelectorKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    const total = visibleCertificates.length;
    if (total === 0) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIdx = (safeActiveIndex - 1 + total) % total;
      selectCredential(prevIdx, true);
      itemRefs.current[prevIdx]?.focus({ preventScroll: true });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = (safeActiveIndex + 1) % total;
      selectCredential(nextIdx, true);
      itemRefs.current[nextIdx]?.focus({ preventScroll: true });
    } else if (e.key === "Home") {
      e.preventDefault();
      selectCredential(0, true);
      itemRefs.current[0]?.focus({ preventScroll: true });
    } else if (e.key === "End") {
      e.preventDefault();
      const lastIdx = total - 1;
      selectCredential(lastIdx, true);
      itemRefs.current[lastIdx]?.focus({ preventScroll: true });
    }
  };

  // Touch swipe handling for crisp vertical step selection (with wrap-around)
  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const total = visibleCertificates.length;
    if (total === 0) return;

    const endY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - endY;
    touchStartYRef.current = null;

    if (Math.abs(deltaY) > 36) {
      if (deltaY > 0) {
        selectCredential((safeActiveIndex + 1) % total, true);
      } else if (deltaY < 0) {
        selectCredential((safeActiveIndex - 1 + total) % total, true);
      }
    }
  };

  // Modal Keyboard Listener: Escape closes expanded document viewer
  useEffect(() => {
    if (!expandedCert) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExpandedCert(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedCert]);

  const totalCount = visibleCertificates.length;
  const originalDocumentHref = activeCert?.pdfUrl || activeCert?.image;

  return (
    <section
      id="certificates"
      aria-labelledby="credentials-heading"
      className="py-24 lg:py-36 border-b border-black/8 dark:border-white/8 bg-band-primary transition-colors duration-300"
    >
      <div className="max-w-site mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* ── 1. Section Introduction & Understated Education ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-black/10 dark:border-white/10">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted mb-3">
              CERTIFICATIONS &amp; ACADEMIC RECOGNITION
            </p>
            <h2
              id="credentials-heading"
              className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold text-ink tracking-[-0.03em] leading-[1.06]"
            >
              Credentials
            </h2>
            <p className="font-body text-base sm:text-[17px] text-muted mt-4 max-w-xl leading-[1.65]">
              A collection of technical certifications and academic recognitions
              earned throughout my Information Technology studies.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start lg:self-end"
            role="group"
            aria-label="Filter credentials by category"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`font-mono text-[11px] uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-ink bg-ink text-cta-primary-text font-medium"
                      : "border-black/10 dark:border-white/10 bg-transparent text-muted hover:text-ink hover:border-black/25 dark:hover:border-white/25"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Understated Secondary Education Bar */}
        <div className="py-4 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 text-xs">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Education
            </span>
            <span className="font-display text-sm font-medium text-ink">
              {education.degree}
            </span>
            <span className="text-muted/40 hidden sm:inline">·</span>
            <span className="text-muted">{education.school}</span>
          </div>
          <span className="font-mono text-[11px] text-muted">
            {education.standing} · {education.major}
          </span>
        </div>

        {/* ── 2. Main Interactive Split: Vertical Credential Selector (Left) + Document Presentation (Right) ── */}
        <div className="pt-10 lg:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ── LEFT COLUMN: Vertical Cover-Flow Credential Selector ── */}
          <div
            className="lg:col-span-5 flex flex-col"
            onKeyDown={handleSelectorKeyDown}
          >
            {/* Selector Header & Stepper Controls */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Index
                </span>
                <span className="font-mono text-xs tabular-nums text-ink font-medium">
                  {String(safeActiveIndex + 1).padStart(2, "0")} /{" "}
                  {String(totalCount).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/75 mr-1 hidden sm:inline">
                  [ ↑ / ↓ ]
                </span>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous credential"
                  className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowUp size={14} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next credential"
                  className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowDown size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Vertical Cover-Flow Viewport */}
            <div className="relative">
              {/* Top & Bottom Depth Fade Masks */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 right-0 h-12 z-20 bg-gradient-to-b from-band-primary via-band-primary/70 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 z-20 bg-gradient-to-t from-band-primary via-band-primary/70 to-transparent"
              />

              {/* Scrollable Vertical Spine (Controlled internal scroll, never traps page scroll) */}
              <div
                ref={selectorListRef}
                onScroll={handleSelectorScroll}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                role="listbox"
                aria-label="Credentials selector"
                aria-activedescendant={
                  activeCert ? `cred-option-${activeCert.id}` : undefined
                }
                style={{ perspective: "900px" }}
                className="relative max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] overflow-y-auto py-[155px] sm:py-[195px] lg:py-[225px] pr-1 scrollbar-none"
              >
                {visibleCertificates.map((cert, index) => {
                  const isSelected = index === safeActiveIndex;
                  const isHovered = index === hoveredIndex;
                  const signedDistance = index - safeActiveIndex;
                  const absDistance = Math.abs(signedDistance);

                  // Controlled vertical cover-flow depth & scale
                  const computedScale = prefersReducedMotion
                    ? 1
                    : isSelected
                    ? 1
                    : absDistance === 1
                    ? 0.965
                    : absDistance === 2
                    ? 0.93
                    : 0.9;

                  const computedOpacity = isSelected
                    ? 1
                    : isHovered
                    ? 0.85
                    : absDistance === 1
                    ? 0.54
                    : absDistance === 2
                    ? 0.3
                    : 0.16;

                  const computedX = prefersReducedMotion
                    ? 0
                    : isSelected
                    ? 10
                    : isHovered
                    ? 6
                    : absDistance === 1
                    ? 2
                    : 0;

                  const computedRotateX = prefersReducedMotion
                    ? 0
                    : isSelected
                    ? 0
                    : Math.max(-10, Math.min(10, signedDistance * -4.5));

                  return (
                    <motion.button
                      key={cert.id}
                      id={`cred-option-${cert.id}`}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => selectCredential(index, true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isSelected) {
                          e.preventDefault();
                          setExpandedCert(cert);
                        }
                      }}
                      animate={{
                        scale: computedScale,
                        opacity: computedOpacity,
                        x: computedX,
                        rotateX: computedRotateX,
                      }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.38,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ transformOrigin: "left center" }}
                      className="snap-center w-full text-left relative py-4 sm:py-5 pl-5 pr-4 border-b border-black/8 dark:border-white/8 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink group"
                    >
                      {/* Shared Active Selection Spine Bar */}
                      {isSelected && (
                        <motion.span
                          layoutId="credentialActiveBar"
                          className="absolute left-0 top-2.5 bottom-2.5 w-[2.5px] bg-ink"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}

                      {/* Subtle Active Row Highlight Plane */}
                      {isSelected && (
                        <motion.span
                          layoutId="credentialActivePlane"
                          className="pointer-events-none absolute inset-0 bg-black/[0.03] dark:bg-white/[0.035] -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}

                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span
                            className={`font-mono text-xs tabular-nums tracking-[0.14em] shrink-0 transition-colors ${
                              isSelected
                                ? "text-ink font-semibold"
                                : "text-muted"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span
                            className={`font-display tracking-[-0.015em] leading-[1.28] truncate transition-all ${
                              isSelected
                                ? "text-base sm:text-[18px] font-semibold text-ink"
                                : "text-sm sm:text-[16px] font-medium text-ink/80 group-hover:text-ink"
                            }`}
                          >
                            {cert.title}
                          </span>
                        </div>

                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted shrink-0 hidden sm:inline">
                          {cert.category}
                        </span>
                      </div>

                      <div className="pl-7 flex items-center justify-between gap-3 text-xs text-muted">
                        <span className="truncate">{cert.issuer}</span>
                        <span className="font-mono text-[11px] shrink-0 opacity-80">
                          {cert.date}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Live Document Presentation Area ── */}
          <div className="lg:col-span-7 flex flex-col">
            {activeCert && (
              <div className="space-y-6">
                {/* Original Certificate Document Frame (Flat, Undistorted, Full Aspect Ratio) */}
                <div className="relative w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#EAE6DF]/60 dark:bg-[#111114] p-4 sm:p-8 lg:p-10 min-h-[300px] sm:min-h-[420px] lg:min-h-[460px] flex items-center justify-center overflow-hidden">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={activeCert.id}
                      custom={direction}
                      variants={
                        prefersReducedMotion
                          ? {
                              enter: { opacity: 0 },
                              center: { opacity: 1 },
                              exit: { opacity: 0 },
                            }
                          : {
                              enter: (dir: number) => ({
                                opacity: 0,
                                y: dir > 0 ? 18 : -18,
                                scale: 0.985,
                              }),
                              center: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                              },
                              exit: (dir: number) => ({
                                opacity: 0,
                                y: dir > 0 ? -14 : 14,
                                scale: 0.99,
                              }),
                            }
                      }
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: prefersReducedMotion ? 0.15 : 0.38,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {activeCert.image ? (
                        <img
                          src={activeCert.image}
                          alt={`${activeCert.title} — issued by ${activeCert.issuer}`}
                          onClick={() => setExpandedCert(activeCert)}
                          className="max-h-[280px] sm:max-h-[380px] lg:max-h-[420px] w-auto max-w-full object-contain shadow-[0_18px_45px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.55)] cursor-zoom-in select-none"
                        />
                      ) : (
                        <div className="py-16 px-6 text-center space-y-3">
                          <div className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center mx-auto text-ink">
                            {activeCert.category === "Academic Honors" ? (
                              <GraduationCap size={26} />
                            ) : (
                              <Award size={26} />
                            )}
                          </div>
                          <p className="font-display text-base font-semibold text-ink">
                            {activeCert.title}
                          </p>
                          <p className="text-xs text-muted">
                            {activeCert.issuer}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Subtle Inspect Full-Screen Trigger */}
                  {activeCert.image && (
                    <button
                      type="button"
                      onClick={() => setExpandedCert(activeCert)}
                      aria-label="Inspect full-size certificate"
                      className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full bg-band-primary/90 text-ink border border-black/10 dark:border-white/15 hover:border-ink dark:hover:border-white transition-colors cursor-pointer backdrop-blur-xs"
                    >
                      <Maximize2 size={11} />
                      <span>Inspect</span>
                    </button>
                  )}
                </div>

                {/* Synchronized Document Metadata & Actions */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${activeCert.id}-meta`}
                    initial={
                      prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
                    }
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-6"
                  >
                    <div className="space-y-2.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                        <span className="text-ink font-semibold">
                          {String(safeActiveIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="opacity-30">/</span>
                        <span>{activeCert.category}</span>
                        <span className="opacity-30">·</span>
                        <span>{activeCert.date}</span>
                        {activeCert.grade && (
                          <>
                            <span className="opacity-30">·</span>
                            <span className="text-ink font-medium">
                              {activeCert.grade}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-[-0.02em]">
                        {activeCert.title}
                      </h3>

                      <p className="font-body text-sm text-muted">
                        Issued by{" "}
                        <span className="text-ink font-medium">
                          {activeCert.issuer}
                        </span>
                      </p>

                      {activeCert.description && (
                        <p className="font-body text-xs sm:text-[13.5px] text-muted leading-[1.68] pt-1">
                          {activeCert.description}
                        </p>
                      )}
                    </div>

                    {/* Document Actions */}
                    <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end gap-2.5 shrink-0">
                      {originalDocumentHref && (
                        <a
                          href={originalDocumentHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 text-xs sm:text-[13px] font-medium text-cta-primary-text bg-ink hover:opacity-90 rounded-full px-5 py-2.5 transition-opacity group"
                        >
                          <span>View original document</span>
                          <ArrowUpRight
                            size={14}
                            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                          />
                        </a>
                      )}

                      {activeCert.credentialUrl && (
                        <a
                          href={activeCert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-ink border border-black/15 dark:border-white/15 hover:border-ink dark:hover:border-white rounded-full px-4 py-2 transition-colors"
                        >
                          <span>Verify credential</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Expanded Full-Screen Document Lightbox (Escape to Close) ── */}
      <AnimatePresence>
        {expandedCert && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expanded-cert-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-xs"
            onClick={() => setExpandedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl rounded-2xl border border-black/10 dark:border-white/15 bg-band-primary p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10 shrink-0">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {expandedCert.category} · {expandedCert.date}
                  </p>
                  <h3
                    id="expanded-cert-title"
                    className="font-display text-lg sm:text-xl font-semibold text-ink mt-0.5"
                  >
                    {expandedCert.title}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    {expandedCert.issuer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedCert(null)}
                  aria-label="Close document viewer"
                  className="w-8 h-8 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center bg-[#EAE6DF]/50 dark:bg-[#0D0D10] rounded-xl p-3 sm:p-6">
                {expandedCert.image && (
                  <img
                    src={expandedCert.image}
                    alt={expandedCert.title}
                    className="max-h-[65vh] w-auto max-w-full object-contain"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 shrink-0">
                {(expandedCert.pdfUrl || expandedCert.image) && (
                  <a
                    href={expandedCert.pdfUrl || expandedCert.image}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium text-cta-primary-text bg-ink hover:opacity-90 rounded-full px-5 py-2.5 transition-opacity"
                  >
                    <span>View original document</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedCert(null)}
                  className="ml-auto text-xs font-mono uppercase tracking-[0.14em] text-muted hover:text-ink px-3 py-2 cursor-pointer"
                >
                  Close [Esc]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
