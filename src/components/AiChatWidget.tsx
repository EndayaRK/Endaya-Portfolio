import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
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

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "ai",
    text: "Hi! I'm Rhon's portfolio assistant. Ask me anything about his full-stack projects, tech stack, or internship availability!",
    timestamp: "Just now",
  },
];

const SUGGESTION_CHIPS = [
  {
    label: "🛠️ Tech Stack",
    prompt: "What is Rhon's primary tech stack and engineering background?",
  },
  {
    label: "📱 PalengkeHub",
    prompt: "Tell me about the PalengkeHub project and Rhon's specific role.",
  },
  {
    label: "💼 Internship Status",
    prompt: "Is Rhon actively seeking software development internship opportunities?",
  },
];

export default function AiChatWidget({
  isOpen: controlledIsOpen,
  onOpenChange,
  pendingInquiry = null,
  inquiryRequestId = 0,
}: AiChatWidgetProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (next: boolean) => {
    if (onOpenChange) {
      onOpenChange(next);
    } else {
      setInternalIsOpen(next);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Active collaboration inquiry context: sent with every message while present,
  // because /api/chat is stateless (single-turn) by design.
  const [activeInquiry, setActiveInquiry] =
    useState<CollaborationInquiry | null>(null);
  const lastInquiryIdRef = useRef(0);
  const inquiryStartMsgCountRef = useRef(0);
  const lastPromptRef = useRef("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom("auto");
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom("smooth");
    }
  }, [messages, isLoading]);

  // Escape key closes chat
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
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

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
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
      setError(err?.message || "Failed to reach AI assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    // Include any follow-up clarifications the visitor typed during the AI session
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
    setIsOpen(false);
  };

  return (
    <>
      {/* ── Messenger Popover Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] h-[520px] rounded-3xl bg-[#FFFFFF] dark:bg-[#141416] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden select-none font-sans"
            style={{
              boxShadow:
                "0 20px 45px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* ── Header Bar ── */}
            <div className="px-4 py-3.5 bg-[#FAF9F6] dark:bg-[#1A1A1E] border-b border-black/5 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Avatar with live dot */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-surface-strong flex items-center justify-center shadow-xs">
                    <img
                      src="/formalpic.png"
                      alt="Rhon Kelly Endaya"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        // Fallback initials
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="font-bold text-xs text-ink">RE</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1A1A1E]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-xs sm:text-sm text-ink leading-tight">
                      Rhon's AI Assistant
                    </h3>
                    <Sparkles size={11} className="text-amber-500 shrink-0" />
                  </div>
                  <p className="text-[10px] text-muted leading-tight mt-0.5">
                    Active now · Powered by Gemini
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="w-7 h-7 rounded-full border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* ── Message Thread Body ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FBF9F5]/40 dark:bg-[#0E0E10]/40">
              {messages.map((msg) => {
                const isAi = msg.sender === "ai";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`p-3 text-xs leading-relaxed max-w-[85%] transition-all ${
                        isAi
                          ? "rounded-2xl rounded-tl-sm bg-[#F1EFEA] dark:bg-[#1F1F23] text-[#1A1A18] dark:text-[#F3F3F5] shadow-2xs border border-black/5 dark:border-white/5"
                          : "rounded-2xl rounded-tr-sm bg-[#0F0F11] dark:bg-[#38373E] text-white shadow-2xs"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-muted/60 mt-1 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Loading Typing Indicator */}
              {isLoading && (
                <div className="flex items-start">
                  <div className="rounded-2xl rounded-tl-sm bg-[#F1EFEA] dark:bg-[#1F1F23] p-3 text-xs flex items-center gap-1.5 shadow-2xs border border-black/5 dark:border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" />
                    <span className="text-[10px] text-muted ml-1 font-medium">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}

              {/* Error Callout */}
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11px] leading-snug">{error}</p>
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      className="mt-1 text-[10px] font-bold underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      Retry
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Collaboration Inquiry Context Bar (only while an inquiry is active) ── */}
            {activeInquiry && (
              <div className="px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#18181C] border-t border-black/5 dark:border-white/5 shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 text-[10px] leading-snug text-muted">
                    <span className="font-mono uppercase tracking-[0.14em] text-ink/70">
                      Inquiry
                    </span>{" "}
                    <span className="truncate">
                      {activeInquiry.categories.length > 0
                        ? activeInquiry.categories.join(" · ")
                        : "Project idea"}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveInquiry(null)}
                    className="shrink-0 text-[10px] text-muted hover:text-ink underline underline-offset-2 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleContinueToForm}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-black/15 dark:border-white/15 px-3 py-1.5 text-[11px] font-semibold text-ink hover:border-ink dark:hover:border-white transition-colors cursor-pointer"
                >
                  Continue to message form
                  <ArrowRight size={12} />
                </button>
              </div>
            )}

            {/* ── Quick Suggestion Chips (Tappable Pills) ── */}
            <div className="px-3 pt-2 pb-1.5 bg-[#FAF9F6] dark:bg-[#18181C] border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none no-scrollbar">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(chip.prompt)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-black/5 dark:border-white/10 bg-white dark:bg-[#202026] text-muted hover:text-ink hover:border-black/20 dark:hover:border-white/20 whitespace-nowrap transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* ── Bottom Input Bar ── */}
            <div className="p-3 bg-white dark:bg-[#141416] border-t border-black/5 dark:border-white/10 shrink-0">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDownInput}
                  disabled={isLoading}
                  placeholder="Type a message..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-full border border-black/10 dark:border-white/10 bg-[#F5F4F0] dark:bg-[#1E1E24] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/20 transition-all"
                />
                <button
                  type="button"
                  disabled={!inputVal.trim() || isLoading}
                  onClick={() => handleSendMessage()}
                  aria-label="Send message"
                  className="absolute right-1.5 w-7 h-7 rounded-full bg-[#1A1A18] dark:bg-[#F3F3F5] text-white dark:text-[#0A0A0C] flex items-center justify-center disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Launcher Button (Bottom-Right) ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Chat" : "Open AI Assistant"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1A1A18] dark:bg-[#F3F3F5] text-white dark:text-[#0A0A0C] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Online Presence Indicator */}
        <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0A0A0C] absolute top-0.5 right-0.5 shadow-xs" />

        {/* Icon Swaps */}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare size={22} strokeWidth={2} />
              <Sparkles
                size={10}
                className="absolute -top-1 -right-1 text-amber-400 dark:text-amber-600 animate-pulse"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}
