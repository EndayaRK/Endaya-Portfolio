import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Maximize2,
  Minimize2,
  Minus,
  RotateCcw,
  X,
} from "lucide-react";
import { EASE_OUT_EXPO } from "../motion";
import {
  INQUIRY_CONTINUE_TO_FORM_EVENT,
  type CollaborationInquiry,
  type InquiryTransferPayload,
} from "../inquiry";

export interface AiChatWidgetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional collaboration inquiry handed off from the Contact section. */
  pendingInquiry?: CollaborationInquiry | null;
  /** Increments each time a new inquiry handoff is requested. */
  inquiryRequestId?: number;
}

function buildInquiryOpeningMessage(inquiry: CollaborationInquiry): string {
  const lines = ["I'd like help preparing a collaboration inquiry for Rhon."];
  if (inquiry.categories.length > 0) {
    lines.push(`Interested in: ${inquiry.categories.join(", ")}`);
  }
  const desc = inquiry.description.trim();
  if (desc) lines.push(`My idea: ${desc}`);
  return lines.join("\n");
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  {
    label: "Explore my projects",
    prompt:
      "Walk me through Rhon's selected projects—PalengkeHub, EventPulse, and Auto Avenue IMS—and his specific role in each.",
  },
  {
    label: "My technical experience",
    prompt:
      "What is Rhon's primary tech stack and engineering background across frontend, backend, and databases?",
  },
  {
    label: "Discuss a collaboration",
    prompt:
      "I'm interested in collaborating on a project or discussing an internship opportunity. How can Rhon contribute?",
  },
];

/* ── Lightweight Editorial Markdown Renderer with Progressive Block Reveal ── */
function renderInlineFormatting(text: string): React.ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return tokens.map((tok, i) => {
    if (!tok) return null;
    if (tok.startsWith("`") && tok.endsWith("`") && tok.length > 2) {
      return (
        <code
          key={i}
          className="font-mono text-[11.5px] px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] text-ink"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    if (tok.startsWith("**") && tok.endsWith("**") && tok.length > 4) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-ink/35 hover:decoration-ink text-ink transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return <React.Fragment key={i}>{tok}</React.Fragment>;
  });
}

function FormattedResponse({
  text,
  animateBlocks,
  reduceMotion,
}: {
  text: string;
  animateBlocks: boolean;
  reduceMotion: boolean;
}) {
  const segments = text.split(/(```[\s\S]*?```)/g);
  let blockCounter = 0;

  const wrapBlock = (node: React.ReactNode, key: string) => {
    const idx = blockCounter++;
    if (!animateBlocks || reduceMotion) {
      return <React.Fragment key={key}>{node}</React.Fragment>;
    }
    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.32,
          delay: Math.min(idx * 0.055, 0.22),
          ease: EASE_OUT_EXPO,
        }}
      >
        {node}
      </motion.div>
    );
  };

  return (
    <div className="space-y-3 font-body text-[13.5px] leading-[1.68] text-ink/90">
      {segments.map((segment, idx) => {
        const trimmed = segment.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
          const lines = trimmed.slice(3, -3).trim().split("\n");
          const firstLine = lines[0]?.trim() ?? "";
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine) && lines.length > 1;
          const codeBody = hasLang ? lines.slice(1).join("\n") : lines.join("\n");

          return wrapBlock(
            <pre
              data-lenis-prevent
              className="overflow-x-auto rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-[#F3EFEA] dark:bg-[#0D0D10] p-3 font-mono text-[11.5px] leading-[1.6] text-ink"
            >
              <code>{codeBody}</code>
            </pre>,
            `code-${idx}`
          );
        }

        const blocks = trimmed.split(/\n{2,}/);
        return (
          <React.Fragment key={idx}>
            {blocks.map((block, bIdx) => {
              const lines = block
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean);
              if (lines.length === 0) return null;

              const isList = lines.every((l) => /^([-*•]|\d+\.)\s+/.test(l));
              if (isList) {
                return wrapBlock(
                  <ul className="space-y-1.5 pl-4 border-l border-black/10 dark:border-white/10">
                    {lines.map((line, lIdx) => (
                      <li
                        key={lIdx}
                        className="text-[13.5px] leading-[1.65] text-ink/90"
                      >
                        {renderInlineFormatting(
                          line.replace(/^([-*•]|\d+\.)\s+/, "")
                        )}
                      </li>
                    ))}
                  </ul>,
                  `list-${idx}-${bIdx}`
                );
              }

              return wrapBlock(
                <p className="whitespace-pre-line">
                  {renderInlineFormatting(block)}
                </p>,
                `p-${idx}-${bIdx}`
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function AiChatWidget({
  isOpen: controlledIsOpen,
  onOpenChange,
  pendingInquiry = null,
  inquiryRequestId = 0,
}: AiChatWidgetProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (next: boolean) => {
    if (onOpenChange) {
      onOpenChange(next);
    } else {
      setInternalIsOpen(next);
    }
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active collaboration inquiry context: sent with every message while present
  const [activeInquiry, setActiveInquiry] =
    useState<CollaborationInquiry | null>(null);
  const lastInquiryIdRef = useRef(0);
  const inquiryStartMsgCountRef = useRef(0);
  const lastPromptRef = useRef("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isNearBottomRef = useRef(true);
  const forceScrollRef = useRef(false);

  // Scroll only the chat container (never the outer document)
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
  };

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = distanceFromBottom < 72;
  };

  const adjustTextareaHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      isNearBottomRef.current = true;
      const scrollTimer = window.setTimeout(() => {
        scrollToBottom("auto");
      }, 20);
      const focusTimer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 160);
      return () => {
        window.clearTimeout(scrollTimer);
        window.clearTimeout(focusTimer);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (forceScrollRef.current || isNearBottomRef.current) {
      scrollToBottom(reduceMotion ? "auto" : "smooth");
      forceScrollRef.current = false;
    }
  }, [messages, isLoading, isOpen, reduceMotion]);

  const handleClose = () => {
    setIsMinimized(false);
    setIsOpen(false);
    window.setTimeout(() => {
      triggerRef.current?.focus({ preventScroll: true });
    }, 40);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
    window.setTimeout(() => {
      triggerRef.current?.focus({ preventScroll: true });
    }, 40);
  };

  // Escape key closes chat and restores focus
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Send message to /api/chat (existing Gemini integration; key stays server-side)
  const handleSendMessage = async (
    userPrompt?: string,
    options?: { inquiry?: CollaborationInquiry | null; force?: boolean }
  ) => {
    const textToSend = (userPrompt || inputVal || lastPromptRef.current).trim();
    if (!textToSend || (isLoading && !options?.force)) return;
    lastPromptRef.current = textToSend;

    const inquiryForRequest =
      options && "inquiry" in options ? options.inquiry : activeInquiry;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    forceScrollRef.current = true;
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          inquiryForRequest
            ? {
                message: textToSend,
                context: {
                  type: "collaboration",
                  categories: inquiryForRequest.categories,
                  description: inquiryForRequest.description,
                },
              }
            : { message: textToSend }
        ),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || `Request failed (${res.status}). Please try again.`
        );
      }

      if (!data?.reply) {
        throw new Error("No response received from assistant.");
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(
        err?.message || "Failed to reach AI assistant. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Collaboration inquiry handoff: start a context-aware conversation once per request
  useEffect(() => {
    if (
      !pendingInquiry ||
      !inquiryRequestId ||
      inquiryRequestId === lastInquiryIdRef.current
    ) {
      return;
    }
    lastInquiryIdRef.current = inquiryRequestId;
    inquiryStartMsgCountRef.current = messages.length;
    setActiveInquiry(pendingInquiry);
    handleSendMessage(buildInquiryOpeningMessage(pendingInquiry), {
      inquiry: pendingInquiry,
      force: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquiryRequestId, pendingInquiry]);

  const handleContinueToForm = () => {
    const sessionMessages = messages.slice(inquiryStartMsgCountRef.current + 1);
    const visitorFollowUps = sessionMessages
      .filter((m) => m.sender === "user")
      .map((m) => m.text.trim())
      .filter(Boolean);

    const baseDesc = activeInquiry?.description.trim() || "";
    const combinedParts = [baseDesc, ...visitorFollowUps].filter(Boolean);
    const refinedDescription =
      visitorFollowUps.length > 0 ? combinedParts.join("\n\n") : undefined;

    window.dispatchEvent(
      new CustomEvent<InquiryTransferPayload>(INQUIRY_CONTINUE_TO_FORM_EVENT, {
        detail: { refinedDescription },
      })
    );
    setIsMinimized(false);
    setIsOpen(false);
  };

  const handleResetConversation = () => {
    if (isLoading) return;
    setMessages([]);
    setError(null);
    setActiveInquiry(null);
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch {
      /* ignore clipboard error */
    }
  };

  const hasConversation = messages.length > 0 || isLoading || !!error;
  const lastAiMessageId = [...messages]
    .reverse()
    .find((m) => m.sender === "ai")?.id;

  return (
    <>
      {/* ── Editorial AI Workspace Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            role="dialog"
            aria-label="Portfolio Assistant"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 18,
                    scale: 0.94,
                    rotateX: 5,
                    transformPerspective: 1100,
                  }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    transformPerspective: 1100,
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: isMinimized ? 10 : 16,
                    scale: isMinimized ? 0.92 : 0.95,
                    rotateX: 4,
                    transformPerspective: 1100,
                  }
            }
            transition={{
              duration: reduceMotion ? 0.12 : 0.34,
              ease: EASE_OUT_EXPO,
            }}
            style={{
              transformOrigin: "bottom right",
              boxShadow:
                "0 28px 70px -18px rgba(0, 0, 0, 0.22), 0 10px 28px -10px rgba(0, 0, 0, 0.12)",
            }}
            data-lenis-prevent
            className={`fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 flex flex-col overflow-hidden rounded-2xl bg-[#FBF9F5] dark:bg-[#111114] border border-black/[0.1] dark:border-white/[0.1] text-ink transition-[width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded
                ? "w-[calc(100vw-2rem)] sm:w-[540px] lg:w-[600px] h-[min(680px,calc(100dvh-5.5rem))]"
                : "w-[calc(100vw-2rem)] sm:w-[410px] h-[min(560px,calc(100dvh-6.5rem))]"
            }`}
          >
            {/* ── Compact Editorial Header ── */}
            <header className="px-5 py-3.5 border-b border-black/[0.08] dark:border-white/[0.08] bg-[#FBF9F5] dark:bg-[#111114] flex items-center justify-between gap-4 shrink-0 select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full bg-ink/75 shrink-0 transition-transform duration-300 ${
                    isLoading ? "scale-125 animate-pulse" : ""
                  }`}
                />
                <h2 className="font-display text-[13px] font-semibold tracking-[-0.01em] text-ink truncate">
                  Portfolio Assistant
                </h2>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {hasConversation && (
                  <button
                    type="button"
                    onClick={handleResetConversation}
                    disabled={isLoading}
                    aria-label="Reset conversation"
                    title="Reset"
                    className="w-7 h-7 rounded-md inline-flex items-center justify-center text-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.05] active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <RotateCcw size={13} strokeWidth={1.8} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-label={
                    isExpanded ? "Restore panel size" : "Expand workspace"
                  }
                  title={isExpanded ? "Restore size" : "Expand"}
                  className="hidden sm:inline-flex w-7 h-7 rounded-md items-center justify-center text-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.05] active:scale-95 transition-all cursor-pointer"
                >
                  {isExpanded ? (
                    <Minimize2 size={13} strokeWidth={1.8} />
                  ) : (
                    <Maximize2 size={13} strokeWidth={1.8} />
                  )}
                </button>

                {hasConversation && (
                  <button
                    type="button"
                    onClick={handleMinimize}
                    aria-label="Minimize assistant"
                    title="Minimize"
                    className="w-7 h-7 rounded-md inline-flex items-center justify-center text-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.05] active:scale-95 transition-all cursor-pointer"
                  >
                    <Minus size={14} strokeWidth={1.8} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close assistant"
                  title="Close"
                  className="w-7 h-7 rounded-md inline-flex items-center justify-center text-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.05] active:scale-95 transition-all cursor-pointer"
                >
                  <X size={15} strokeWidth={1.8} />
                </button>
              </div>
            </header>

            {/* ── Conversation Canvas ── */}
            <div
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y select-text"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {!hasConversation ? (
                /* ── Intentional Editorial Welcome State ── */
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.34,
                    delay: reduceMotion ? 0 : 0.05,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="h-full flex flex-col justify-between px-6 py-8"
                >
                  <div className="space-y-3 pt-4">
                    <h3 className="font-display text-[23px] sm:text-[25px] font-semibold tracking-[-0.03em] leading-[1.12] text-ink">
                      What would you like to know?
                    </h3>
                    <p className="font-body text-[13.5px] leading-[1.65] text-muted max-w-[30ch]">
                      Explore my projects, technical experience, or discuss a
                      potential collaboration.
                    </p>
                  </div>

                  <div className="divide-y divide-black/[0.08] dark:divide-white/[0.08] border-y border-black/[0.08] dark:border-white/[0.08]">
                    {SUGGESTED_PROMPTS.map((item, idx) => (
                      <motion.button
                        key={item.label}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSendMessage(item.prompt)}
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.28,
                          delay: reduceMotion ? 0 : 0.08 + idx * 0.04,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="group w-full py-3.5 flex items-center justify-between gap-4 text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] active:opacity-80 cursor-pointer disabled:opacity-50"
                      >
                        <span className="font-display text-[13.5px] font-medium text-ink/85 group-hover:text-ink group-hover:translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                          {item.label}
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-muted/70 group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ── Structured Editorial Turn Thread ── */
                <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                  {messages.map((msg) => {
                    const isAi = msg.sender === "ai";
                    const isLatestAi = isAi && msg.id === lastAiMessageId;
                    const isCopied = copiedId === msg.id;

                    return (
                      <motion.article
                        key={msg.id}
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, y: isAi ? 6 : 4 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : isAi ? 0.28 : 0.2,
                          ease: EASE_OUT_EXPO,
                        }}
                        className={`group/turn relative px-6 py-5 ${
                          isAi
                            ? "bg-transparent"
                            : "bg-[#F3EFEA]/65 dark:bg-[#16161B]/75"
                        }`}
                      >
                        {isAi ? (
                          <>
                            <FormattedResponse
                              text={msg.text}
                              animateBlocks={isLatestAi}
                              reduceMotion={reduceMotion}
                            />
                            <div className="mt-2.5 flex justify-end opacity-0 group-hover/turn:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyMessage(msg.id, msg.text)
                                }
                                aria-label="Copy response"
                                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink transition-colors cursor-pointer"
                              >
                                {isCopied ? (
                                  <>
                                    <Check size={11} />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="font-display text-[13.5px] font-medium leading-[1.6] text-ink whitespace-pre-line">
                            {msg.text}
                          </p>
                        )}
                      </motion.article>
                    );
                  })}

                  {/* ── Editorial Geometric Thinking Indicator (No Bouncing Dots) ── */}
                  <AnimatePresence initial={false}>
                    {isLoading && (
                      <motion.div
                        key="thinking-state"
                        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.22 }}
                        className="px-6 py-5"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            aria-hidden="true"
                            className="relative w-8 h-[2px] bg-black/10 dark:bg-white/10 overflow-hidden rounded-full"
                          >
                            <motion.span
                              animate={
                                reduceMotion
                                  ? { opacity: [0.35, 0.9, 0.35] }
                                  : { x: ["-100%", "140%"] }
                              }
                              transition={{
                                duration: 1.15,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="block w-1/2 h-full bg-ink rounded-full"
                            />
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                            Thinking
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Monochrome Editorial Error State ── */}
                  <AnimatePresence initial={false}>
                    {error && (
                      <motion.div
                        key="error-state"
                        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                        className="px-6 py-4 bg-black/[0.03] dark:bg-white/[0.03]"
                      >
                        <div className="flex items-start gap-2.5 text-ink">
                          <AlertCircle
                            size={14}
                            className="shrink-0 mt-0.5 text-muted"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-xs leading-relaxed text-ink/90">
                              {error}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleSendMessage()}
                              className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink underline underline-offset-4 cursor-pointer"
                            >
                              <RotateCcw size={10} />
                              Retry
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ── Active Collaboration Inquiry Bar (when handed off from Contact section) ── */}
            {activeInquiry && (
              <div className="px-5 py-3 bg-[#F3EFEA] dark:bg-[#16161B] border-t border-black/[0.08] dark:border-white/[0.08] shrink-0 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleContinueToForm}
                  className="group inline-flex items-center gap-1.5 text-xs font-medium text-ink hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <span>Continue to message form</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInquiry(null)}
                  className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}

            {/* ── Spacious Editorial Message Composer ── */}
            <div className="p-3.5 bg-[#FBF9F5] dark:bg-[#111114] border-t border-black/[0.08] dark:border-white/[0.08] shrink-0">
              <div className="flex items-end gap-2.5 rounded-xl border border-black/[0.12] dark:border-white/[0.12] bg-[#F3EFEA]/65 dark:bg-[#18181D] focus-within:border-ink/55 dark:focus-within:border-white/50 focus-within:bg-[#F3EFEA] dark:focus-within:bg-[#1C1C22] transition-colors duration-200 pl-3.5 pr-2 py-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    adjustTextareaHeight(e.target);
                  }}
                  onKeyDown={handleKeyDownInput}
                  disabled={isLoading}
                  data-lenis-prevent
                  placeholder="Ask anything…"
                  className="block flex-1 resize-none bg-transparent py-0.5 font-body text-[13.5px] leading-[1.5] text-ink placeholder:text-muted/60 focus:outline-none max-h-[120px]"
                />
                <button
                  type="button"
                  disabled={!inputVal.trim() || isLoading}
                  onClick={() => handleSendMessage()}
                  aria-label="Send message"
                  className="group/send h-7 w-7 rounded-lg bg-ink text-cta-primary-text inline-flex items-center justify-center disabled:opacity-20 hover:opacity-90 active:scale-90 transition-all duration-200 cursor-pointer shrink-0"
                >
                  <ArrowUp
                    size={14}
                    strokeWidth={2.2}
                    className="transition-transform duration-200 group-hover/send:-translate-y-0.5"
                  />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Understated Editorial Floating Trigger / Minimized Bar ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={
          isOpen
            ? "Close Portfolio Assistant"
            : isMinimized
            ? "Resume Portfolio Assistant conversation"
            : "Open Portfolio Assistant"
        }
        aria-expanded={isOpen}
        className="group fixed bottom-6 right-4 sm:right-6 z-50 h-11 px-4 rounded-full bg-[#1A1A18] dark:bg-[#F3F3F5] text-[#FBF9F5] dark:text-[#0A0A0C] border border-black/10 dark:border-white/10 shadow-xl inline-flex items-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none"
        style={{
          boxShadow:
            "0 14px 34px -8px rgba(0, 0, 0, 0.28), 0 6px 14px -4px rgba(0, 0, 0, 0.16)",
        }}
      >
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full bg-current opacity-80 transition-transform duration-300 group-hover:scale-125 ${
            isLoading ? "animate-pulse" : ""
          }`}
        />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
          {isOpen
            ? "Close"
            : isMinimized && messages.length > 0
            ? `Assistant · ${messages.length}`
            : "Assistant"}
        </span>
        {isOpen && <X size={13} strokeWidth={2} />}
      </button>
    </>
  );
}
