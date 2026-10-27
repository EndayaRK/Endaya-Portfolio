import { ArrowUpRight, Calendar, ExternalLink, Globe, Lock, MapPin, Package, Shield, Smartphone, Users } from "lucide-react";
import type { PreviewVariant } from "../data";

type ProjectPreviewProps = {
  variant: PreviewVariant;
  label: string;
  liveUrl?: string;
};

export default function ProjectPreview({ variant, label, liveUrl }: ProjectPreviewProps) {
  return (
    <div className="w-full rounded-2xl border border-border bg-surface shadow-xl flex flex-col font-mono group">
      {/* Modern Technical Header (No Mac OS dots) */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-surface/85 text-xs">
        {/* Interactive URL bar */}
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-surface border border-border hover:border-ink/40 rounded-lg px-3 py-1 text-[11px] text-ink/85 transition-colors group/url max-w-[280px] sm:max-w-xs truncate"
            title={`Open live deployment: ${liveUrl}`}
          >
            <Lock size={11} className="text-cta-primary shrink-0" />
            <span className="text-muted text-[10px]">https://</span>
            <span className="font-mono text-ink font-medium truncate">{label}</span>
            <ExternalLink
              size={11}
              className="text-muted group-hover/url:text-cta-primary ml-auto shrink-0 transition-colors"
            />
          </a>
        ) : (
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-2.5 py-1 text-[11px] text-ink/70">
            <Globe size={11} className="text-cta-primary shrink-0" />
            <span className="font-mono">{label}</span>
          </div>
        )}

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1.5 text-cta-primary font-medium">
            <span className="w-2 h-2 rounded-full bg-cta-primary animate-pulse" />
            <span className="hidden xs:inline">Vercel Edge</span>
            <span>200 OK</span>
          </span>
        </div>
      </div>

      {/* Dynamic Realistic UI Simulation */}
      <div className="p-3.5 sm:p-5 bg-ink/40 select-none">
        {variant === "dashboard" && <EventTrackerDashboardPreview liveUrl={liveUrl} />}
        {variant === "table" && <AutoAvenueTablePreview />}
        {variant === "mobile" && <PalengkeHubMobilePreview />}
      </div>
    </div>
  );
}

function EventTrackerDashboardPreview({ liveUrl }: { liveUrl?: string }) {
  return (
    <div className="space-y-3 font-body text-xs">
      {/* App Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cta-primary/20 border border-cta-primary/40 text-cta-primary flex items-center justify-center font-bold text-xs">
            ET
          </div>
          <div>
            <span className="font-display font-semibold text-ink text-sm">Event Tracker</span>
            <span className="block font-mono text-[10px] text-muted">v3.2 · Full-Stack Web App</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="bg-surface-strong px-2.5 py-1 rounded-md border border-border/60 text-cta-primary">
            MongoDB Atlas
          </span>
          <span className="bg-surface-strong px-2.5 py-1 rounded-md border border-border/60 text-cta-primary">
            JWT Auth
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="bg-cta-primary/20 text-cta-primary px-2.5 py-1 rounded-lg border border-cta-primary/40 font-medium">
            Registered (3)
          </span>
          <span className="text-muted hover:text-ink px-2 py-1">Upcoming (12)</span>
          <span className="text-muted hover:text-ink px-2 py-1 hidden sm:inline">Archived</span>
        </div>

        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-cta-primary hover:underline font-mono"
          >
            <span>Live Demo</span>
            <ArrowUpRight size={12} />
          </a>
        )}
      </div>

      {/* Interactive-feeling Event Cards */}
      <div className="space-y-2.5">
        <div className="rounded-xl border border-line/90 bg-panel/70 p-3 flex items-center justify-between gap-3 shadow-sm hover:border-amber/50 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-paper text-xs sm:text-sm">
                De La Salle Tech Summit 2026
              </span>
              <span className="font-mono text-[9px] bg-teal/15 text-cta-primary border border-cta-primary/40 px-2 py-0.5 rounded-full font-medium">
                Confirmed Pass
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted">
              <span className="flex items-center gap-1 text-paper/80">
                <Calendar size={11} className="text-amber" /> Oct 28, 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={11} /> DLSL Auditorium
              </span>
              <span className="flex items-center gap-1 text-teal">
                <Users size={11} /> 142 Attendees
              </span>
            </div>
          </div>

          <span className="font-mono text-[11px] text-amber border border-amber/40 rounded-lg px-2.5 py-1.5 bg-amber/10 shrink-0">
            View QR Pass
          </span>
        </div>

        <div className="rounded-xl border border-line/60 bg-panel/40 p-3 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink text-xs sm:text-sm">
                Full-Stack Architecture &amp; System Dev
              </span>
              <span className="font-mono text-[9px] bg-amber/15 text-amber border border-amber/40 px-2 py-0.5 rounded-full">
                Open Registration
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted">
              <span className="flex items-center gap-1">
                <Calendar size={11} className="text-amber" /> Nov 14, 2026
              </span>
              <span className="flex items-center gap-1">
                <Users size={11} /> 85 / 100 Capacity
              </span>
            </div>
          </div>

          <span className="font-mono text-[11px] text-muted border border-line rounded-lg px-2.5 py-1.5 shrink-0">
            Details
          </span>
        </div>
      </div>
    </div>
  );
}

function AutoAvenueTablePreview() {
  return (
    <div className="space-y-3 font-mono text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-line/50">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-amber" />
          <span className="text-paper font-semibold text-xs font-display">
            Auto Avenue Inventory Management Ledger
          </span>
        </div>
        <span className="text-[10px] text-teal flex items-center gap-1 bg-surface-strong px-2 py-0.5 rounded border border-line/60">
          <Shield size={10} /> Role: Warehouse Manager
        </span>
      </div>

      {/* Ledger Table */}
      <div className="border border-line/70 rounded-xl overflow-hidden bg-panel/50">
        <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-surface-strong/80 border-b border-line text-[10px] text-muted font-semibold">
          <div className="col-span-4">PART / ITEM</div>
          <div className="col-span-3 text-center">STOCK LEVEL</div>
          <div className="col-span-3 text-center">THRESHOLD</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        <div className="divide-y divide-line/40 text-[10px]">
          <div className="grid grid-cols-12 gap-1 px-3 py-2 items-center bg-rose-500/5">
            <div className="col-span-4 text-ink font-medium truncate">Disc Brake Rotor Set</div>
            <div className="col-span-3 text-center text-cta-primary font-semibold">14 units</div>
            <div className="col-span-3 text-center text-muted">Min: 20</div>
            <div className="col-span-2 text-right text-cta-primary font-semibold">Reorder Alert</div>
          </div>
          <div className="grid grid-cols-12 gap-1 px-3 py-2 items-center">
            <div className="col-span-4 text-ink font-medium truncate">Synthetic Motor Oil 5W-30</div>
            <div className="col-span-3 text-center text-cta-primary font-semibold">52 units</div>
            <div className="col-span-3 text-center text-muted">Min: 15</div>
            <div className="col-span-2 text-right text-cta-primary">Optimal</div>
          </div>
          <div className="grid grid-cols-12 gap-1 px-3 py-2 items-center">
            <div className="col-span-4 text-ink font-medium truncate">High-Pressure Fuel Pump</div>
            <div className="col-span-3 text-center text-cta-primary font-semibold">8 units</div>
            <div className="col-span-3 text-center text-muted">Min: 10</div>
            <div className="col-span-2 text-right text-cta-primary">Low Stock</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted pt-1">
        <span>Automated Stock Movement Workflows · PHP / MySQL</span>
        <span className="text-cta-primary font-medium">Audit Time Reduced by 60%</span>
      </div>
    </div>
  );
}

function PalengkeHubMobilePreview() {
  return (
    <div className="space-y-3 font-body text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-line/50">
        <div className="flex items-center gap-2">
          <Smartphone size={14} className="text-cta-primary" />
          <span className="text-paper font-semibold text-xs font-display">
            PalengkeHub Capstone Marketplace
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted bg-surface-strong px-2 py-0.5 rounded border border-line/60">
          React Native · Supabase
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
        {/* Stall Visibility Card */}
        <div className="rounded-xl border border-border/80 bg-surface/70 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted">Stall #24 · Wet Market</span>
            <span className="text-[9px] text-cta-primary border border-cta-primary/40 rounded px-1.5 py-0.5 bg-teal/10">
              Open Now
            </span>
          </div>
          <div className="text-paper font-semibold text-xs font-body">Fresh Chicken Breast</div>
          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-line/50">
            <span className="text-amber font-bold text-xs">₱220 / kg</span>
            <span className="text-cta-primary font-medium">Pre-Order Active</span>
          </div>
        </div>

        {/* Admin Dashboard Metric Card */}
        <div className="rounded-xl border border-border/80 bg-surface-strong/80 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted">Admin Market Monitor</span>
            <span className="w-2 h-2 rounded-full bg-cta-primary animate-pulse" />
          </div>
          <div className="text-ink font-semibold text-xs font-body">Daily Pre-Orders: 48</div>
          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-border/50 text-muted">
            <span>Active Stalls: 18</span>
            <span className="text-cta-primary font-semibold">Real-Time DB Sync</span>
          </div>
        </div>
      </div>

      <div className="font-mono text-[10px] text-muted flex items-center justify-between pt-1">
        <span>Stall-Level Price Visibility &amp; Ordering</span>
        <span className="text-cta-primary font-medium">Cross-Platform Expo Engine</span>
      </div>
    </div>
  );
}

