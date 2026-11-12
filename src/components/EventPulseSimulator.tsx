import { useState, useMemo } from "react";
import {
  ArrowUpRight,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  MapPin,
  Moon,
  RotateCw,
  Search,
  Sparkles,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";

interface CampusEvent {
  id: string;
  month: string;
  day: string;
  category: "Academic" | "Sports" | "Career";
  status: "open" | "ongoing" | "closed";
  title: string;
  description: string;
  location: string;
  totalCapacity: number;
  initialBooked: number;
  organizer: string;
  speaker?: string;
  time: string;
}

const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: "event-1",
    month: "AUG",
    day: "15",
    category: "Academic",
    status: "open",
    title: "Tech Talk: AI in Education",
    description:
      "A hands-on workshop examining large language models, agentic workflows, and ethical artificial intelligence integration across modern universities.",
    location: "Engineering Building, Room 301",
    totalCapacity: 50,
    initialBooked: 0,
    organizer: "Computer Science Department",
    speaker: "Dr. Elena Vance (Lead AI Researcher)",
    time: "1:30 PM — 4:00 PM",
  },
  {
    id: "event-2",
    month: "JUL",
    day: "20",
    category: "Sports",
    status: "ongoing",
    title: "Campus Sports Fest",
    description:
      "Annual university intramural tournament featuring inter-department basketball, volleyball championships, and esports exhibition matches.",
    location: "University Gymnasium",
    totalCapacity: 100,
    initialBooked: 0,
    organizer: "Athletic Council",
    speaker: "Coach Marcus Cruz",
    time: "8:00 AM — 6:00 PM",
  },
  {
    id: "event-3",
    month: "JUN",
    day: "10",
    category: "Career",
    status: "closed",
    title: "Career Fair 2026",
    description:
      "Annual technology recruitment expo connecting graduating seniors and undergraduates with over 45 industry partners, startups, and enterprise firms.",
    location: "Student Center, Hall A",
    totalCapacity: 200,
    initialBooked: 200,
    organizer: "Office of Career Placement",
    speaker: "Keynote: Vercel & Microsoft Alumni",
    time: "9:00 AM — 5:00 PM",
  },
];

interface Member {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: "Student" | "Organizer" | "Admin";
  status: "Active" | "Inactive";
}

const MEMBERS: Member[] = [
  {
    id: "mem-1",
    initials: "JD",
    name: "Juan dela Cruz",
    email: "juan@example.com",
    role: "Student",
    status: "Active",
  },
  {
    id: "mem-2",
    initials: "MS",
    name: "Maria Santos",
    email: "maria@example.com",
    role: "Organizer",
    status: "Active",
  },
  {
    id: "mem-3",
    initials: "JR",
    name: "Jose Rizal",
    email: "jose@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "mem-4",
    initials: "AR",
    name: "Ana Reyes",
    email: "ana@example.com",
    role: "Student",
    status: "Inactive",
  },
];

type EventPulseSimulatorProps = {
  isHighlighted?: boolean;
};

export default function EventPulseSimulator({
  isHighlighted = false,
}: EventPulseSimulatorProps) {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<"events" | "dashboard">("events");
  const [selectedCategory, setSelectedCategory] = useState<
    "All Events" | "Academic" | "Sports" | "Career"
  >("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(
    new Set()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [detailsModalEvent, setDetailsModalEvent] = useState<CampusEvent | null>(
    null
  );
  const [showAiModal, setShowAiModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Local simulated theme for sandbox viewport
  const [simulatorTheme, setSimulatorTheme] = useState<"light" | "dark">(
    "light"
  );

  // Trigger feedback toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  // Toggle registration
  const handleToggleRegister = (event: CampusEvent) => {
    if (event.status === "closed") return;

    setRegisteredEventIds((prev) => {
      const next = new Set(prev);
      if (next.has(event.id)) {
        next.delete(event.id);
        triggerToast(`Cancelled registration for "${event.title}"`);
      } else {
        next.add(event.id);
        triggerToast(`Registered for "${event.title}" (Simulated)`);
      }
      return next;
    });
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return INITIAL_EVENTS.filter((ev) => {
      const matchesCategory =
        selectedCategory === "All Events" || ev.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast("EventPulse data refreshed");
    }, 450);
  };

  return (
    <article
      id="event-tracker"
      className={`w-full space-y-10 lg:space-y-12 transition-opacity duration-300 ${
        isHighlighted ? "ring-1 ring-ink/30 rounded-2xl p-2 sm:p-4" : ""
      }`}
    >
      {/* ── 1. Editorial Case Study Header ── */}
      <div
        data-project-copy
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/10 dark:border-white/10"
      >
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="text-ink font-semibold">02</span>
            <span className="opacity-30">/</span>
            <span>Full-Stack Web Application</span>
            <span className="opacity-30">·</span>
            <span>Campus Event Management</span>
          </div>

          <h3 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-semibold text-ink tracking-[-0.03em] leading-[1.06]">
            EventPulse
          </h3>

          <p className="font-display text-lg sm:text-xl font-medium text-ink/85 tracking-[-0.015em] leading-[1.35]">
            Campus event management and registration system.
          </p>
        </div>

        {/* Monochrome Editorial Action Links */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://itelect4-project-rho.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-cta-primary-text bg-ink hover:opacity-90 rounded-full px-6 py-3 transition-all group"
          >
            <span>Visit Live Application</span>
            <ArrowUpRight
              size={15}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>

          <a
            href="https://github.com/EndayaRK/itelect4-project"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-ink border border-black/15 dark:border-white/15 hover:border-ink dark:hover:border-white rounded-full px-5 py-3 transition-colors group"
          >
            <Github size={14} />
            <span>GitHub Repository</span>
            <ArrowUpRight
              size={14}
              className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </a>
        </div>
      </div>

      {/* ── 2. Full-Width Desktop Application Stage ── */}
      <div
        data-project-preview
        data-lenis-prevent
        className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#141416] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_28px_70px_-15px_rgba(0,0,0,0.55)] overflow-hidden w-full flex flex-col transition-colors duration-300"
      >
        {/* Minimal Monochrome Application Frame Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#F6F5F2] dark:bg-[#18181C] border-b border-black/8 dark:border-white/8 flex items-center justify-between gap-4 select-none font-mono text-[11px] text-muted">
          <div className="flex items-center gap-3 truncate">
            <span className="uppercase tracking-[0.16em] text-ink font-medium">
              Interactive Desktop Preview
            </span>
            <span className="opacity-30 hidden sm:inline">/</span>
            <span className="hidden sm:inline truncate">
              View: <strong className="text-ink font-medium capitalize">{activeTab}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh simulator"
              className="inline-flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
            >
              <RotateCw
                size={12}
                className={isRefreshing ? "animate-spin text-ink" : ""}
              />
              <span>Refresh</span>
            </button>

            <a
              href="https://itelect4-project-rho.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <span>Open Live</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* ── Simulated Application Viewport Canvas ── */}
        <div
          className={`flex flex-col min-h-[580px] p-4 sm:p-6 transition-colors duration-200 relative ${
            simulatorTheme === "dark"
              ? "bg-[#0F0F12] text-[#F4F4F5]"
              : "bg-[#FAFAFC] text-[#18181B]"
          }`}
        >
          {/* Toast Notification Container */}
          {toastMessage && (
            <div className="absolute top-4 right-4 z-40 bg-indigo-600 text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 size={14} className="shrink-0 text-emerald-300" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ── 1. Top App Header ── */}
          <header className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-black/5 dark:border-white/5 shrink-0">
            {/* Left: Purple calendar + Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                <Calendar size={17} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight font-display">
                    EventPulse
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[9px] font-mono font-bold tracking-wider text-muted uppercase">
                  Campus Tracker
                </p>
              </div>
            </div>

            {/* Center: Navigation Tabs */}
            <nav className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "dashboard"
                    ? "bg-white dark:bg-[#1E1E24] text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "text-muted hover:text-ink"
                }`}
              >
                <span>🎛️</span>
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("events")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "events"
                    ? "bg-white dark:bg-[#1E1E24] text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "text-muted hover:text-ink"
                }`}
              >
                <span>📅</span>
                <span>Events</span>
                {registeredEventIds.size > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {registeredEventIds.size}
                  </span>
                )}
              </button>
            </nav>

            {/* Right: Sign In + Theme Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  triggerToast("Session Active: Guest Student (Role: Student)")
                }
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <span>→]</span>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSimulatorTheme((t) => (t === "light" ? "dark" : "light"))
                }
                aria-label="Toggle simulator theme"
                className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {simulatorTheme === "light" ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
          </header>

          {/* ── 2. VIEW A: EXPLORE CAMPUS EVENTS ── */}
          {activeTab === "events" && (
            <div className="pt-5 space-y-6 flex-1 flex flex-col">
              {/* Gradient Hero Banner */}
              <div className="bg-gradient-to-r from-indigo-100/80 via-purple-100/60 to-violet-50/40 dark:from-indigo-950/40 dark:to-purple-950/20 border border-indigo-200/50 dark:border-indigo-800/30 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="max-w-2xl">
                  <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
                    Explore Campus Events
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed">
                    Discover workshops, sports tournaments, hackathons, and
                    career fairs happening across the university.
                  </p>
                </div>
              </div>

              {/* Search & Category Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, description, or location..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1A20] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    ["All Events", "Academic", "Sports", "Career"] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                        selectedCategory === cat
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "border-black/10 dark:border-white/10 bg-white dark:bg-[#18181D] text-muted hover:text-ink"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredEvents.map((event) => {
                  const isRegistered = registeredEventIds.has(event.id);
                  const effectiveBooked =
                    event.initialBooked + (isRegistered ? 1 : 0);
                  const remaining = Math.max(
                    0,
                    event.totalCapacity - effectiveBooked
                  );
                  const bookedPercentage = Math.round(
                    (effectiveBooked / event.totalCapacity) * 100
                  );

                  return (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-indigo-500/30 transition-all"
                    >
                      <div>
                        {/* Card Header: Date & Status */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-center font-mono font-bold leading-tight text-[10px] border border-indigo-200/50 dark:border-indigo-800/40">
                              <div>{event.month}</div>
                              <div className="text-xs">{event.day}</div>
                            </div>
                            <span className="text-[11px] font-semibold text-muted">
                              {event.category}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex items-center gap-1 ${
                              event.status === "open"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20"
                                : event.status === "ongoing"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-500/20"
                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-300/30"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                event.status === "open"
                                  ? "bg-emerald-500 animate-pulse"
                                  : event.status === "ongoing"
                                  ? "bg-amber-500"
                                  : "bg-zinc-400"
                              }`}
                            />
                            {event.status}
                          </span>
                        </div>

                        {/* Title & Location */}
                        <h3 className="font-display font-bold text-sm text-ink line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-[11px] text-muted flex items-center gap-1 mt-1 truncate">
                          <MapPin size={11} className="shrink-0 text-indigo-500" />
                          <span className="truncate">{event.location}</span>
                        </p>

                        <p className="text-[11px] text-muted line-clamp-2 mt-2 leading-relaxed">
                          {event.description}
                        </p>

                        {/* Capacity meter */}
                        <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-muted">
                            <span>
                              Cap: <strong>{event.totalCapacity}</strong>
                            </span>
                            <span>
                              Remaining:{" "}
                              <strong
                                className={
                                  remaining === 0
                                    ? "text-rose-500"
                                    : "text-emerald-600 dark:text-emerald-400"
                                }
                              >
                                {remaining}
                              </strong>{" "}
                              ({bookedPercentage}% booked)
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                bookedPercentage >= 100
                                  ? "bg-zinc-400"
                                  : bookedPercentage > 50
                                  ? "bg-indigo-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${bookedPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                        <button
                          type="button"
                          onClick={() => setDetailsModalEvent(event)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg border border-black/10 dark:border-white/10 text-[11px] font-semibold text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          Details
                        </button>

                        <button
                          type="button"
                          disabled={event.status === "closed"}
                          onClick={() => handleToggleRegister(event)}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                            event.status === "closed"
                              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-700"
                              : isRegistered
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                          }`}
                        >
                          {event.status === "closed" ? (
                            "Closed"
                          ) : isRegistered ? (
                            <>
                              <Check size={12} />
                              <span>Registered</span>
                            </>
                          ) : (
                            <>
                              <span>Register</span>
                              <span>→</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredEvents.length === 0 && (
                <div className="py-12 text-center text-muted">
                  <p className="text-xs">No events match your search criteria.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All Events");
                    }}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── 3. VIEW B: EVENT MANAGEMENT HUB (DASHBOARD) ── */}
          {activeTab === "dashboard" && (
            <div className="pt-5 space-y-6 flex-1 flex flex-col">
              {/* Dashboard Hero Banner */}
              <div className="bg-gradient-to-r from-indigo-100/80 via-purple-100/60 to-violet-50/40 dark:from-indigo-950/40 dark:to-purple-950/20 border border-indigo-200/50 dark:border-indigo-800/30 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
                    Event Management Hub
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                    University event operations, active capacity overview, and
                    campus member directory.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("events")}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1A1A22] border border-black/10 dark:border-white/10 text-xs font-semibold text-ink hover:border-indigo-500/40 shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>📅</span>
                    <span>Browse Events →</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAiModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles size={13} />
                    <span>✨ AI Review</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {/* Metric 1 */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                    Total Events
                  </div>
                  <div className="font-display text-2xl font-extrabold text-ink mt-1">
                    4
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <span>↑ 2 upcoming</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                    Active Members
                  </div>
                  <div className="font-display text-2xl font-extrabold text-ink mt-1">
                    3 / 4
                  </div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">
                    75% engagement rate
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                    Total Capacity
                  </div>
                  <div className="font-display text-2xl font-extrabold text-ink mt-1">
                    430
                  </div>
                  <div className="text-[10px] text-muted mt-1">
                    Spots across venues
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                    AI Tools
                  </div>
                  <div className="font-display text-lg font-bold text-ink mt-1 flex items-center gap-1.5 truncate">
                    <Bot size={16} className="text-indigo-500 shrink-0" />
                    <span className="truncate">Event Reviewer</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                    ● Model Online
                  </div>
                </div>
              </div>

              {/* Campus Members & Organizers Section */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-display font-bold text-sm text-ink">
                      Campus Members &amp; Organizers
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted">
                    {MEMBERS.length} Registered Users
                  </span>
                </div>

                {/* Member Roster List */}
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {MEMBERS.map((member) => (
                    <div
                      key={member.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar Initials */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs text-white ${
                            member.role === "Admin"
                              ? "bg-rose-500"
                              : member.role === "Organizer"
                              ? "bg-indigo-600"
                              : "bg-emerald-600"
                          }`}
                        >
                          {member.initials}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-ink">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-muted font-mono">
                            {member.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:ml-auto">
                        {/* Role tag */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            member.role === "Student"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20"
                              : member.role === "Organizer"
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-500/20"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-500/20"
                          }`}
                        >
                          Role: {member.role}
                        </span>

                        {/* Status */}
                        <span
                          className={`text-[10px] font-semibold flex items-center gap-1 ${
                            member.status === "Active"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-zinc-400"
                            }`}
                          />
                          {member.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Modal: Event Details ── */}
          {detailsModalEvent && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-white dark:bg-[#18181D] border border-black/10 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
                <button
                  type="button"
                  onClick={() => setDetailsModalEvent(null)}
                  className="absolute top-4 right-4 text-muted hover:text-ink p-1 rounded-lg"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                    {detailsModalEvent.month} {detailsModalEvent.day}
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    {detailsModalEvent.category} Event
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-ink">
                  {detailsModalEvent.title}
                </h3>

                <p className="text-xs text-muted leading-relaxed">
                  {detailsModalEvent.description}
                </p>

                <div className="space-y-2 text-xs pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 text-muted">
                    <MapPin size={13} className="text-indigo-500" />
                    <span>
                      <strong>Location:</strong> {detailsModalEvent.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Clock size={13} className="text-indigo-500" />
                    <span>
                      <strong>Schedule:</strong> {detailsModalEvent.time}
                    </span>
                  </div>
                  {detailsModalEvent.speaker && (
                    <div className="flex items-center gap-2 text-muted">
                      <User size={13} className="text-indigo-500" />
                      <span>
                        <strong>Speaker / Lead:</strong> {detailsModalEvent.speaker}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted">
                    <Users size={13} className="text-indigo-500" />
                    <span>
                      <strong>Organizer:</strong> {detailsModalEvent.organizer}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setDetailsModalEvent(null)}
                    className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-muted hover:text-ink transition-colors"
                  >
                    Close
                  </button>
                  {detailsModalEvent.status !== "closed" && (
                    <button
                      type="button"
                      onClick={() => {
                        handleToggleRegister(detailsModalEvent);
                        setDetailsModalEvent(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                    >
                      {registeredEventIds.has(detailsModalEvent.id)
                        ? "Cancel Registration"
                        : "Register Now →"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Modal: AI Reviewer ── */}
          {showAiModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-white dark:bg-[#18181D] border border-black/10 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="absolute top-4 right-4 text-muted hover:text-ink p-1 rounded-lg"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">
                      AI Event Intelligence
                    </h3>
                    <p className="text-[10px] text-muted">
                      Powered by Gemini Flash-Lite Analytics
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    <span>Overall Event Readiness Score</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                      94 / 100
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    "AI in Education" has optimal venue placement. Recommend
                    sending reminder notifications 48 hours prior to maximize
                    attendance.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-ink">Automated Insights:</div>
                  <ul className="space-y-1.5 text-muted text-[11px]">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500">✓</span>
                      <span>
                        Sports Fest has sufficient indoor buffer capacity.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500">✓</span>
                      <span>
                        Career Fair achieved 100% capacity threshold.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-indigo-500">→</span>
                      <span>
                        Predicted university attendance across all events: 88%.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end pt-2 border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Editorial Case Study Breakdown ── */}
      <div
        data-project-copy
        className="pt-8 border-t border-black/10 dark:border-white/10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start"
      >
        {/* Left Column: Overview & Typographic Stack */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Overview
            </p>
            <p className="font-body text-sm sm:text-[15px] leading-[1.75] text-muted">
              Developed and deployed a full-stack campus event platform for university
              communities. Supports role-based permissions for Students, Organizers, and
              Administrators, live capacity tracking, interactive event registration, and an
              administrative operations view.
            </p>
          </div>

          <div className="pt-6 border-t border-black/8 dark:border-white/8 space-y-2.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Technology Stack
            </p>
            <p className="font-mono text-xs sm:text-[13px] text-ink/90 leading-relaxed tracking-tight">
              {[
                "React",
                "TypeScript",
                "Tailwind CSS",
                "Node.js",
                "Express.js",
                "MongoDB",
                "JWT Authentication",
                "Vercel",
              ].join("   ·   ")}
            </p>
          </div>
        </div>

        {/* Right Column: Role & Technical Contributions */}
        <div className="lg:col-span-7 lg:border-l lg:border-black/10 dark:lg:border-white/10 lg:pl-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Role &amp; Contributions
            </span>
            <span className="font-display text-sm font-semibold text-ink">
              Full-Stack Developer
            </span>
          </div>

          <dl className="space-y-4 text-sm">
            <div className="grid grid-cols-[28px_1fr] gap-3 items-baseline">
              <dt className="font-mono text-[11px] text-muted">01</dt>
              <dd className="text-muted leading-[1.68]">
                <strong className="text-ink font-medium">
                  Role-Based Authentication &amp; Access Control:
                </strong>{" "}
                Implemented JWT session authentication separating Student, Event Organizer,
                and System Administrator permissions across protected views.
              </dd>
            </div>

            <div className="grid grid-cols-[28px_1fr] gap-3 items-baseline">
              <dt className="font-mono text-[11px] text-muted">02</dt>
              <dd className="text-muted leading-[1.68]">
                <strong className="text-ink font-medium">
                  Event Capacity &amp; Registration Workflow:
                </strong>{" "}
                Built attendee registration with real-time remaining slot updates and event
                status transitions (
                <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-ink">
                  open
                </code>
                ,{" "}
                <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-ink">
                  ongoing
                </code>
                ,{" "}
                <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-ink">
                  closed
                </code>
                ).
              </dd>
            </div>

            <div className="grid grid-cols-[28px_1fr] gap-3 items-baseline">
              <dt className="font-mono text-[11px] text-muted">03</dt>
              <dd className="text-muted leading-[1.68]">
                <strong className="text-ink font-medium">
                  Campus Operations &amp; Member Directory:
                </strong>{" "}
                Developed the administrative dashboard for monitoring campus-wide events,
                venue utilization, and registered student directories.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
