import { useState } from "react";

export default function Avatar({
  src,
  name,
  size = 64,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const parts = name.trim().split(/\s+/);
  const initials = (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");

  if (!src || failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-surface border border-border flex items-center justify-center font-display text-base font-semibold text-ink shrink-0"
        aria-hidden="true"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      onError={() => setFailed(true)}
      alt={`Photo of ${name}`}
      style={{ width: size, height: size }}
      className="rounded-full object-cover border border-border shrink-0"
    />
  );
}
