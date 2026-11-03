export default function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Monochrome SVG Background Texture System ── */}
      {/* Dark Mode: opacity-[0.055] on deep charcoal (#0A0A0C)
          Light Mode: opacity-[0.045] invert on Warm Studio Cream (#FBF9F5) */}
      <div
        className="absolute inset-0 bg-repeat bg-[length:720px_480px] bg-center opacity-[0.045] invert dark:invert-0 dark:opacity-[0.055] transition-opacity duration-300"
        style={{
          backgroundImage: "url('/background-pattern.svg')",
          maskImage: "radial-gradient(circle at 50% 30%, transparent 20%, black 90%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 30%, transparent 20%, black 90%)",
        }}
      />

      {/* ── Atmospheric Ambient Lighting Layers ── */}
      {/* Light Mode: Warm Studio Cream Top-Right Daylight Aura */}
      <div
        className="ambient-sunlight absolute -top-28 -right-28 w-[780px] h-[780px] rounded-full bg-amber-100/40 blur-[140px] pointer-events-none will-change-transform dark:hidden"
      />

      {/* Dark Mode: OLED Charcoal Center Midnight Aurora */}
      <div
        className="ambient-midnight absolute top-[16%] left-1/2 -translate-x-1/2 w-[880px] h-[880px] rounded-full bg-indigo-950/20 blur-[160px] pointer-events-none will-change-transform hidden dark:block"
      />
    </div>
  );
}
