import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  onOpenAi?: () => void;
}

const navItems = [
  { label: "Overview",  href: "#overview" },
  { label: "Projects",  href: "#projects" },
  { label: "Skills",    href: "#skills" },
  { label: "About",     href: "#about" },
  { label: "Contact",   href: "#contact" },
];

export default function Navigation({ onOpenAi }: NavigationProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const sections = ["contact", "certificates", "about", "skills", "projects", "overview"];
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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-[#FBF9F5]/80 dark:bg-[#0A0A0C]/80 border-b border-black/5 dark:border-white/5 transition-all duration-300 py-3.5">
      <div className="max-w-site mx-auto px-6 md:px-10 flex items-center justify-between gap-4">

        {/* Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-md"
          aria-label="Rhon Kelly Endaya — Back to top"
        >
          <span
            className="w-8 h-8 rounded-lg bg-cta-primary flex items-center justify-center text-xs font-bold text-cta-primary-text select-none shadow-xs"
            aria-hidden="true"
          >
            RE
          </span>
          <span className="hidden sm:block font-display text-sm font-semibold text-ink tracking-tight">
            Rhon Kelly Endaya
          </span>
        </a>

        {/* Desktop nav pills — active pill uses bg-black/5 dark:bg-white/10 text-black dark:text-white */}
        <nav
          className="hidden md:flex items-center gap-0.5 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full px-2 py-1.5 text-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all text-[13px] ${
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

        {/* Utility strip */}
        <div className="flex items-center gap-2">
          {/* "Ask AI" Refined Pill Button */}
          <button
            type="button"
            onClick={onOpenAi}
            aria-label="Ask AI Assistant"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all bg-black/5 hover:bg-black/10 text-[#1A1A18] border border-black/5 dark:bg-white/10 dark:hover:bg-white/15 dark:text-[#F3F3F5] dark:border-white/10 shadow-xs cursor-pointer group"
          >
            <Sparkles size={13} className="text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Ask AI</span>
          </button>

          {/* "Get in Touch" — primary CTA */}
          <a
            href="#contact"
            className="hidden lg:inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full bg-cta-primary text-cta-primary-text hover:opacity-85 transition-opacity shadow-sm"
          >
            Get in Touch
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </a>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-black/5 dark:border-white/10 text-ink bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md hover:bg-surface-strong transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 dark:border-white/10 bg-[#FBF9F5]/95 dark:bg-[#0A0A0C]/95 backdrop-blur-xl px-6 py-5 space-y-3 animate-[slideDown_0.2s_ease-out_both]">
          <div className="grid grid-cols-2 gap-2">
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
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 hover:bg-black/10 text-[#1A1A18] dark:bg-white/10 dark:hover:bg-white/15 dark:text-[#F3F3F5] transition-all shadow-xs"
          >
            <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
            <span>Ask AI Assistant</span>
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
