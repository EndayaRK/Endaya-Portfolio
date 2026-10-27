import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { certificates, projects, skillGroups } from "../data";

type Item = { id: string; label: string; hint: string; anchor: string };

function buildIndex(): Item[] {
  const items: Item[] = [
    { id: "sec-overview", label: "Professional Overview", hint: "Section", anchor: "#overview" },
    { id: "sec-projects", label: "Selected Work (Projects)", hint: "Section", anchor: "#projects" },
    { id: "sec-skills", label: "Technical Competencies", hint: "Section", anchor: "#skills" },
    { id: "sec-about", label: "Background & Approach", hint: "Section", anchor: "#about" },
    { id: "sec-certificates", label: "Certificates & Honors", hint: "Section", anchor: "#certificates" },
    { id: "sec-contact", label: "Contact & Internship", hint: "Section", anchor: "#contact" },
  ];

  projects.forEach((p) =>
    items.push({
      id: `proj-${p.id}`,
      label: p.title,
      hint: `Project · ${p.category} · ${p.stack.slice(0, 3).join(", ")}`,
      anchor: "#projects",
    })
  );

  skillGroups.forEach((g) =>
    g.items.forEach((s) =>
      items.push({ id: `skill-${s}`, label: s, hint: `Skill · ${g.label}`, anchor: "#skills" })
    )
  );

  certificates.forEach((c) =>
    items.push({
      id: `cert-${c.id}`,
      label: c.title,
      hint: `Credential · ${c.issuer}`,
      anchor: "#certificates",
    })
  );

  return items;
}

const INDEX = buildIndex();

export default function CommandPalette({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INDEX.slice(0, 8);
    return INDEX.filter(
      (item) => item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    function handleKeydown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
      }
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onOpen, onClose]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function select(item: Item) {
    onClose();
    document.querySelector(item.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      select(results[activeIndex]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-scrim/75 backdrop-blur-md animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-panel border border-line rounded-2xl shadow-2xl overflow-hidden animate-[fadeUp_0.15s_ease-out]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search portfolio"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-surface2/40">
          <SearchIcon size={18} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, skills, certificates, or sections…"
            className="flex-1 bg-transparent font-body text-sm text-paper placeholder:text-muted outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded text-muted hover:text-paper"
          >
            <X size={16} />
          </button>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-8 text-sm text-muted text-center font-mono">
              No matching records found.
            </li>
          )}
          {results.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => select(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                  i === activeIndex ? "bg-amber/15 text-amber" : "text-paper/85 hover:bg-surface2/60"
                }`}
              >
                <span className="font-display font-medium text-sm">{item.label}</span>
                <span className="font-mono text-xs text-muted truncate max-w-[220px]">
                  {item.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="px-4 py-2.5 border-t border-line font-mono text-[11px] text-muted flex items-center justify-between bg-surface2/30">
          <div className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span className="text-teal">{INDEX.length} indexed records</span>
        </div>
      </div>
    </div>
  );
}
