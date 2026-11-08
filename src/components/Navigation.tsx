import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Search, Sparkles, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  onOpenAi?: () => void;
}

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
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
    id: "about",
    label: "About Rhon (BSIT @ DLSL)",
    category: "Profile",
    targetId: "about",
    keywords: [
      "about",
      "bio",
      "education",
      "de la salle lipa",
      "dlsl",
      "system development",
      "jpcs",
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
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compact Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchTarget[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      const sections = [
        "contact",
        "certificates",
        "about",
        "skills",
        "projects",
        "overview",
      ];
      const scrollPosition = window.scrollY + 140;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(sectionId);
          break;
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter search targets
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    const matches = SEARCH_TARGETS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
    );
    setSearchResults(matches);
  }, [searchQuery]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleJumpToTarget = (target: SearchTarget) => {
    const el = document.getElementById(target.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    if (target.projectId) {
      window.dispatchEvent(
        new CustomEvent("select-portfolio-project", {
          detail: target.projectId,
        })
      );
    }
    setSearchQuery("");
    setIsSearchFocused(false);
    setMobileMenuOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      handleJumpToTarget(searchResults[0]);
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-[#FBF9F5]/85 dark:bg-[#0A0A0C]/85 border-b border-black/5 dark:border-white/5 transition-all duration-300 py-3">
      <div className="max-w-site mx-auto px-6 md:px-10 flex items-center justify-between gap-3">
        {/* Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-lg group select-none shrink-0"
          aria-label="Rhon Kelly Endaya — Back to top"
        >
          <img
            src="/RK_logo_original.png"
            alt="RK Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-all brightness-0 dark:brightness-100"
          />
          <span className="font-display text-base font-bold text-ink tracking-tight">
            Rhon Kelly Endaya
          </span>
        </a>

        {/* Center: Desktop Nav Links & Compact Search Input */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <nav
            className="flex items-center gap-0.5 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full px-2 py-1 text-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all text-xs lg:text-[13px] ${
                    isActive
                      ? "bg-black/5 dark:bg-white/10 text-black dark:text-white font-semibold"
                      : "text-muted hover:text-ink hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* ── Compact Search Pill Beside Nav Links ── */}
          <div ref={searchContainerRef} className="relative">
            <div className="h-8 px-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs text-muted flex items-center gap-2 max-w-[180px] sm:max-w-[210px] focus-within:max-w-[240px] focus-within:border-black/20 dark:focus-within:border-white/20 focus-within:ring-2 focus-within:ring-ink/10 transition-all shadow-inner">
              <Search size={13} className="text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search portfolio..."
                className="bg-transparent border-none outline-none text-ink placeholder:text-muted w-full text-xs font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted hover:text-ink p-0.5 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Quick Live Dropdown Results */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-10 left-0 right-0 sm:w-72 bg-white dark:bg-[#16161B] border border-black/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted border-b border-black/5 dark:border-white/5">
                  Matching Sections &amp; Projects
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleJumpToTarget(item)}
                      className="w-full text-left px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <div>
                        <div className="font-semibold text-ink group-hover:underline">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-muted">
                          Jump to #{item.targetId}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-muted">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Utility Strip */}
        <div className="flex items-center gap-2">
          {/* Dedicated "Ask AI" Button (Triggers Floating Messenger Chatbot) */}
          <button
            type="button"
            onClick={onOpenAi}
            aria-label="Ask AI Assistant"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all bg-black/5 hover:bg-black/10 text-[#1A1A18] border border-black/5 dark:bg-white/10 dark:hover:bg-white/15 dark:text-[#F3F3F5] dark:border-white/10 shadow-xs cursor-pointer group"
          >
            <Sparkles
              size={13}
              className="text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform"
            />
            <span>Ask AI</span>
          </button>

          {/* "Get in Touch" — primary CTA */}
          <a
            href="#contact"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-cta-primary text-cta-primary-text hover:opacity-85 transition-opacity shadow-sm"
          >
            Get in Touch
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </a>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-black/5 dark:border-white/10 text-ink bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md hover:bg-surface-strong transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 dark:border-white/10 bg-[#FBF9F5]/98 dark:bg-[#0A0A0C]/98 backdrop-blur-xl px-6 py-5 space-y-3 animate-[slideDown_0.2s_ease-out_both]">
          {/* Mobile Search input */}
          <div className="h-9 px-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-muted flex items-center gap-2">
            <Search size={14} className="text-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search portfolio..."
              className="bg-transparent border-none outline-none text-ink placeholder:text-muted w-full text-xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted hover:text-ink p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Search results in mobile */}
          {searchResults.length > 0 && (
            <div className="bg-white dark:bg-[#16161B] rounded-xl border border-black/10 dark:border-white/10 p-1 divide-y divide-black/5 dark:divide-white/5">
              {searchResults.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleJumpToTarget(item)}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between font-medium text-ink cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-muted font-mono">
                    #{item.targetId}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-center ${
                    isActive
                      ? "bg-black/5 dark:bg-white/10 text-black dark:text-white border-black/10 dark:border-white/15 font-semibold"
                      : "border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 text-muted hover:text-ink hover:bg-surface-strong"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAi?.();
            }}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 hover:bg-black/10 text-[#1A1A18] dark:bg-white/10 dark:hover:bg-white/15 dark:text-[#F3F3F5] transition-all shadow-xs cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
            <span>Open AI Chatbot</span>
          </button>

          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl bg-cta-primary text-cta-primary-text hover:opacity-85 transition-opacity shadow-sm"
          >
            Get in Touch
            <ArrowUpRight size={15} />
          </a>
        </div>
      )}
    </header>
  );
}
