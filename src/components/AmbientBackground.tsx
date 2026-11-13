export default function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Monochrome SVG Background Texture System ── */}
      {/* Dark Mode (unchanged): inverted-free pattern at opacity 0.055 on deep charcoal.
          Light Mode: the pattern's own four gray tones (#1c1c1c → #cbcbcb) are kept
          un-inverted and multiplied onto Warm Studio Cream, so darker tiles read clearly
          while lighter tiles stay faint — graded contrast instead of a flat opacity bump.
          (Previously `invert` turned the darkest tiles near-white, making them vanish on cream.)
          The radial mask keeps the upper-center reading zone (hero headline) clean. */}
      <div
        className="absolute inset-0 bg-repeat bg-[length:720px_480px] bg-center opacity-[0.085] mix-blend-multiply dark:mix-blend-normal dark:opacity-[0.055] transition-opacity duration-300"
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
