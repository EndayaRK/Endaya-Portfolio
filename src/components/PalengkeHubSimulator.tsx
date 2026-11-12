import { useState } from "react";
import {
  ArrowUpRight,
  BatteryMedium,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flame,
  Github,
  Heart,
  Home,
  MapPin,
  MessageSquare,
  Minus,
  Plus,
  QrCode,
  Receipt,
  RotateCcw,
  Search,
  ShoppingBag,
  Signal,
  Tag,
  User,
  Wifi,
} from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  category: "Gulay" | "Karne" | "Isda" | "Bigas" | "Prutas" | "Manok/Itlog";
  stallName: string;
  stallNumber: string;
  price: number;
  unit: string;
  avgPrice: number;
  tag: "PINAKAMURA" | "MURA";
  savings: number;
  badgeBg: string;
  badgeText: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: "bangus-f12",
    name: "Bangus (Dagupan Medium)",
    category: "Isda",
    stallName: "Aling Nena's Fresh Catch",
    stallNumber: "Stall F-12",
    price: 220,
    unit: "kg",
    avgPrice: 245,
    tag: "PINAKAMURA",
    savings: 25,
    badgeBg: "bg-[#E9F5EE]",
    badgeText: "text-[#1E5136]",
  },
  {
    id: "kamatis-v04",
    name: "Kamatis Tagalog (Ripe)",
    category: "Gulay",
    stallName: "Kuya Ben's Bukid Harvest",
    stallNumber: "Stall V-04",
    price: 75,
    unit: "kg",
    avgPrice: 92,
    tag: "PINAKAMURA",
    savings: 17,
    badgeBg: "bg-[#E9F5EE]",
    badgeText: "text-[#1E5136]",
  },
  {
    id: "liempo-m08",
    name: "Pork Liempo (Fresh Cut)",
    category: "Karne",
    stallName: "Mang Berting's Prime Cuts",
    stallNumber: "Stall M-08",
    price: 340,
    unit: "kg",
    avgPrice: 365,
    tag: "PINAKAMURA",
    savings: 25,
    badgeBg: "bg-[#E9F5EE]",
    badgeText: "text-[#1E5136]",
  },
  {
    id: "bigas-g02",
    name: "Sinandomeng Special",
    category: "Bigas",
    stallName: "Lipa Grain & Bigas Center",
    stallNumber: "Stall G-02",
    price: 54,
    unit: "kg",
    avgPrice: 58,
    tag: "MURA",
    savings: 4,
    badgeBg: "bg-[#FEF7EA]",
    badgeText: "text-[#B45309]",
  },
];

const CATEGORIES = [
  { name: "Gulay", icon: "🥬" },
  { name: "Karne", icon: "🥩" },
  { name: "Isda", icon: "🐟" },
  { name: "Prutas", icon: "🍎" },
  { name: "Manok/Itlog", icon: "🥚" },
  { name: "Bigas", icon: "🌾" },
];

export default function PalengkeHubSimulator({
  isHighlighted = false,
}: {
  isHighlighted?: boolean;
}) {
  // Simulator Navigation & State
  const [activeTab, setActiveTab] = useState<"home" | "cart" | "orders" | "chats" | "profile">("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "bangus-f12": 1,
    "kamatis-v04": 2,
    "liempo-m08": 0,
    "bigas-g02": 0,
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [ticketConfirmed, setTicketConfirmed] = useState(true);
  const [ticketCode] = useState("PH-2416");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stepper logic
  const handleUpdateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });

    const item = PRODUCTS.find((p) => p.id === id);
    if (item && delta > 0) {
      setToastMessage(`+1 ${item.name} (${item.stallNumber})`);
      setTimeout(() => setToastMessage(null), 1600);
    }
  };

  // Cart calculations
  const totalCartCount = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
  const totalCartAmount = PRODUCTS.reduce((sum, item) => {
    return sum + (quantities[item.id] || 0) * item.price;
  }, 0);

  const cartItems = PRODUCTS.filter((item) => (quantities[item.id] || 0) > 0);

  // Simulated GCash checkout
  const handleCheckout = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setTicketConfirmed(true);
      setActiveTab("orders");
    }, 850);
  };

  const handleReset = () => {
    setQuantities({
      "bangus-f12": 1,
      "kamatis-v04": 2,
      "liempo-m08": 0,
      "bigas-g02": 0,
    });
    setTicketConfirmed(true);
    setActiveTab("home");
  };

  const filteredProducts =
    selectedCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <article
      id="palengkehub"
      className={`w-full transition-opacity duration-300 ${
        isHighlighted ? "ring-1 ring-ink/30 rounded-2xl p-2 sm:p-4" : ""
      }`}
    >
      {/* ── Featured Editorial Spread: Case Study (Left) + Mobile Stage (Right) ── */}
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* ── Left Column: Editorial Case Study Narrative ── */}
        <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-between space-y-10 lg:pt-2">
          {/* 1. Project Identity & Overview */}
          <div data-project-copy className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <span className="text-ink font-semibold">01</span>
              <span className="opacity-30">/</span>
              <span>Mobile Application</span>
              <span className="opacity-30">·</span>
              <span>Lipa City, Batangas</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-semibold text-ink tracking-[-0.03em] leading-[1.06]">
                PalengkeHub
              </h3>
              <p className="font-display text-lg sm:text-xl font-medium text-ink/85 tracking-[-0.015em] leading-[1.35]">
                Digital marketplace and price-comparison platform for Lipa City Public Market.
              </p>
            </div>

            <p className="font-body text-sm sm:text-[15px] leading-[1.75] text-muted max-w-xl">
              Designed to complement traditional public-market shopping at Lipa City Public
              Market by making practical digital tools available as technology and consumer
              expectations evolve. The platform brings consumers, stall vendors, and market
              administrators together in one integrated system.
            </p>

            {/* Project Purpose & Intended Capabilities */}
            <div className="pt-2 space-y-2.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Project Objectives &amp; Capabilities
              </p>
              <ul className="space-y-1.5 text-xs sm:text-[13.5px] text-muted leading-[1.65]">
                <li className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[10px] text-ink/60 select-none">—</span>
                  <span>
                    Help consumers save time through preordering and locate vendors using
                    stall-location information.
                  </span>
                </li>
                <li className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[10px] text-ink/60 select-none">—</span>
                  <span>
                    Provide vendors a platform to promote their products and explore broader
                    business opportunities alongside in-person stall sales.
                  </span>
                </li>
                <li className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[10px] text-ink/60 select-none">—</span>
                  <span>
                    Assist administrators in organizing market operations and reducing manual
                    administrative work through a unified system.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Role & Personal Contributions */}
          <div
            data-project-copy
            className="pt-8 border-t border-black/10 dark:border-white/10 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Role &amp; Contributions
              </span>
              <span className="font-display text-sm font-semibold text-ink">
                Frontend Developer &amp; UI Designer
              </span>
            </div>

            <dl className="space-y-4 text-sm">
              <div className="grid grid-cols-[28px_1fr] gap-3 items-baseline">
                <dt className="font-mono text-[11px] text-muted">01</dt>
                <dd className="text-muted leading-[1.68]">
                  <strong className="text-ink font-medium">
                    Presyo Check Price Comparison:
                  </strong>{" "}
                  Built the real-time vendor comparison view so market-goers can inspect
                  per-kilo pricing across wet and dry stalls before ordering.
                </dd>
              </div>

              <div className="grid grid-cols-[28px_1fr] gap-3 items-baseline">
                <dt className="font-mono text-[11px] text-muted">02</dt>
                <dd className="text-muted leading-[1.68]">
                  <strong className="text-ink font-medium">
                    Stall Pickup Ticketing Flow:
                  </strong>{" "}
                  Designed the mobile-first cart, scheduled collection windows, and instant
                  claim ticket workflow (e.g., <span className="font-mono text-xs text-ink">PH-2416</span>)
                  with zero delivery fees.
                </dd>
              </div>

              <div className="grid grid-cols-[28px_1fr] gap-3 items-baseline">
                <dt className="font-mono text-[11px] text-muted">03</dt>
                <dd className="text-muted leading-[1.68]">
                  <strong className="text-ink font-medium">
                    Responsive Client Architecture:
                  </strong>{" "}
                  Engineered modular React, TypeScript, and Tailwind CSS views optimized for
                  smartphone shoppers and fast-paced market vendors.
                </dd>
              </div>
            </dl>
          </div>

          {/* 3. Typographic Technology Stack & Editorial Links */}
          <div
            data-project-copy
            className="pt-8 border-t border-black/10 dark:border-white/10 space-y-7"
          >
            <div className="space-y-2.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Technology Stack
              </p>
              <p className="font-mono text-xs sm:text-[13px] text-ink/90 leading-relaxed tracking-tight">
                {["React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "REST API"].join(
                  "   ·   "
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="https://www.palengkehub.site/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-cta-primary-text bg-ink hover:opacity-90 rounded-full px-6 py-3 transition-all group"
              >
                <span>Visit Live Site</span>
                <ArrowUpRight
                  size={15}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>

              <a
                href="https://github.com/EndayaRK/PalengkeHubFinal"
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
        </div>

        {/* ── Right Column: Interactive Mobile Application Stage ── */}
        <div
          data-project-preview
          className="lg:col-span-6 order-1 lg:order-2 w-full flex flex-col items-center"
        >
          <div className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5 sm:p-8 lg:p-10 flex flex-col items-center">
            {/* Minimal Editorial Stage Caption */}
            <div className="w-full max-w-[375px] flex items-center justify-between gap-2 pb-4 mb-2 border-b border-black/8 dark:border-white/8 text-[11px] font-mono text-muted">
              <span className="uppercase tracking-[0.16em]">
                Interactive Mobile Preview
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-muted hover:text-ink transition-colors cursor-pointer"
                title="Reset simulator state"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            </div>

            {/* Chassis Frame */}
            <div
              data-lenis-prevent
              className="w-full max-w-[375px] mx-auto rounded-[42px] border-4 border-[#222226] bg-[#0A0A0C] shadow-[0_28px_64px_-16px_rgba(0,0,0,0.45)] p-2.5 overflow-hidden aspect-[9/18.5] flex flex-col relative select-none"
            >
            {/* Screen Canvas (Warm Pale Linen Canvas: #FBF7EE) */}
            <div
              data-lenis-prevent
              className="rounded-[32px] bg-[#FBF7EE] text-[#1C1917] flex flex-col h-full overflow-hidden text-xs relative font-sans shadow-inner"
            >
              {/* Status Bar */}
              <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#1C1917]/80 bg-transparent shrink-0">
                <span>9:41</span>
                {/* Notch */}
                <div className="w-20 h-4 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1 text-[#1C1917]">
                  <Signal size={11} />
                  <Wifi size={11} />
                  <BatteryMedium size={13} />
                </div>
              </div>

              {/* 1. App Header (Exact Visual Hierarchy) */}
              <div className="px-3.5 pt-2 pb-2 bg-white border-b border-[#EFE8D8] shrink-0 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {/* Basket Logo */}
                    <div className="w-6 h-6 rounded-lg bg-[#D95B16] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      🧺
                    </div>
                    <div className="font-extrabold text-[14px] tracking-tight text-[#1C1917]">
                      Palengke<span className="text-[#D95B16]">Hub</span>
                    </div>
                    {/* Lipa Live pill */}
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E9F5EE] text-[#1E5136] flex items-center gap-1 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Lipa Live
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Wishlist"
                      className="text-rose-500 hover:scale-110 transition-transform"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                    <div className="relative">
                      <Bell size={16} className="text-[#78716C]" />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                        2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dropdown Location Banner */}
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#78716C] font-medium truncate">
                  <MapPin size={10} className="text-[#D95B16] shrink-0" />
                  <span className="font-semibold text-[#1C1917] truncate">
                    Lipa City Public Market
                  </span>
                  <ChevronDown size={10} className="shrink-0 text-[#78716C]" />
                  <span className="text-[9px] text-[#78716C]/80">· Pickup only</span>
                </div>
              </div>

              {/* Toast Feedback */}
              {toastMessage && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-[#1C1917] text-white text-[10px] font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-fadeUp">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* Scrollable Screen Body */}
              <div
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#FBF7EE]"
              >
                {/* ── VIEW: HOME (PRESTYO CHECK & DISCOVERY) ── */}
                {activeTab === "home" && (
                  <div className="space-y-3">
                    {/* 2. Search Pill */}
                    <div className="relative flex items-center">
                      <Search
                        size={13}
                        className="absolute left-3 text-[#78716C] pointer-events-none"
                      />
                      <input
                        type="text"
                        readOnly
                        value=""
                        placeholder="Maghanap ng bangus, kamatis, liempo, bigas..."
                        className="w-full pl-8 pr-3 py-2 bg-white rounded-full border border-[#EFE8D8] text-[10px] text-[#1C1917] placeholder:text-[#78716C] shadow-xs cursor-pointer focus:outline-none"
                      />
                    </div>

                    {/* 3. Horizontal Category Carousel */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1.5 text-[#1C1917]">
                        <span>Mga Kategorya</span>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("All")}
                          className="text-[10px] text-[#D95B16] font-semibold hover:underline"
                        >
                          Lahat ({PRODUCTS.length})
                        </button>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {CATEGORIES.map((cat) => {
                          const isActive = selectedCategory === cat.name;
                          return (
                            <button
                              key={cat.name}
                              type="button"
                              onClick={() =>
                                setSelectedCategory(isActive ? "All" : cat.name)
                              }
                              className={`flex flex-col items-center gap-1 shrink-0 p-1.5 rounded-2xl transition-all ${
                                isActive ? "bg-[#D95B16]/10 scale-105" : "hover:bg-white/80"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base border shadow-xs transition-colors ${
                                  isActive
                                    ? "bg-[#D95B16] text-white border-[#D95B16]"
                                    : "bg-white border-[#EFE8D8] text-[#1C1917]"
                                }`}
                              >
                                {cat.icon}
                              </div>
                              <span className="text-[9px] font-bold text-[#1C1917] leading-tight">
                                {cat.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Interactive "Presyo Check · Ikumpara sa Palengke" Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs font-black text-[#1C1917]">
                          <Tag size={13} className="text-[#D95B16]" />
                          <span>Presyo Check</span>
                          <span className="text-[10px] font-normal text-[#78716C]">
                            · Ikumpara sa Palengke
                          </span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E9F5EE] text-[#1E5136] border border-emerald-500/20">
                          Updated Today
                        </span>
                      </div>

                      {/* 4 Cards with exact visual tokens & functional steppers */}
                      <div className="space-y-2.5">
                        {filteredProducts.map((item) => {
                          const qty = quantities[item.id] || 0;
                          return (
                            <div
                              key={item.id}
                              className="p-3 bg-white rounded-2xl border border-[#EFE8D8] shadow-xs hover:border-[#D95B16]/30 transition-all space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-extrabold text-[12px] text-[#1C1917] leading-snug">
                                      {item.name}
                                    </h4>
                                    <span
                                      className={`text-[8px] font-black px-1.5 py-0.5 rounded tracking-wider ${item.badgeBg} ${item.badgeText}`}
                                    >
                                      {item.tag}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[#78716C] font-medium mt-0.5">
                                    {item.stallName} ·{" "}
                                    <span className="font-bold text-[#1C1917]">
                                      {item.stallNumber}
                                    </span>
                                  </div>
                                </div>

                                {/* Current Price vs Average */}
                                <div className="text-right shrink-0">
                                  <div className="text-[13px] font-black text-[#D95B16] leading-none">
                                    ₱{item.price}
                                    <span className="text-[9px] font-medium text-[#78716C]">
                                      /{item.unit}
                                    </span>
                                  </div>
                                  <div className="text-[9px] text-[#78716C] line-through mt-0.5 font-mono">
                                    avg ₱{item.avgPrice}
                                  </div>
                                </div>
                              </div>

                              {/* Price Comparison Meter Bar */}
                              <div className="bg-[#FBF7EE] p-1.5 rounded-xl border border-[#EFE8D8] flex items-center justify-between text-[9px]">
                                <div className="flex items-center gap-1 font-semibold text-[#1E5136]">
                                  <Flame size={10} className="text-[#D95B16]" />
                                  <span>Mura ng ₱{item.savings}/{item.unit} vs average</span>
                                </div>
                                <span className="font-mono text-[9px] text-[#78716C]">
                                  Lipa Market Live
                                </span>
                              </div>

                              {/* Interactive Stepper Button (- 1 +) */}
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-[#78716C] font-medium">
                                  Subtotal:{" "}
                                  <strong className="text-[#1C1917]">
                                    ₱{qty * item.price}
                                  </strong>
                                </span>

                                <div className="flex items-center gap-1.5 bg-[#FBF7EE] border border-[#EFE8D8] rounded-xl p-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQty(item.id, -1)}
                                    disabled={qty === 0}
                                    aria-label={`Decrease ${item.name}`}
                                    className="w-5 h-5 rounded-lg bg-white flex items-center justify-center text-[#1C1917] hover:bg-gray-100 disabled:opacity-30 active:scale-95 transition-all shadow-xs"
                                  >
                                    <Minus size={10} strokeWidth={2.5} />
                                  </button>

                                  <span className="w-6 text-center font-bold text-[11px] text-[#1C1917]">
                                    {qty}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQty(item.id, 1)}
                                    aria-label={`Increase ${item.name}`}
                                    className="w-5 h-5 rounded-lg bg-[#D95B16] text-white flex items-center justify-center hover:bg-[#c24f11] active:scale-95 transition-all shadow-xs"
                                  >
                                    <Plus size={10} strokeWidth={2.5} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── VIEW: PALENGKART & CHECKOUT ── */}
                {activeTab === "cart" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-[#EFE8D8]">
                      <div className="font-bold text-xs text-[#1C1917] flex items-center gap-1.5">
                        <ShoppingBag size={13} className="text-[#D95B16]" />
                        <span>PalengKart ({totalCartCount} items)</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#1E5136] bg-[#E9F5EE] px-2 py-0.5 rounded-full font-bold">
                        ₱0 Delivery Fee
                      </span>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="py-10 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-white border border-[#EFE8D8] text-[#D95B16] flex items-center justify-center mx-auto shadow-xs text-xl">
                          🧺
                        </div>
                        <div className="text-xs font-bold text-[#1C1917]">
                          Walang laman ang iyong PalengKart
                        </div>
                        <p className="text-[10px] text-[#78716C] max-w-[200px] mx-auto">
                          Magdagdag ng kamatis, bangus, o liempo gamit ang stepper sa Presyo Check.
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab("home")}
                          className="mt-2 text-xs font-bold px-4 py-2 rounded-full bg-[#D95B16] text-white shadow-xs"
                        >
                          Bumalik sa Presyo Check
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          data-lenis-prevent
                          className="space-y-2 max-h-[190px] overflow-y-auto pr-1"
                        >
                          {cartItems.map((item) => {
                            const qty = quantities[item.id] || 0;
                            return (
                              <div
                                key={item.id}
                                className="p-2.5 bg-white rounded-2xl border border-[#EFE8D8] flex items-center justify-between text-xs shadow-xs"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="font-extrabold text-[#1C1917] truncate text-[11px]">
                                    {item.name}
                                  </div>
                                  <div className="text-[9px] text-[#78716C] truncate">
                                    {item.stallNumber} · {item.stallName}
                                  </div>
                                  <div className="text-[11px] font-black text-[#D95B16] mt-0.5">
                                    ₱{item.price * qty}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 bg-[#FBF7EE] border border-[#EFE8D8] rounded-xl p-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQty(item.id, -1)}
                                    className="w-5 h-5 rounded-lg bg-white flex items-center justify-center text-[#1C1917] active:scale-95 shadow-xs"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="w-5 text-center font-bold text-[11px]">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQty(item.id, 1)}
                                    className="w-5 h-5 rounded-lg bg-[#D95B16] text-white flex items-center justify-center active:scale-95 shadow-xs"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Summary */}
                        <div className="p-3 bg-white rounded-2xl border border-[#EFE8D8] space-y-1 text-[11px]">
                          <div className="flex justify-between text-[#78716C]">
                            <span>Market Subtotal</span>
                            <span className="font-mono">₱{totalCartAmount}.00</span>
                          </div>
                          <div className="flex justify-between text-[#1E5136] font-bold">
                            <span>Delivery / Staging Fee</span>
                            <span className="bg-[#E9F5EE] px-1.5 py-0.2 rounded text-[10px]">
                              ₱0.00 (Self Pickup)
                            </span>
                          </div>
                          <div className="pt-1.5 border-t border-[#EFE8D8] flex justify-between font-black text-[#1C1917] text-xs">
                            <span>Kabuuang Babayaran</span>
                            <span className="text-[#D95B16]">₱{totalCartAmount}.00</span>
                          </div>
                        </div>

                        {/* Simulated GCash Pay Button */}
                        <button
                          type="button"
                          onClick={handleCheckout}
                          disabled={isProcessingPayment}
                          className="w-full py-2.5 rounded-xl bg-[#005CE6] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#0051cc] active:scale-98 transition-all shadow-md disabled:opacity-60"
                        >
                          {isProcessingPayment ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Nagpoproseso sa GCash...</span>
                            </>
                          ) : (
                            <>
                              <span>Bayaran sa GCash (Simulate)</span>
                              <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded">
                                ₱{totalCartAmount}
                              </span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* ── VIEW: ORDERS / PICKUP CLAIM STUB (PH-2416) ── */}
                {activeTab === "orders" && (
                  <div className="space-y-3">
                    {ticketConfirmed ? (
                      <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-3.5 shadow-sm space-y-3 relative overflow-hidden">
                        {/* Header bar */}
                        <div className="bg-[#1E5136] text-white -mx-3.5 -mt-3.5 px-3.5 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[11px] font-bold">
                            <CheckCircle2 size={13} className="text-emerald-300" />
                            <span>Pickup Ticket Confirmed</span>
                          </div>
                          <span className="text-[9px] font-mono bg-black/20 px-1.5 py-0.5 rounded">
                            GCash Paid
                          </span>
                        </div>

                        {/* Signature Claim Code: PH-2416 */}
                        <div className="text-center py-0.5">
                          <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider">
                            Pickup Claim Code
                          </div>
                          <div className="font-mono text-3xl font-black text-[#D95B16] tracking-widest my-0.5">
                            {ticketCode}
                          </div>
                          <div className="text-[9px] text-[#78716C]">
                            Ipakita sa stallholder para sa express claim
                          </div>
                        </div>

                        {/* Barcode/QR code container */}
                        <div className="bg-[#FBF7EE] border border-dashed border-[#EFE8D8] rounded-xl p-2.5 flex items-center justify-center gap-3">
                          <QrCode size={36} className="text-[#1C1917] shrink-0" />
                          <div className="text-[9px] text-[#78716C] leading-tight font-mono">
                            <div className="text-[#1C1917] font-bold">
                              PALENGKEHUB-LIPA-AY2026
                            </div>
                            <div className="text-[#1E5136] font-semibold mt-0.5">
                              Ready for Express Pickup
                            </div>
                          </div>
                        </div>

                        {/* Claim Location & Schedule */}
                        <div className="space-y-1.5 text-[10px] pt-1 border-t border-[#EFE8D8] text-[#1C1917]">
                          <div className="flex items-start gap-1.5">
                            <MapPin size={11} className="text-[#D95B16] shrink-0 mt-0.5" />
                            <span>
                              <strong>Lipa City Public Market</strong> · Wet &amp; Dry Section
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Clock size={11} className="text-[#1E5136] shrink-0 mt-0.5" />
                            <span>
                              <strong>Pickup Window:</strong> 5:00 AM – 7:00 PM (Today)
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleReset}
                          className="w-full py-1.5 rounded-xl border border-[#EFE8D8] text-[#78716C] hover:text-[#1C1917] text-[10px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FBF7EE] transition-colors"
                        >
                          <RotateCcw size={10} />
                          <span>Reset Demo &amp; Start Over</span>
                        </button>
                      </div>
                    ) : (
                      <div className="py-8 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-white text-[#78716C] flex items-center justify-center mx-auto border border-[#EFE8D8]">
                          <Receipt size={18} />
                        </div>
                        <div className="text-xs font-bold text-[#1C1917]">
                          Walang active na claim ticket
                        </div>
                        <p className="text-[10px] text-[#78716C] max-w-[200px] mx-auto">
                          Magdagdag ng items sa PalengKart at i-checkout para makuha ang iyong pickup ticket.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── VIEW: CHATS ── */}
                {activeTab === "chats" && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#1C1917] pb-1 border-b border-[#EFE8D8] flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-[#D95B16]" />
                      <span>Mga Mensahe sa Stallholder</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-2xl border border-[#EFE8D8] shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-[#1C1917]">
                          Aling Nena's Fresh Catch
                        </span>
                        <span className="text-[9px] text-[#78716C]">9:38 AM</span>
                      </div>
                      <p className="text-[10px] text-[#1E5136] font-medium">
                        "Opo suki, fresh bagong hango ang bangus ngayon galing Dagupan!"
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-2xl border border-[#EFE8D8] shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-[#1C1917]">
                          Kuya Ben's Bukid Harvest
                        </span>
                        <span className="text-[9px] text-[#78716C]">Kahapon</span>
                      </div>
                      <p className="text-[10px] text-[#78716C]">
                        "Salamat po sa pag-order ng kamatis tagalog!"
                      </p>
                    </div>
                  </div>
                )}

                {/* ── VIEW: PROFILE ── */}
                {activeTab === "profile" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-2xl border border-[#EFE8D8] shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D95B16] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        RE
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#1C1917]">
                          Rhon Kelly Endaya
                        </div>
                        <div className="text-[9px] text-[#1E5136] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Lipa Verified Sukì Member
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-[#EFE8D8] text-[10px] space-y-1.5 text-[#1C1917]">
                      <div className="font-bold text-[11px] pb-1 border-b border-[#EFE8D8]">
                        Sukì Perks &amp; Settings
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-[#78716C]">Default Market</span>
                        <strong>Lipa City Public Market</strong>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-[#78716C]">GCash Verified</span>
                        <strong className="text-[#1E5136]">Connected (0946•••1087)</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Exact Bottom Navigation Bar (5 Tabs) */}
              <div className="bg-white border-t border-[#EFE8D8] px-1 py-2 flex items-center justify-around shrink-0 shadow-lg">
                {/* Tab: Home */}
                <button
                  type="button"
                  onClick={() => setActiveTab("home")}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors ${
                    activeTab === "home" ? "text-[#D95B16]" : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <Home size={15} />
                  <span>Home</span>
                  {activeTab === "home" && (
                    <span className="w-1 h-1 rounded-full bg-[#D95B16]" />
                  )}
                </button>

                {/* Tab: PalengKart */}
                <button
                  type="button"
                  onClick={() => setActiveTab("cart")}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors relative ${
                    activeTab === "cart" ? "text-[#D95B16]" : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <ShoppingBag size={15} />
                  <span>PalengKart</span>
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 right-1 bg-[#D95B16] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                      {totalCartCount}
                    </span>
                  )}
                </button>

                {/* Tab: Orders (Claim stub) */}
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors relative ${
                    activeTab === "orders" ? "text-[#D95B16]" : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <Receipt size={15} />
                  <span>Orders</span>
                  {ticketConfirmed && (
                    <span className="absolute -top-0.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>

                {/* Tab: Chats */}
                <button
                  type="button"
                  onClick={() => setActiveTab("chats")}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors ${
                    activeTab === "chats" ? "text-[#D95B16]" : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <MessageSquare size={15} />
                  <span>Chats</span>
                </button>

                {/* Tab: Profile */}
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors ${
                    activeTab === "profile" ? "text-[#D95B16]" : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <User size={15} />
                  <span>Profile</span>
                </button>
              </div>
            </div>
            </div>

            <div className="mt-4 text-center text-[11px] text-muted font-mono">
              <span>Operate tabs, compare prices, or reserve a stall pickup ticket above</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
