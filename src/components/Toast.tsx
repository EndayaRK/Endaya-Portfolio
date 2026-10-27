import { Check } from "lucide-react";

type ToastProps = {
  message: string | null;
  visible: boolean;
};

export default function Toast({ message, visible }: ToastProps) {
  if (!visible || !message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-surface border border-border shadow-xl px-4 py-3 rounded-xl text-ink text-sm animate-[fadeUp_0.25s_ease-out_both]"
    >
      <span className="w-5 h-5 rounded-full bg-surface-strong border border-border text-ink flex items-center justify-center shrink-0">
        <Check size={12} strokeWidth={2.5} />
      </span>
      <span className="font-medium">{message}</span>
    </div>
  );
}
