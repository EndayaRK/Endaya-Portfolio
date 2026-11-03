import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Check,
  Copy,
  CornerDownLeft,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

interface AiSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_PROMPTS = [
  "What is Rhon's primary tech stack?",
  "Tell me about his full-stack projects",
  "Is he available for an IT internship?",
];

export default function AiSearchModal({ isOpen, onClose }: AiSearchModalProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Reset state on close
      setQuery("");
      setSubmittedQuery("");
      setResponse(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Global Escape & keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Send query to /api/chat
  async function handleSendQuery(userMessage: string) {
    const trimmed = userMessage.trim();
    if (!trimmed || isLoading) return;

    setSubmittedQuery(trimmed);
    setQuery("");
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setModelUsed(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || `Request failed with status ${res.status}. Please try again.`
        );
      }

      if (!data?.reply) {
        throw new Error("No response received from portfolio assistant.");
      }

      setResponse(data.reply);
      if (data.model) {
        setModelUsed(data.model);
      }
    } catch (err: any) {
      setError(
        err?.message || "An unexpected error occurred while contacting the AI assistant."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSendQuery(query);
  }

  function handleCopy() {
    if (!response) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(response).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border border-black/10 dark:border-white/15 bg-[#FBF9F5]/98 dark:bg-[#141416]/98 backdrop-blur-xl shadow-2xl overflow-hidden animate-[fadeUp_0.2s_ease-out] flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 text-ink flex items-center justify-center shadow-xs">
              <Sparkles size={15} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="ai-modal-title"
                  className="font-display text-sm sm:text-base font-bold text-ink tracking-tight"
                >
                  Ask Rhon's AI Assistant
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-muted font-semibold">
                  Gemini Flash-Lite
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center text-muted hover:text-ink hover:bg-surface-strong transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#18181C]/50"
        >
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about Rhon's experience, stack, or projects..."
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#111113] text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/20 shadow-xs transition-all"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              aria-label="Send query"
              className="absolute right-2 w-8 h-8 rounded-lg bg-cta-primary text-cta-primary-text flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-85 transition-all shadow-xs"
            >
              <CornerDownLeft size={14} />
            </button>
          </div>
        </form>

        {/* Main Content Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Starter Prompt Chips */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2.5">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendQuery(prompt)}
                  disabled={isLoading}
                  className="text-xs text-left px-3.5 py-2 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#16161A]/80 hover:bg-white dark:hover:bg-[#1C1C22] hover:border-black/20 dark:hover:border-white/20 text-ink transition-all shadow-xs flex items-center gap-1.5 group disabled:opacity-50"
                >
                  <span>{prompt}</span>
                  <ArrowRight
                    size={12}
                    className="text-muted group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Active Query Display */}
          {submittedQuery && (
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-medium text-ink">
                <span className="text-muted font-normal">Question:</span>
                <span>"{submittedQuery}"</span>
              </div>
            </div>
          )}

          {/* Loading State: Clean Pulsing Skeleton & Dots */}
          {isLoading && (
            <div className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#18181C]/70 space-y-3 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <Bot size={14} className="text-amber-600 dark:text-amber-400" />
                <span>Gemini Flash-Lite is generating response...</span>
              </div>
              <div className="space-y-2">
                <div className="h-3.5 bg-black/10 dark:bg-white/10 rounded-md w-full" />
                <div className="h-3.5 bg-black/10 dark:bg-white/10 rounded-md w-11/12" />
                <div className="h-3.5 bg-black/10 dark:bg-white/10 rounded-md w-4/5" />
              </div>
            </div>
          )}

          {/* Error State with Retry Button */}
          {error && !isLoading && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 space-y-3">
              <div className="flex items-start gap-2 text-xs font-medium">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
              {submittedQuery && (
                <button
                  type="button"
                  onClick={() => handleSendQuery(submittedQuery)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
                >
                  <RotateCcw size={12} />
                  Retry Query
                </button>
              )}
            </div>
          )}

          {/* Response Display with High Contrast */}
          {response && !isLoading && (
            <div className="p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/15 bg-white/90 dark:bg-[#18181C]/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Bot size={15} className="text-amber-600 dark:text-amber-400" />
                  <span>Answer</span>
                </div>
                <div className="flex items-center gap-2">
                  {modelUsed && (
                    <span className="text-[10px] font-mono text-muted hidden sm:inline">
                      {modelUsed}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-ink px-2 py-1 rounded border border-black/5 dark:border-white/10 hover:bg-surface-strong transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* High Contrast Clean Text Presentation */}
              <p className="text-sm sm:text-base leading-relaxed text-[#1A1A18] dark:text-[#F3F3F5] font-normal selection:bg-amber-500/20">
                {response}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-xs text-muted">
          <span className="font-mono text-[11px]">
            ESC to close · Powered by Google Gemini Flash-Lite
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-ink hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

