import { ArrowUp, ArrowUpRight, Check, Copy, Github, Linkedin, MapPin, Phone } from "lucide-react";
import { profile } from "../data";

type FooterProps = {
  onCopyEmail: () => void;
  emailCopied: boolean;
};

export default function Footer({ onCopyEmail, emailCopied }: FooterProps) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer id="contact" className="border-t border-black/5 dark:border-white/5 bg-band-secondary/70 backdrop-blur-[2px] transition-colors duration-300">
      {/* Contact Section */}
      <div className="max-w-site mx-auto px-6 md:px-10 py-20 lg:py-24 relative z-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
            Get in Touch
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.12]">
            Let's build something functional together.
          </h2>
          <p className="text-base sm:text-lg text-muted mt-4 leading-relaxed">
            I am actively seeking an{" "}
            <span className="text-ink font-medium">IT internship</span>{" "}
            where I can contribute clean full-stack code, collaborate on production systems, and
            continue learning from experienced engineers. Based in {profile.location}, open to both
            on-site and remote opportunities.
          </p>
        </div>

        {/* Email Action Card */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted block mb-1">
                Direct Contact Email
              </span>
              <p className="font-display text-xl sm:text-2xl font-bold text-ink break-all">
                {profile.email}
              </p>
              <p className="text-xs text-muted mt-1">Typical response time: within 24 hours</p>
            </div>

            <div className="md:col-span-5 flex flex-wrap items-center gap-3 md:justify-end">
              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-full bg-cta-primary text-cta-primary-text hover:opacity-85 transition-opacity shadow-sm"
              >
                {emailCopied ? (
                  <>
                    <Check size={15} strokeWidth={2.5} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy Email
                  </>
                )}
              </button>

              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-full border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#18181C]/80 text-ink hover:bg-surface-strong transition-colors"
              >
                Open Mail Client
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* GitHub */}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md flex items-center justify-between group hover:border-black/20 dark:hover:border-white/20 hover:bg-surface-contrast transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-surface-strong border border-black/5 dark:border-white/10 text-ink">
                <Github size={17} />
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">Version Control</span>
                <span className="text-sm font-semibold text-ink">GitHub Profile</span>
              </div>
            </div>
            <ArrowUpRight size={14} className="text-muted group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* LinkedIn */}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md flex items-center justify-between group hover:border-black/20 dark:hover:border-white/20 hover:bg-surface-contrast transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-surface-strong border border-black/5 dark:border-white/10 text-ink">
                <Linkedin size={17} />
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">Professional Network</span>
                <span className="text-sm font-semibold text-ink">LinkedIn Profile</span>
              </div>
            </div>
            <ArrowUpRight size={14} className="text-muted group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Phone */}
          <a
            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
            className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md flex items-center justify-between group hover:border-black/20 dark:hover:border-white/20 hover:bg-surface-contrast transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-surface-strong border border-black/5 dark:border-white/10 text-ink">
                <Phone size={17} />
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">Direct Phone</span>
                <span className="text-sm font-semibold text-ink">{profile.phone}</span>
              </div>
            </div>
            <ArrowUpRight size={14} className="text-muted group-hover:text-ink transition-colors" />
          </a>

          {/* Location */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 backdrop-blur-md flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-surface-strong border border-black/5 dark:border-white/10 text-ink">
                <MapPin size={17} />
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">Location</span>
                <span className="text-sm font-semibold text-ink">Lipa City, Batangas</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-muted border border-black/5 dark:border-white/10 px-1.5 py-0.5 rounded-md">
              PH
            </span>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <div className="flex items-center gap-4">
            
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#18181C]/80 hover:bg-surface-strong hover:text-ink transition-colors"
              aria-label="Back to top"
            >
              Back to Top
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
