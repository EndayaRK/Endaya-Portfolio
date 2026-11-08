import { useState, useMemo } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  FileText,
  Github,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  Wrench,
  X,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  minLevel: number;
  supplier: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 21,
    name: "Mags (16-inch Alloy)",
    category: "Wheels",
    price: 8000,
    stock: 4,
    minLevel: 10,
    supplier: "Rota Philippines",
  },
  {
    id: 19,
    name: "Exhaust Pipe (Stainless)",
    category: "Exhaust",
    price: 12500,
    stock: 3,
    minLevel: 8,
    supplier: "HKS Performance PH",
  },
  {
    id: 25,
    name: "Ceramic Brake Pads",
    category: "Brakes",
    price: 3200,
    stock: 5,
    minLevel: 10,
    supplier: "Brembo Dist. Manila",
  },
  {
    id: 12,
    name: "Motolite Gold 1SMF Battery",
    category: "Electrical",
    price: 5400,
    stock: 14,
    minLevel: 5,
    supplier: "Motolite PH",
  },
  {
    id: 8,
    name: "Synthetic Engine Oil 5W-40",
    category: "Lubricants",
    price: 2850,
    stock: 22,
    minLevel: 10,
    supplier: "Motul Philippines",
  },
  {
    id: 15,
    name: "Racing Radiator Aluminum",
    category: "Cooling",
    price: 9600,
    stock: 8,
    minLevel: 4,
    supplier: "Koyo Cooling PH",
  },
];

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: string;
  total: number;
  status: "Approved" | "Pending Approval";
  date: string;
}

const INITIAL_POS: PurchaseOrder[] = [
  {
    id: "PO-2026-089",
    supplier: "Rota Philippines",
    items: "10x Mags (16-inch Alloy)",
    total: 55000,
    status: "Approved",
    date: "Oct 28, 2026",
  },
  {
    id: "PO-2026-088",
    supplier: "HKS Performance PH",
    items: "8x Exhaust Pipe (Stainless)",
    total: 68000,
    status: "Approved",
    date: "Oct 27, 2026",
  },
  {
    id: "PO-2026-087",
    supplier: "Brembo Dist. Manila",
    items: "15x Ceramic Brake Pads",
    total: 32000,
    status: "Pending Approval",
    date: "Oct 26, 2026",
  },
];

interface SaleRecord {
  id: string;
  date: string;
  customer: string;
  product: string;
  qty: number;
  unitPrice: number;
  total: number;
  paymentMethod: string;
}

const INITIAL_SALES: SaleRecord[] = [
  {
    id: "#104",
    date: "Oct 28, 2026",
    customer: "Batangas Autoworks",
    product: "Mags (16-inch Alloy)",
    qty: 2,
    unitPrice: 8000,
    total: 16000,
    paymentMethod: "Bank Transfer",
  },
  {
    id: "#103",
    date: "Oct 28, 2026",
    customer: "Lipa Speed Shop",
    product: "Motolite Gold 1SMF Battery",
    qty: 1,
    unitPrice: 5400,
    total: 5400,
    paymentMethod: "Cash",
  },
  {
    id: "#102",
    date: "Oct 26, 2026",
    customer: "Prime Auto Care",
    product: "Racing Radiator Aluminum",
    qty: 2,
    unitPrice: 9600,
    total: 19200,
    paymentMethod: "GCash",
  },
  {
    id: "#101",
    date: "Oct 25, 2026",
    customer: "South Garage",
    product: "Synthetic Engine Oil 5W-40",
    qty: 2,
    unitPrice: 2850,
    total: 5700,
    paymentMethod: "Cash",
  },
];

type AutoAvenueSimulatorProps = {
  isHighlighted?: boolean;
};

export default function AutoAvenueSimulator({
  isHighlighted = false,
}: AutoAvenueSimulatorProps) {
  const [activeTab, setActiveTab] = useState<
    "Dashboard" | "Products" | "Purchase Order" | "Sales"
  >("Dashboard");

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>(INITIAL_POS);
  const [sales] = useState<SaleRecord[]>(INITIAL_SALES);

  const [productSearch, setProductSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCaseStudyModal, setShowCaseStudyModal] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  // Restock logic
  const handleRestock = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = p.stock + 5;
          triggerToast(`Restocked +5 units of ${p.name}. Stock now: ${newStock}`);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Generate PO for low stock items
  const handleGeneratePO = () => {
    const lowStock = products.filter((p) => p.stock < p.minLevel);
    if (lowStock.length === 0) {
      triggerToast("All products are currently above minimum stock levels.");
      return;
    }

    const newPO: PurchaseOrder = {
      id: `PO-2026-09${purchaseOrders.length}`,
      supplier: lowStock[0].supplier,
      items: `Replenishment Batch: ${lowStock.map((p) => p.name).join(", ")}`,
      total: lowStock.reduce((acc, p) => acc + p.price * 5, 0),
      status: "Approved",
      date: "Just Now",
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    triggerToast(
      `Purchase orders generated for ${lowStock.length} low-stock item(s).`
    );
  };

  // Approve a pending PO
  const handleApprovePO = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          triggerToast(`PO ${poId} approved for ${po.supplier} (₱${po.total.toLocaleString()}).`);
          return { ...po, status: "Approved" as const };
        }
        return po;
      })
    );
  };

  // Dynamic calculations
  const totalProductsCount = products.length;
  const totalSalesCount = sales.length;
  const lowStockItems = useMemo(
    () => products.filter((p) => p.stock < p.minLevel),
    [products]
  );
  const inventoryValue = useMemo(
    () => products.reduce((acc, p) => acc + p.price * p.stock, 0),
    [products]
  );
  const totalGrossRevenue = useMemo(
    () => sales.reduce((acc, s) => acc + s.total, 0),
    [sales]
  );

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const activeTabSlug = activeTab.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      id="auto-avenue"
      className={`w-full rounded-2xl border transition-all duration-300 p-6 sm:p-8 lg:p-10 backdrop-blur-md ${
        isHighlighted
          ? "border-ink shadow-[0_12px_36px_-6px_rgb(0_0_0/0.12)] dark:shadow-[0_12px_36px_-6px_rgb(0_0_0/0.6)] ring-2 ring-ink bg-white/90 dark:bg-[#16161A]/95"
          : "border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#141416]/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-black/20 dark:hover:border-white/20"
      }`}
    >
      {/* ── Top Banner Tag (Portfolio Showcase Header) ── */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/5 dark:border-white/5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144A2A] text-white font-bold tracking-wide shadow-xs">
            <Sparkles size={11} />
            ★ FEATURED ENTERPRISE ERP SYSTEM
          </span>
          <span className="text-muted/40">·</span>
          <span className="font-mono text-muted">v2.4 Production</span>
          <span className="text-muted/40">·</span>
          <span className="text-muted">Automotive Dealership Network</span>
        </div>
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Interactive Desktop Sandbox
        </span>
      </div>

      {/* ── Desktop Browser Sandbox Container ── */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#141416] shadow-2xl overflow-hidden w-full max-w-4xl mx-auto flex flex-col transition-colors duration-300">
        {/* ── Browser Header Chrome ── */}
        <div className="px-4 py-3 bg-[#F4F4F6] dark:bg-[#1C1C20] border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-3 select-none">
          {/* Traffic light dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/40 inline-block shadow-inner" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40 inline-block shadow-inner" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/40 inline-block shadow-inner" />
          </div>

          {/* URL Address Bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/[0.05] dark:bg-white/[0.07] border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono text-[#52525B] dark:text-[#A1A1AA] flex-1 max-w-md mx-auto justify-between shadow-inner">
            <div className="flex items-center gap-2 truncate">
              <Lock size={12} className="text-emerald-600 shrink-0" />
              <span className="truncate">
                https://autoavenue-ims.internal.net/
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  {activeTabSlug}
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => triggerToast("IMS database cache refreshed.")}
              aria-label="Refresh simulator"
              className="hover:text-ink transition-colors shrink-0"
            >
              <RefreshCw size={12} />
            </button>
          </div>

          {/* Subtitle / Demo Link */}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#52525B] dark:text-[#A1A1AA]">
            <span>Admin Portal</span>
            <ExternalLink size={12} />
          </span>
        </div>

        {/* ── App Header: Deep Forest Green (#144A2A) ── */}
        <div className="bg-[#144A2A] text-white px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#144A2A] flex items-center justify-center font-bold text-sm shadow-xs">
              <Wrench size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight font-display text-white">
                  Auto Avenue IMS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-emerald-100 border border-white/20">
                  Logged in as: Admin
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto text-xs">
            {(["Dashboard", "Products", "Purchase Order", "Sales"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-white text-[#144A2A] shadow-xs"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </nav>
        </div>

        {/* ── Simulated Viewport Content ── */}
        <div className="p-4 sm:p-6 bg-[#FAFAFC] dark:bg-[#0F0F12] min-h-[520px] flex flex-col justify-between text-xs relative">
          {/* Toast Notification Container */}
          {toastMessage && (
            <div className="absolute top-4 right-4 z-40 bg-[#144A2A] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-300" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ── TAB A: DASHBOARD ── */}
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* 4 Metric Cards with Top Colored Borders */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {/* Metric 1: Total Products (Green top border #22C55E) */}
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 shadow-xs border-t-4 border-t-[#22C55E]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                    Total Products
                  </div>
                  <div className="font-display text-2xl font-extrabold text-ink mt-1">
                    {totalProductsCount}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                    Catalog Active
                  </div>
                </div>

                {/* Metric 2: Total Sales (Blue top border #3B82F6) */}
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 shadow-xs border-t-4 border-t-[#3B82F6]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                    Total Sales
                  </div>
                  <div className="font-display text-2xl font-extrabold text-ink mt-1">
                    {totalSalesCount}
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                    Orders Processed
                  </div>
                </div>

                {/* Metric 3: Inventory Value (Purple top border #A855F7) */}
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 shadow-xs border-t-4 border-t-[#A855F7]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                    Inventory Value
                  </div>
                  <div className="font-display text-2xl font-extrabold text-ink mt-1">
                    ₱{inventoryValue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 font-semibold">
                    Warehouse Total
                  </div>
                </div>

                {/* Metric 4: Low Stock Items (Orange top border #F97316) */}
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-4 shadow-xs border-t-4 border-t-[#F97316]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                    Low Stock Items
                  </div>
                  <div className="font-display text-2xl font-extrabold text-[#DC2626] dark:text-rose-400 mt-1">
                    {lowStockItems.length}
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                    <AlertTriangle size={11} />
                    <span>Threshold Triggered</span>
                  </div>
                </div>
              </div>

              {/* Low Stock Alerts Table */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <h3 className="font-display font-bold text-sm text-ink">
                      Low Stock Alerts ({lowStockItems.length})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleGeneratePO}
                    className="px-3.5 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck size={13} />
                    <span>Generate Purchase Order</span>
                  </button>
                </div>

                {/* Alerts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-muted border-b border-black/5 dark:border-white/5 font-mono uppercase tracking-wider">
                        <th className="py-2 px-2">ID</th>
                        <th className="py-2 px-2">Product Name</th>
                        <th className="py-2 px-2">Current Stock</th>
                        <th className="py-2 px-2">Min Level</th>
                        <th className="py-2 px-2">Category</th>
                        <th className="py-2 px-2">Supplier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {lowStockItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-2.5 px-2 font-mono font-bold text-muted">
                            #{item.id}
                          </td>
                          <td className="py-2.5 px-2 font-semibold text-ink">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-2 font-bold text-[#DC2626] dark:text-rose-400">
                            {item.stock}
                          </td>
                          <td className="py-2.5 px-2 text-muted font-mono">
                            {item.minLevel}
                          </td>
                          <td className="py-2.5 px-2 text-muted">{item.category}</td>
                          <td className="py-2.5 px-2 font-medium text-ink">
                            {item.supplier}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Sales Table */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={15} className="text-emerald-700 dark:text-emerald-400" />
                    <h3 className="font-display font-bold text-sm text-ink">
                      Recent Sales
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("Products")}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Record New Sale in Products →</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-muted border-b border-black/5 dark:border-white/5 font-mono uppercase tracking-wider">
                        <th className="py-2 px-2">Order ID</th>
                        <th className="py-2 px-2">Item</th>
                        <th className="py-2 px-2">Qty</th>
                        <th className="py-2 px-2">Unit Price</th>
                        <th className="py-2 px-2">Total Amount</th>
                        <th className="py-2 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {sales.slice(0, 2).map((sale) => (
                        <tr
                          key={sale.id}
                          className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-2.5 px-2 font-mono font-bold text-ink">
                            {sale.id}
                          </td>
                          <td className="py-2.5 px-2 font-semibold text-ink">
                            {sale.product}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-muted">
                            {sale.qty}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-muted">
                            ₱{sale.unitPrice.toLocaleString()}.00
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-[#144A2A] dark:text-emerald-400">
                            ₱{sale.total.toLocaleString()}.00
                          </td>
                          <td className="py-2.5 px-2 text-muted font-mono">
                            {sale.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB B: PRODUCTS VIEW ── */}
          {activeTab === "Products" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                <div>
                  <h3 className="font-display font-bold text-sm text-ink">
                    Automotive Parts Inventory ({products.length})
                  </h3>
                  <p className="text-[11px] text-muted">
                    Real-time stock tracking with one-click supplier replenishment.
                  </p>
                </div>

                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product or supplier..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] text-ink focus:outline-none focus:ring-1 focus:ring-[#144A2A]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] overflow-x-auto shadow-xs">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-muted border-b border-black/5 dark:border-white/5 font-mono uppercase tracking-wider bg-black/[0.02] dark:bg-white/[0.02]">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Stock Level</th>
                      <th className="py-2.5 px-3">Supplier</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {filteredProducts.map((p) => {
                      const isLow = p.stock < p.minLevel;
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3 px-3 font-mono font-bold text-muted">
                            #{p.id}
                          </td>
                          <td className="py-3 px-3 font-semibold text-ink">
                            {p.name}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-medium text-muted">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-ink font-medium">
                            ₱{p.price.toLocaleString()}.00
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`font-bold font-mono ${
                                  isLow
                                    ? "text-[#DC2626] dark:text-rose-400"
                                    : "text-emerald-700 dark:text-emerald-400"
                                }`}
                              >
                                {p.stock} units
                              </span>
                              {isLow && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border border-rose-500/20 font-bold">
                                  Low Stock
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-muted">{p.supplier}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRestock(p.id)}
                              className="px-2.5 py-1 rounded-md bg-[#144A2A] hover:bg-[#1a5b34] text-white text-[10px] font-semibold transition-colors shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={11} />
                              <span>Restock</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB C: PURCHASE ORDER VIEW ── */}
          {activeTab === "Purchase Order" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                <div>
                  <h3 className="font-display font-bold text-sm text-ink">
                    Supplier Purchase Requisitions
                  </h3>
                  <p className="text-[11px] text-muted">
                    Procurement orders issued to verified automotive parts distributors.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePO}
                  className="px-3 py-1.5 rounded-lg bg-[#144A2A] text-white font-semibold text-xs shadow-xs hover:bg-[#1a5b34] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>New Requisition</span>
                </button>
              </div>

              <div className="space-y-3">
                {purchaseOrders.map((po) => (
                  <div
                    key={po.id}
                    className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-ink">
                          {po.id}
                        </span>
                        <span className="text-muted">·</span>
                        <span className="font-bold text-xs text-ink">
                          {po.supplier}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            po.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-500/20"
                          }`}
                        >
                          {po.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">{po.items}</p>
                      <span className="text-[10px] text-muted font-mono">
                        Issued: {po.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-muted">
                          PO Total
                        </div>
                        <div className="font-mono font-bold text-sm text-[#144A2A] dark:text-emerald-400">
                          ₱{po.total.toLocaleString()}.00
                        </div>
                      </div>

                      {po.status === "Pending Approval" && (
                        <button
                          type="button"
                          onClick={() => handleApprovePO(po.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          Approve PO
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB D: SALES VIEW ── */}
          {activeTab === "Sales" && (
            <div className="space-y-4">
              {/* Financial Summary Banner */}
              <div className="p-4 rounded-xl bg-[#144A2A]/5 dark:bg-[#144A2A]/20 border border-[#144A2A]/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-muted">
                    Total Gross Revenue
                  </div>
                  <div className="font-display text-2xl font-extrabold text-[#144A2A] dark:text-emerald-400">
                    ₱{totalGrossRevenue.toLocaleString()}.00
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-muted">
                    Orders Logged
                  </div>
                  <div className="font-display text-lg font-bold text-ink">
                    {sales.length} Transactions
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-muted">
                    Average Order Value
                  </div>
                  <div className="font-display text-lg font-bold text-ink">
                    ₱{(totalGrossRevenue / sales.length).toLocaleString()}.00
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-muted">
                    Payment Status
                  </div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={13} />
                    <span>100% Settled</span>
                  </div>
                </div>
              </div>

              {/* Transaction Ledger Table */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161B] overflow-x-auto shadow-xs">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-muted border-b border-black/5 dark:border-white/5 font-mono uppercase tracking-wider bg-black/[0.02] dark:bg-white/[0.02]">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Customer / Dealership</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {sales.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-ink">
                          {s.id}
                        </td>
                        <td className="py-3 px-3 font-mono text-muted">
                          {s.date}
                        </td>
                        <td className="py-3 px-3 font-semibold text-ink">
                          {s.customer}
                        </td>
                        <td className="py-3 px-3 text-muted">{s.product}</td>
                        <td className="py-3 px-3 font-mono">{s.qty}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-mono">
                            {s.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#144A2A] dark:text-emerald-400">
                          ₱{s.total.toLocaleString()}.00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. PROJECT METADATA PANEL (PORTFOLIO INTEGRATION) ── */}
      <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md border border-[#144A2A]/30 bg-[#144A2A]/10 text-[#144A2A] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              ENTERPRISE AUTOMOTIVE ERP &amp; INVENTORY MANAGEMENT
            </span>
            <span className="text-xs font-mono text-muted">Production System</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Auto Avenue IMS — Stock Level Optimization &amp; Procurement Workflow
          </h3>

          <p className="text-xs font-semibold text-[#144A2A] dark:text-emerald-400 uppercase tracking-wider">
            Role: Backend &amp; Database Developer
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-muted">
            Designed an inventory management system for automotive parts
            dealerships. Implemented real-time low-stock threshold triggers,
            automated purchase order generation for verified part suppliers, and
            end-to-end sales ledger tracking.
          </p>

          {/* Key Technical Contributions */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-ink">
              Key Technical Architecture
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <span className="text-[#144A2A] dark:text-emerald-400 font-bold select-none mt-0.5">
                  1.
                </span>
                <span className="leading-relaxed">
                  <strong>Automated Procurement &amp; Reorder Thresholds:</strong>{" "}
                  Engineered automated stock level triggers that identify critical
                  part depletion and dispatch purchase order requisitions to
                  verified suppliers.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#144A2A] dark:text-emerald-400 font-bold select-none mt-0.5">
                  2.
                </span>
                <span className="leading-relaxed">
                  <strong>Role-Based Dealership Permissions:</strong> Enforced
                  granular authentication separating warehouse handlers, inventory
                  controllers, and department managers across dealership facilities.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#144A2A] dark:text-emerald-400 font-bold select-none mt-0.5">
                  3.
                </span>
                <span className="leading-relaxed">
                  <strong>Audit-Ready Transaction Ledger &amp; Reporting:</strong>{" "}
                  Structured relational database schemas (MySQL / PostgreSQL) for
                  exact stock movement reconciliation and exportable sales audit
                  reports.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stack Badges & External CTAs */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6 lg:border-l lg:border-black/5 dark:lg:border-white/5 lg:pl-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2.5">
              Technologies Used
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "React",
                "TypeScript",
                "Node.js",
                "Express",
                "MySQL / PostgreSQL",
                "Tailwind CSS",
              ].map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium text-ink bg-surface-strong border border-black/5 dark:border-white/10 rounded-md px-3 py-1 shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowCaseStudyModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white bg-[#144A2A] hover:bg-[#1a5b34] rounded-full px-6 py-3 transition-all shadow-md group cursor-pointer"
            >
              <FileText size={14} />
              <span>View Case Study</span>
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>

            <a
              href="https://github.com/EndayaRK/auto-avenue-ims"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-ink bg-white/80 dark:bg-[#18181C]/80 border border-black/5 dark:border-white/10 hover:bg-surface-strong rounded-full px-5 py-3 transition-colors shadow-xs"
            >
              <Github size={14} />
              <span>View GitHub Repo</span>
              <ArrowUpRight size={13} />
            </a>

            
          </div>
        </div>
      </div>

      {/* ── Case Study Modal ── */}
      {showCaseStudyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#18181D] border border-black/10 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowCaseStudyModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-ink p-1 rounded-lg cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#144A2A]/10 text-[#144A2A] dark:text-emerald-400 border border-[#144A2A]/20">
                CASE STUDY
              </span>
              <span className="text-xs font-semibold text-muted">
                Enterprise Inventory Optimization
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-ink">
              Auto Avenue IMS Engineering Architecture
            </h3>

            <p className="text-xs text-muted leading-relaxed">
              Auto Avenue required an internal system to resolve part stockouts
              and supplier reconciliation delays. We replaced fragmented manual
              spreadsheets with a unified relational inventory and procurement engine.
            </p>

            <div className="space-y-2 text-xs pt-2 border-t border-black/5 dark:border-white/5">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 space-y-1">
                <span className="font-bold text-ink">Problem Solved:</span>
                <p className="text-muted text-[11px]">
                  Manual part tracking caused up to 18 hours of weekly inventory
                  audits and critical component stockouts during vehicle servicing.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  Business Impact:
                </span>
                <p className="text-muted text-[11px]">
                  Automated reorder thresholds reduced inventory discrepancies by
                  85% and slashed manual requisition approval time from 2 days to under
                  15 minutes.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => setShowCaseStudyModal(false)}
                className="px-4 py-2 rounded-xl bg-[#144A2A] hover:bg-[#1a5b34] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
