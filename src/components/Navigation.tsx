import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CornerDownLeft, Menu, Search, Sparkles, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { EASE_OUT_EXPO, INTRO_DELAY, scrollToSection } from "../motion";

interface NavigationProps {
  onOpenAi?: () => void;
}

const navItems = [
  { label: "About", href: "#overview" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Credentials", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

interface SearchTarget {
  id: string;
  label: string;
  category: string;
  targetId: string;
  projectId?: string;
  keywords: string[];
}

const SEARCH_TARGETS: SearchTarget[] = [
  {
    id: "palengkehub",
    label: "PalengkeHub (Mobile App)",
    category: "Projects",
    targetId: "projects",
    projectId: "palengkehub",
    keywords: [
      "palengkehub",
      "mobile",
      "market",
      "presyo",
      "check",
      "lipa",
      "capstone",
      "react native",
      "expo",
      "produce",
    ],
  },
  {
    id: "eventpulse",
    label: "EventPulse (Campus Tracker)",
    category: "Projects",
    targetId: "projects",
    projectId: "event-tracker",
    keywords: [
      "eventpulse",
      "event",
      "tracker",
      "campus",
      "academic",
      "sports",
      "career",
      "full-stack",
      "mongo",
      "jwt",
      "node",
    ],
  },
  {
    id: "auto-avenue",
    label: "Auto Avenue IMS (Enterprise ERP)",
    category: "Projects",
    targetId: "projects",
    projectId: "auto-avenue",
    keywords: [
      "auto",
      "avenue",
      "ims",
      "erp",
      "inventory",
      "automotive",
      "parts",
      "mysql",
      "postgresql",
      "sql",
      "purchase order",
    ],
  },
  {
    id: "skills",
    label: "Technical Skills & Competencies",
    category: "Skills",
    targetId: "skills",
    keywords: [
      "skills",
      "react",
      "typescript",
      "javascript",
      "tailwind",
      "node.js",
      "express",
      "php",
      "python",
      "postgres",
      "mongodb",
    ],
  },
  {
    id: "overview",
    label: "Engineering Philosophy & Focus",
    category: "Profile",
    targetId: "overview",
    keywords: [
      "about",
      "bio",
      "education",
      "philosophy",
      "system development",
      "architecture",
      "pillars",
    ],
  },
  {
    id: "certificates",
    label: "Certificates & Honors",
    category: "Credentials",
    targetId: "certificates",
    keywords: [
      "certificates",
      "honors",
      "dean's list",
      "cisco",
      "python",
      "cybersecurity",
      "credentials",
    ],
  },
  {
    id: "contact",
    label: "Contact & Internship Availability",
    category: "Contact",
    targetId: "contact",
    keywords: [
      "contact",
      "email",
      "phone",
      "internship",
      "hire",
      "resume",
      "cv",
      "linkedin",
    ],
  },
];

export default function Navigation({ onOpenAi }: NavigationProps) {
  const reduce = useReducedMotion() ?? false;
  const [activeSection, setActiveSection] = useState<string>("top");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

  const query = searchQuery.toLowerCase().trim();
  const searchResults = query
    ? SEARCH_TARGETS.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.keywords.some((k) => k.toLowerCase().includes(query))
      )
    : SEARCH_TARGETS;

  // ── Scroll state: active section + header surface ──
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16);
      const sections = ["contact", "certificates", "skills", "projects", "overview"];
      const scrollPosition = window.scrollY + 140;
      let current = "top";
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            current = sectionId;
            break;
          }
        }
      }
      setActiveSection(current);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSearch = useCallback(() => {
    setMobileMenuOpen(false);
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setHighlight(0);
    searchTriggerRef.current?.focus({ preventScroll: true });
  }, []);

  // ── Global shortcuts: "/" opens search, Escape closes overlays ──
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key === "/" && !isTyping && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openSearch();
      } else if (e.key === "Escape") {
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen, openSearch]);

  // Focus the search field when the panel opens
  useEffect(() => {
    if (searchOpen) {
      const id = window.setTimeout(() => searchInputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [searchOpen]);

  // Pause smooth scrolling while the full-screen mobile menu is open
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (mobileMenuOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleJumpToTarget = (target: SearchTarget) => {
    scrollToSection(target.targetId);
    if (target.projectId) {
      window.dispatchEvent(
        new CustomEvent("select-portfolio-project", { detail: target.projectId })
      );
    }
    setSearchOpen(false);
    setSearchQuery("");
    setHighlight(0);
    setMobileMenuOpen(false);
  };

  const handleSearchKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(searchResults.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      handleJumpToTarget(searchResults[Math.min(highlight, searchResults.length - 1)]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    }
  };

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === "#top") {
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: number) => void } }).lenis;
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    scrollToSection(href.slice(1));
  };

  const surface = scrolled || mobileMenuOpen;

  return (
    <>
      <motion.header
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : INTRO_DELAY + 0.75, ease: EASE_OUT_EXPO }}
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 border-b ${
          surface
            ? "bg-[#FBF9F5]/85 dark:bg-[#0A0A0C]/85 backdrop-blur-md border-black/[0.06] dark:border-white/[0.06]"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-site mx-auto px-6 md:px-10 h-16 sm:h-[72px] flex items-center justify-between gap-6">
          {/* Wordmark */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "#top")}
            className="group flex items-center gap-2.5 shrink-0 rounded-md"
            aria-label="Rhon Kelly Endaya — back to top"
          >
            <img
              src="/RK_logo_original.png"
              alt=""
              className="h-7 w-7 object-contain brightness-0 dark:brightness-100 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
              Rhon Kelly Endaya
            </span>
          </a>

          {/* Primary links — plain text, no container */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative py-1 text-[13px] font-medium transition-colors ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-1/2 -bottom-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-ink transition-all duration-300 ${
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Utilities */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex items-center">
              <button
                ref={searchTriggerRef}
                type="button"
                onClick={openSearch}
                aria-label="Search the portfolio (shortcut: /)"
                aria-keyshortcuts="/"
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
                className="h-9 w-9 grid place-items-center rounded-full text-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
              >
                <Search size={16} strokeWidth={1.9} />
              </button>
              <span
                aria-hidden="true"
                className="hidden xl:inline-block font-mono text-[11px] text-muted/45 select-none pointer-events-none -ml-0.5 mr-1"
              >
                /
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenAi}
              aria-label="Ask the AI assistant (Ctrl+K)"
              className="h-9 inline-flex items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              <Sparkles size={14} strokeWidth={1.9} className="text-ink" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden h-9 w-9 grid place-items-center rounded-full text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ───────────── Mobile menu: editorial full-screen index ───────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE_OUT_EXPO }}
            className="lg:hidden fixed inset-x-0 top-16 sm:top-[72px] bottom-0 z-30 bg-[#FBF9F5] dark:bg-[#0A0A0C] overflow-y-auto"
            data-lenis-prevent
          >
            <nav aria-label="Mobile" className="px-6 md:px-10 pt-8 pb-10 flex flex-col min-h-full">
              <ul className="space-y-1">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <li key={item.href} className="overflow-hidden">
                      <motion.a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        initial={reduce ? false : { y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.08 + i * 0.05, ease: EASE_OUT_EXPO }}
                        className={`flex items-baseline gap-4 py-1.5 font-display text-[2.6rem] sm:text-5xl font-bold tracking-[-0.035em] leading-tight ${
                          isActive ? "text-ink" : "text-ink/45 hover:text-ink"
                        }`}
                      >
                        {item.label}
                        {isActive && <span className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />}
                      </motion.a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto pt-10 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={openSearch}
                  className="h-12 inline-flex items-center justify-center gap-2 rounded-full border border-black/10 dark:border-white/15 text-sm font-medium text-ink"
                >
                  <Search size={15} /> Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAi?.();
                  }}
                  className="h-12 inline-flex items-center justify-center gap-2 rounded-full bg-cta-primary text-cta-primary-text text-sm font-semibold"
                >
                  <Sparkles size={15} /> Ask AI
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────── Search panel ───────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search"
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <button
              type="button"
              aria-label="Close search"
              tabIndex={-1}
              onClick={closeSearch}
              className="absolute inset-0 bg-[#1A1A18]/20 dark:bg-black/50 cursor-default"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search the portfolio"
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE_OUT_EXPO }}
              className="relative mx-auto mt-20 sm:mt-24 w-[calc(100%-2rem)] max-w-xl rounded-2xl bg-[#FBF9F5] dark:bg-[#141416] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06] dark:ring-white/[0.08] overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 h-14 border-b border-black/[0.06] dark:border-white/[0.08]">
                <Search size={17} className="text-muted shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlight(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search projects, skills, sections…"
                  aria-label="Search query"
                  aria-controls="search-results"
                  className="flex-1 bg-transparent outline-none text-[15px] text-ink placeholder:text-muted"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="text-[11px] font-medium text-muted hover:text-ink border border-black/10 dark:border-white/15 rounded px-1.5 py-0.5"
                >
                  Esc
                </button>
              </div>

              <ul
                id="search-results"
                role="listbox"
                className="max-h-[min(60vh,420px)] overflow-y-auto py-2"
                data-lenis-prevent
              >
                {searchResults.length === 0 && (
                  <li className="px-5 py-8 text-center text-sm text-muted">
                    No matches for “{searchQuery}”.
                  </li>
                )}
                {searchResults.map((item, i) => {
                  const isHighlighted = i === highlight;
                  return (
                    <li key={item.id} role="option" aria-selected={isHighlighted}>
                      <button
                        type="button"
                        onMouseEnter={() => setHighlight(i)}
                        onClick={() => handleJumpToTarget(item)}
                        className={`w-full flex items-center justify-between gap-4 px-5 py-3 text-left transition-colors ${
                          isHighlighted ? "bg-black/[0.04] dark:bg-white/[0.05]" : ""
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink truncate">{item.label}</span>
                          <span className="block text-xs text-muted mt-0.5">{item.category}</span>
                        </span>
                        {isHighlighted ? (
                          <CornerDownLeft size={14} className="text-muted shrink-0" />
                        ) : (
                          <ArrowUpRight size={14} className="text-muted/50 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
