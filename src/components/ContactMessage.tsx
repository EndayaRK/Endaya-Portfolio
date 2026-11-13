import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Copy, Sparkles } from "lucide-react";
import { profile } from "../data";
import { EASE_OUT_EXPO, scrollToSection } from "../motion";
import {
  INQUIRY_CATEGORIES,
  INQUIRY_CONTINUE_TO_FORM_EVENT,
  INQUIRY_DESCRIPTION_MAX,
  OPEN_AI_INQUIRY_EVENT,
  formatInquiryHeader,
  formatInquirySubject,
  type CollaborationInquiry,
  type InquiryCategory,
  type InquiryTransferPayload,
} from "../inquiry";

/* ───────────────────────────── Helpers ───────────────────────────── */

type FieldName = "name" | "email" | "subject" | "message";
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

const EMPTY_FORM: FormValues = { name: "", email: "", subject: "", message: "" };

// Pragmatic address check: something@domain.tld, no whitespace.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!values.subject.trim()) errors.subject = "Please add a subject.";
  if (!values.message.trim()) errors.message = "Please write a message.";
  return errors;
}

export function buildMessageBody(values: FormValues): string {
  return [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    "",
    values.message.trim(),
  ].join("\n");
}

/** Gmail web compose URL. encodeURIComponent keeps spaces (%20), line breaks (%0A),
 *  &, #, ?, +, quotes and non-ASCII characters intact. */
export function buildGmailComposeUrl(values: FormValues): string {
  return (
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(profile.email)}` +
    `&su=${encodeURIComponent(values.subject.trim())}` +
    `&body=${encodeURIComponent(buildMessageBody(values))}`
  );
}

export function buildMailtoUrl(values: FormValues): string {
  return (
    `mailto:${profile.email}` +
    `?subject=${encodeURIComponent(values.subject.trim())}` +
    `&body=${encodeURIComponent(buildMessageBody(values))}`
  );
}

function buildPreparedText(values: FormValues): string {
  return [
    `To: ${profile.email}`,
    `Subject: ${values.subject.trim()}`,
    "",
    buildMessageBody(values),
  ].join("\n");
}

/* ───────────────────────────── Field ───────────────────────────── */

type FieldProps = {
  id: string;
  name: FieldName;
  label: string;
  value: string;
  error?: string;
  type?: "text" | "email";
  multiline?: boolean;
  autoComplete?: string;
  placeholder?: string;
  onChange: (name: FieldName, value: string) => void;
  inputRef?: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
};

function EditorialField({
  id,
  name,
  label,
  value,
  error,
  type = "text",
  multiline,
  autoComplete,
  placeholder,
  onChange,
  inputRef,
}: FieldProps) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    placeholder,
    required: true,
    "aria-required": true,
    "aria-invalid": !!error,
    "aria-describedby": error ? errorId : undefined,
    onChange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onChange(name, e.target.value),
    className:
      "peer block w-full bg-transparent border-0 px-0 pt-2 pb-3 font-body text-[15px] sm:text-base text-ink placeholder:text-muted/50 focus:outline-none focus:ring-0",
  };

  return (
    <div className="group/field relative">
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors group-focus-within/field:text-ink"
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          {...shared}
          ref={inputRef as (el: HTMLTextAreaElement | null) => void}
          rows={5}
          data-lenis-prevent
          className={`${shared.className} resize-y min-h-[8.5rem] leading-[1.65]`}
        />
      ) : (
        <input
          {...shared}
          ref={inputRef as (el: HTMLInputElement | null) => void}
          type={type}
          autoComplete={autoComplete}
          spellCheck={type === "email" ? false : undefined}
        />
      )}

      {/* Hairline + focus draw (wrapped so it stays attached to the input) */}
      <div className="relative" aria-hidden="true">
        <span
          className={`block h-px w-full ${
            error ? "bg-ink/60" : "bg-black/12 dark:bg-white/12"
          }`}
        />
        <span className="absolute inset-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within/field:scale-x-100 motion-reduce:transition-none" />
      </div>

      <div className="mt-2 min-h-[1.25rem]">
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 text-xs text-ink"
            >
              <span aria-hidden="true" className="h-px w-3 bg-ink shrink-0" />
              <span>{error}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────────────────────── Main ───────────────────────────── */

type ComposeStatus =
  | { kind: "idle" }
  | { kind: "opened"; values: FormValues }
  | { kind: "blocked"; values: FormValues };

export default function ContactMessage() {
  const reduce = useReducedMotion() ?? false;
  const uid = useId();

  /* Inquiry state */
  const [categories, setCategories] = useState<InquiryCategory[]>([]);
  const [description, setDescription] = useState("");
  const [inquiryGuidance, setInquiryGuidance] = useState<string | null>(null);
  const [inquiryNote, setInquiryNote] = useState<string | null>(null);
  const lastInsertedHeaderRef = useRef<string>("");

  /* Form state */
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<ComposeStatus>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [showPrepared, setShowPrepared] = useState(false);

  const fieldRefs = useRef<
    Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>
  >({});

  const hasInquiry = categories.length > 0 || description.trim().length > 0;

  /* ── Inquiry interactions ── */
  const toggleCategory = (cat: InquiryCategory) => {
    setInquiryGuidance(null);
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (inquiryGuidance) setInquiryGuidance(null);
    setDescription(e.target.value);
  };

  const discussWithAi = () => {
    if (!hasInquiry) {
      setInquiryGuidance(
        "Select at least one category or describe your project idea first."
      );
      return;
    }
    setInquiryGuidance(null);
    window.dispatchEvent(
      new CustomEvent<CollaborationInquiry>(OPEN_AI_INQUIRY_EVENT, {
        detail: { categories: [...categories], description: description.trim() },
      })
    );
  };

  /** Carry the inquiry into the form without overwriting visitor-written text or duplicating on repeat clicks. */
  const applyInquiryToForm = useCallback(
    (overrideDescription?: string) => {
      const effectiveDesc =
        overrideDescription !== undefined
          ? overrideDescription.slice(0, INQUIRY_DESCRIPTION_MAX)
          : description;

      if (overrideDescription !== undefined) {
        setDescription(effectiveDesc);
      }

      const current: CollaborationInquiry = {
        categories,
        description: effectiveDesc,
      };
      const header = formatInquiryHeader(current);

      if (!header) {
        setInquiryGuidance(
          "Select at least one category or describe your project idea first."
        );
        return;
      }

      setInquiryGuidance(null);
      const subject = formatInquirySubject(current);
      const prevHeader = lastInsertedHeaderRef.current;

      let noteMessage = "Inquiry added to your message below.";

      setValues((prev) => {
        const next = { ...prev };
        if (!prev.subject.trim() && subject) {
          next.subject = subject;
        }

        const existingMsg = prev.message;
        if (!existingMsg.trim()) {
          next.message = `${header}\n\nAdditional message:\n`;
        } else if (prevHeader && existingMsg.includes(prevHeader)) {
          if (prevHeader === header) {
            noteMessage = "Already included in your message below.";
          } else {
            next.message = existingMsg.replace(prevHeader, header);
            noteMessage = "Inquiry updated in your message below.";
          }
        } else if (existingMsg.includes(header)) {
          noteMessage = "Already included in your message below.";
        } else {
          next.message = `${header}\n\nAdditional message:\n${existingMsg.trim()}`;
        }

        if (attempted) {
          setErrors(validateContactForm(next));
        }
        return next;
      });

      lastInsertedHeaderRef.current = header;
      setInquiryNote(noteMessage);

      scrollToSection("contact-message");
      window.setTimeout(() => {
        const order: FieldName[] = ["name", "email", "subject", "message"];
        const target = order.find((f) => !fieldRefs.current[f]?.value.trim());
        fieldRefs.current[target ?? "message"]?.focus({ preventScroll: true });
      }, reduce ? 0 : 650);
    },
    [attempted, categories, description, reduce]
  );

  // AI assistant → "Continue to message form"
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<InquiryTransferPayload | undefined>)
        .detail;
      applyInquiryToForm(detail?.refinedDescription);
    };
    window.addEventListener(INQUIRY_CONTINUE_TO_FORM_EVENT, handler);
    return () =>
      window.removeEventListener(INQUIRY_CONTINUE_TO_FORM_EVENT, handler);
  }, [applyInquiryToForm]);

  /* ── Form interactions ── */
  const handleFieldChange = (name: FieldName, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (attempted) setErrors(validateContactForm(next));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttempted(true);
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);

    const firstInvalid = (["name", "email", "subject", "message"] as FieldName[]).find(
      (f) => nextErrors[f]
    );
    if (firstInvalid) {
      const targetEl = fieldRefs.current[firstInvalid];
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center",
        });
        targetEl.focus({ preventScroll: true });
      }
      return;
    }

    const snapshot = { ...values };
    const url = buildGmailComposeUrl(snapshot);
    // Not using the "noopener" feature string: it forces window.open to return null,
    // which would make a blocked pop-up indistinguishable from success.
    const win = window.open(url, "_blank");
    if (win) {
      try {
        win.opener = null;
      } catch {
        /* cross-origin assignment can throw in some browsers; safe to ignore */
      }
      setStatus({ kind: "opened", values: snapshot });
      setShowPrepared(false);
    } else {
      setStatus({ kind: "blocked", values: snapshot });
      setShowPrepared(true);
    }
  };

  const copyPrepared = async (v: FormValues) => {
    const text = buildPreparedText(v);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setShowPrepared(true);
    }
  };

  const resetForm = () => {
    setValues(EMPTY_FORM);
    setErrors({});
    setAttempted(false);
    setStatus({ kind: "idle" });
    setShowPrepared(false);
    setInquiryNote(null);
    lastInsertedHeaderRef.current = "";
  };

  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduce ? 0 : 0.72, delay: reduce ? 0 : delay, ease: EASE_OUT_EXPO },
  });

  const statusValues = status.kind === "idle" ? null : status.values;

  return (
    <div
      id="contact-message"
      className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 py-14 lg:py-20"
    >
      {/* ───────────── Collaboration Inquiry ───────────── */}
      <motion.section
        {...reveal(0.05)}
        aria-labelledby={`${uid}-inquiry-heading`}
        className="lg:col-span-5"
      >
        <h3
          id={`${uid}-inquiry-heading`}
          className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-[-0.025em] leading-[1.12] text-ink"
        >
          What would you like to build?
        </h3>
        <p className="mt-3 font-body text-sm sm:text-[15px] text-muted leading-relaxed max-w-md">
          Choose anything that fits, then describe the idea in your own words.
        </p>

        <fieldset className="mt-8">
          <legend className="sr-only">Inquiry categories (select one or more)</legend>
          <ul className="flex flex-wrap gap-2.5">
            {INQUIRY_CATEGORIES.map((cat) => {
              const selected = categories.includes(cat);
              return (
                <li key={cat}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleCategory(cat)}
                    className={`relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-[background-color,border-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                      selected
                        ? "bg-ink text-cta-primary-text border-ink"
                        : "border-black/12 dark:border-white/15 text-ink/80 hover:text-ink hover:border-ink/50 dark:hover:border-white/45"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid place-items-center overflow-hidden transition-[width,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        selected ? "w-3.5 opacity-100" : "w-0 opacity-0"
                      }`}
                    >
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    {cat}
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="mt-8 group/field relative">
          <label
            htmlFor={`${uid}-idea`}
            className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted group-focus-within/field:text-ink transition-colors"
          >
            <span>Project description (optional)</span>
            <span className="tabular-nums normal-case tracking-normal">
              {description.length}/{INQUIRY_DESCRIPTION_MAX}
            </span>
          </label>
          <textarea
            id={`${uid}-idea`}
            value={description}
            maxLength={INQUIRY_DESCRIPTION_MAX}
            onChange={handleDescriptionChange}
            rows={4}
            data-lenis-prevent
            placeholder="e.g. A booking system for a small clinic with an admin dashboard."
            className="block w-full bg-transparent border-0 px-0 pt-2 pb-3 font-body text-[15px] text-ink leading-[1.65] placeholder:text-muted/50 resize-y min-h-[7rem] focus:outline-none focus:ring-0"
          />
          <span aria-hidden="true" className="block h-px w-full bg-black/12 dark:bg-white/12" />
          <span
            aria-hidden="true"
            className="absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within/field:scale-x-100 motion-reduce:transition-none"
          />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={() => applyInquiryToForm()}
            className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-colors cursor-pointer ${
              hasInquiry
                ? "border-black/25 dark:border-white/25 text-ink hover:border-ink dark:hover:border-white"
                : "border-black/12 dark:border-white/12 text-muted hover:text-ink hover:border-black/25 dark:hover:border-white/25"
            }`}
          >
            <span>Add to message</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>

          <button
            type="button"
            onClick={discussWithAi}
            aria-describedby={`${uid}-ai-note`}
            className={`inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
              hasInquiry
                ? "text-muted hover:text-ink"
                : "text-muted/70 hover:text-ink"
            }`}
          >
            <Sparkles size={13} strokeWidth={1.9} />
            Discuss with AI
          </button>
        </div>

        <AnimatePresence initial={false}>
          {inquiryGuidance && (
            <motion.p
              role="status"
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-3 flex items-center gap-2 text-xs text-ink/85"
            >
              <span aria-hidden="true" className="h-px w-3 bg-ink/60 shrink-0" />
              <span>{inquiryGuidance}</span>
            </motion.p>
          )}
        </AnimatePresence>

        <p id={`${uid}-ai-note`} className="mt-3 text-[11px] text-muted/80 leading-relaxed max-w-sm">
          The assistant can help clarify your idea. It can&apos;t accept projects or
          make commitments on my behalf.
        </p>
      </motion.section>

      {/* ───────────── Leave a Message ───────────── */}
      <motion.section
        {...reveal(0.12)}
        aria-labelledby={`${uid}-message-heading`}
        className="lg:col-span-7 lg:pl-12 lg:border-l lg:border-black/10 dark:lg:border-white/10"
      >
        <h3
          id={`${uid}-message-heading`}
          className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-[-0.025em] leading-[1.12] text-ink"
        >
          Leave a message
        </h3>
        <p className="mt-3 font-body text-sm sm:text-[15px] text-muted leading-relaxed max-w-lg">
          Your message opens as a Gmail draft, ready for you to review and send.
        </p>

        <AnimatePresence initial={false}>
          {inquiryNote && (
            <motion.p
              role="status"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-2 text-xs text-ink/80 overflow-hidden"
            >
              <span aria-hidden="true" className="h-px w-4 bg-ink/60" />
              {inquiryNote}
            </motion.p>
          )}
        </AnimatePresence>

        <form noValidate onSubmit={handleSubmit} className="mt-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-9">
            <EditorialField
              id={`${uid}-name`}
              name="name"
              label="Name"
              autoComplete="name"
              value={values.name}
              error={errors.name}
              onChange={handleFieldChange}
              inputRef={(el) => (fieldRefs.current.name = el)}
            />
            <EditorialField
              id={`${uid}-email`}
              name="email"
              type="email"
              label="Email address"
              autoComplete="email"
              value={values.email}
              error={errors.email}
              onChange={handleFieldChange}
              inputRef={(el) => (fieldRefs.current.email = el)}
            />
            <div className="sm:col-span-2">
              <EditorialField
                id={`${uid}-subject`}
                name="subject"
                label="Subject"
                value={values.subject}
                error={errors.subject}
                onChange={handleFieldChange}
                inputRef={(el) => (fieldRefs.current.subject = el)}
              />
            </div>
            <div className="sm:col-span-2">
              <EditorialField
                id={`${uid}-message`}
                name="message"
                label="Message"
                multiline
                value={values.message}
                error={errors.message}
                onChange={handleFieldChange}
                inputRef={(el) => (fieldRefs.current.message = el)}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
            <button
              type="submit"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-cta-primary text-cta-primary-text pl-6 pr-2 py-2 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.99] cursor-pointer"
            >
              Continue to Gmail
              <span className="grid h-8 w-8 place-items-center rounded-full bg-cta-primary-text/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={15} strokeWidth={2.25} />
              </span>
            </button>
            <p className="text-[11px] text-muted">All fields are required.</p>
          </div>
        </form>

        {/* ── Compose status & fallbacks (form values are always preserved) ── */}
        <AnimatePresence initial={false}>
          {statusValues && (
            <motion.div
              key={status.kind}
              role="status"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT_EXPO }}
              className="mt-10 pt-6 border-t border-black/10 dark:border-white/10"
            >
              <p className="font-display text-base font-semibold text-ink">
                {status.kind === "opened"
                  ? "Gmail compose opened in a new tab."
                  : "Gmail couldn't be opened."}
              </p>
              <p className="mt-1.5 text-sm text-muted leading-relaxed max-w-lg">
                {status.kind === "opened"
                  ? "Review your draft there and press Send to deliver it. Nothing has been sent yet."
                  : "Your browser may have blocked the new tab. Use your mail app or copy the prepared message instead."}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
                <a
                  href={buildMailtoUrl(statusValues)}
                  className="group inline-flex items-center gap-1.5 font-medium text-ink"
                >
                  <span className="underline underline-offset-4 decoration-ink/25 group-hover:decoration-ink">
                    Open in mail app
                  </span>
                  <ArrowUpRight size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => copyPrepared(statusValues)}
                  className="inline-flex items-center gap-1.5 font-medium text-ink cursor-pointer"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span className="underline underline-offset-4 decoration-ink/25 hover:decoration-ink">
                    {copied ? "Copied" : "Copy message"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrepared((s) => !s)}
                  aria-expanded={showPrepared}
                  className="text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  {showPrepared ? "Hide prepared message" : "Show prepared message"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-muted hover:text-ink transition-colors cursor-pointer sm:ml-auto"
                >
                  Clear form
                </button>
              </div>

              <AnimatePresence initial={false}>
                {showPrepared && (
                  <motion.pre
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: reduce ? 0 : 0.3 }}
                    tabIndex={0}
                    data-lenis-prevent
                    className="mt-5 max-h-72 overflow-auto whitespace-pre-wrap break-words border-l-2 border-ink/30 pl-4 py-1 font-mono text-xs leading-[1.7] text-ink/85 select-text"
                  >
                    {buildPreparedText(statusValues)}
                  </motion.pre>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}
