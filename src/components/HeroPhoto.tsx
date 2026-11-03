import { useState } from "react";

type HeroPhotoProps = {
  src?: string;
  name?: string;
};

export default function HeroPhoto({
  src = "/formalpic.png",
  name = "Rhon Kelly Endaya",
}: HeroPhotoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-2 lg:py-4">
      {/* ── Ambient Backlight: Soft radial glow centered behind upper torso ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-72 h-72 rounded-full bg-amber-200/20 dark:bg-indigo-500/15 blur-3xl pointer-events-none transform-gpu"
        aria-hidden="true"
      />

      {/* ── Portrait with 75% to 100% Bottom Gradient Mask (Dissolves naturally without hard cut lines) ── */}
      <div
        className="relative z-10 w-full flex items-center justify-center"
        style={{
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)",
        }}
      >
        {!imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full max-w-[290px] sm:max-w-[340px] lg:max-w-[390px] xl:max-w-[420px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_20px_45px_rgba(0,0,0,0.5)] pointer-events-none transform-gpu translate-y-[-12px] sm:translate-y-[-16px] lg:translate-y-[-20px]"
            loading="eager"
          />
        ) : (
          <div className="w-44 h-44 rounded-full border border-black/5 dark:border-white/10 bg-white dark:bg-[#141416] flex items-center justify-center font-display text-2xl font-bold text-ink">
            RE
          </div>
        )}
      </div>
    </div>
  );
}
