import { useState } from "react";
import { MapPin } from "lucide-react";

type HeroPhotoProps = {
  src?: string;
  name: string;
  location: string;
};

export default function HeroPhoto({
  src = "/profilepic.jpg",
  name,
  location,
}: HeroPhotoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full max-w-sm mx-auto lg:max-w-none">
      {/* Outer frame — rounded-3xl with 1px border + soft shadow */}
      <div className="relative rounded-3xl border border-border bg-surface shadow-[0_4px_40px_-8px_rgb(0_0_0/0.12)] dark:shadow-[0_4px_40px_-8px_rgb(0_0_0/0.50)] overflow-hidden">

        {/* ── Location pill — top-right corner ── */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/90 dark:bg-surface/80 backdrop-blur-md border border-border text-xs font-medium text-muted shadow-sm">
          <MapPin size={11} className="text-ink" />
          {location}
        </div>

        {/* ── Photo ── */}
        <div className="aspect-[4/5] w-full bg-surface-strong">
          {!imageError ? (
            <img
              src={src}
              alt={`Photo of ${name}`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            /* ── Fallback initials card ── */
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 bg-surface-contrast">
              <div className="w-20 h-20 rounded-full border border-border bg-surface flex items-center justify-center font-display text-2xl font-bold text-ink select-none">
                RE
              </div>
              <div className="text-center">
                <p className="font-display text-base font-semibold text-ink">{name}</p>
                <p className="text-sm text-muted mt-1">Drop photo at public/profilepic.jpg</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
