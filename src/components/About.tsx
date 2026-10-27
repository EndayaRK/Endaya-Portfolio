import { Award, GraduationCap, MapPin, Users } from "lucide-react";
import { education, engineeringPrinciples, leadership } from "../data";

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28 border-b border-border bg-bg">
      <div className="max-w-site mx-auto px-6 md:px-10">

        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            Personal & Academic Context
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Background & Approach
          </h2>
          <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">
            Understanding the student and developer behind the code: academic background, technical
            curiosity, and how I approach building software.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── Left: Narrative & Principles ── */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-muted">
              <p>
                I am a fourth-year Bachelor of Science in Information Technology student at{" "}
                <span className="text-ink font-semibold">De La Salle Lipa</span>, majoring in{" "}
                <span className="text-ink font-medium">System Development</span>. My interest in
                technology began with curiosity about how software works under the hood and evolved
                into a commitment to building functional, production-ready web and mobile applications.
              </p>
              <p>
                In my projects—whether architecting the end-to-end event registration workflow of{" "}
                <span className="text-ink font-medium">Event Tracker</span>, designing vendor
                monitoring dashboards for our capstone marketplace{" "}
                <span className="text-ink font-medium">PalengkeHub</span>, or building inventory
                audit trails for <span className="text-ink font-medium">Auto Avenue</span>—I focus
                on the entire software lifecycle. I enjoy taking an idea from an empty folder,
                designing the schemas, writing the API handlers, and refining the interface so it
                feels effortless for users.
              </p>
              <p>
                Currently, I am looking for an{" "}
                <span className="text-ink font-semibold underline underline-offset-4 decoration-ink/30">
                  IT internship
                </span>{" "}
                where I can immerse myself in an experienced engineering team, contribute real code
                to production systems, and learn industry standards at scale.
              </p>
            </div>

            {/* Engineering Principles */}
            <div className="pt-6 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">
                Core Development Principles
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {engineeringPrinciples.map((item) => (
                  <div
                    key={item.number}
                    className="p-4 rounded-2xl border border-border bg-surface flex flex-col gap-2"
                  >
                    <span className="text-xs font-bold text-ink opacity-30">{item.number}</span>
                    <h4 className="font-display text-sm font-semibold text-ink">{item.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Education & Honors ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* Education Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <span className="p-2 rounded-xl bg-surface-strong border border-border text-ink">
                  <GraduationCap size={20} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">Education</h3>
                  <span className="text-xs text-muted">{education.dateRange}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display text-sm font-semibold text-ink">{education.school}</h4>
                <p className="text-xs font-medium text-ink/70">{education.degree}</p>
                <p className="text-xs text-muted">{education.major}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted pt-1">
                  <MapPin size={11} />
                  {education.location}
                </p>
                <p className="text-xs text-muted pt-2 leading-relaxed border-t border-border">
                  {education.description}
                </p>
              </div>
            </div>

            {/* Leadership Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <span className="p-2 rounded-xl bg-surface-strong border border-border text-ink">
                  <Users size={20} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">Leadership & Community</h3>
                  <span className="text-xs text-muted">2023 — Present</span>
                </div>
              </div>
              {leadership.map((item) => (
                <div key={item.organization} className="space-y-1">
                  <p className="font-display text-sm font-semibold text-ink">{item.organization}</p>
                  <p className="text-xs font-medium text-muted">{item.role}</p>
                  <p className="text-xs text-muted leading-relaxed pt-1">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Academic Honors */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 text-ink font-semibold text-sm pb-3 mb-3 border-b border-border">
                <Award size={15} />
                Academic Honors
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Dean's Lister — Third Honor</span>
                  <span className="font-semibold text-ink">GPA 3.4615</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Dean's Lister — Third Honor</span>
                  <span className="font-semibold text-ink">GPA 3.3478</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
