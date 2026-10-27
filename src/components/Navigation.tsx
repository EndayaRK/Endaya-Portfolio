import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Overview",  href: "#overview" },
  { label: "Projects",  href: "#projects" },
  { label: "Skills",    href: "#skills" },
  { label: "About",     href: "#about" },
  { label: "Contact",   href: "#contact" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [scrolled, setScrolled]           = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);

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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-[#FBF9F5]/80 dark:bg-[#0A0A0C]/80 border-b border-black/5 dark:border-white/5 py-3"
          : "bg-surface/50 backdrop-blur-sm py-4 border-b border-transparent"
      }`}
    >
      <div className="max-w-site mx-auto px-6 md:px-10 flex items-center justify-between gap-4">

        {/* Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-md"
          aria-label="Rhon Kelly Endaya — Back to top"
        >
          <span
            className="w-8 h-8 rounded-lg bg-cta-primary flex items-center justify-center text-xs font-bold text-cta-primary-text select-none"
            aria-hidden="true"
          >
            RE
          </span>
          <span className="hidden sm:block font-display text-sm font-semibold text-ink tracking-tight">
            Rhon Kelly Endaya
          </span>
        </a>

        {/* Desktop nav pills — active is a soft tinted pill, CTA stays the strongest focal point */}
        <nav
          className="hidden md:flex items-center gap-0.5 bg-surface border border-border rounded-full px-2 py-1.5 text-sm"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-colors text-[13px] ${
                  isActive
                    ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Utility strip */}
        <div className="flex items-center gap-2">
          {/* "Get in Touch" — primary CTA, desktop only */}
          <a
            href="#contact"
            className="hidden lg:inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full bg-cta-primary text-cta-primary-text hover:opacity-85 transition-opacity"
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
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-border text-ink hover:bg-surface-strong transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface/97 backdrop-blur-xl px-6 py-5 space-y-3 animate-[slideDown_0.2s_ease-out_both]">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-medium text-ink hover:bg-surface-strong transition-colors text-center"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl bg-cta-primary text-cta-primary-text hover:opacity-85 transition-opacity"
          >
            Get in Touch
            <ArrowUpRight size={15} />
          </a>
        </div>
      )}
    </header>
  );
}
