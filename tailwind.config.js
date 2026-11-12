/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Alternating Section Bands ── */
        "band-primary":   "rgb(var(--c-band-primary) / <alpha-value>)",
        "band-secondary": "rgb(var(--c-band-secondary) / <alpha-value>)",

        /* ── Semantic surface tokens (Warm Studio Cream / OLED Charcoal) ── */
        bg:                 "rgb(var(--c-bg) / <alpha-value>)",
        surface:            "rgb(var(--c-surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--c-surface-elevated) / <alpha-value>)",
        "surface-strong":   "rgb(var(--c-surface-strong) / <alpha-value>)",
        "surface-contrast": "rgb(var(--c-surface-contrast) / <alpha-value>)",

        /* ── Border tokens ── */
        border:          "rgb(var(--c-line) / <alpha-value>)",
        "border-subtle": "rgb(var(--c-line-subtle) / <alpha-value>)",

        /* ── Text tokens ── */
        ink:   "rgb(var(--c-text) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",

        /* ── CTA tokens ── */
        "cta-primary":        "rgb(var(--c-primary-cta) / <alpha-value>)",
        "cta-primary-text":   "rgb(var(--c-primary-cta-text) / <alpha-value>)",
        "cta-secondary":      "rgb(var(--c-secondary-cta) / <alpha-value>)",
        "cta-secondary-text": "rgb(var(--c-secondary-cta-text) / <alpha-value>)",

        /* ── Editorial plane & restrained accent ── */
        plane:  "rgb(var(--c-plane) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",

        /* ── Overlay ── */
        overlay: "rgb(var(--c-overlay) / <alpha-value>)",

        /* Backward compat aliases */
        ink_legacy:     "rgb(var(--c-bg) / <alpha-value>)",
        paper:          "rgb(var(--c-text) / <alpha-value>)",
        panel:          "rgb(var(--c-surface) / <alpha-value>)",
        line:           "rgb(var(--c-line) / <alpha-value>)",
        surface2:       "rgb(var(--c-surface-strong) / <alpha-value>)",
        "line-subtle":  "rgb(var(--c-line-subtle) / <alpha-value>)",
        overlay_legacy: "rgb(var(--c-overlay) / <alpha-value>)",
        amber:          "rgb(var(--c-text) / <alpha-value>)",
        "amber-hover":  "rgb(var(--c-muted) / <alpha-value>)",
        teal:           "rgb(var(--c-muted) / <alpha-value>)",
        onaccent:       "rgb(var(--c-primary-cta-text) / <alpha-value>)",
        scrim:          "rgb(var(--c-overlay) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        body:    ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        /* Editorial serif — used sparingly for display contrast only */
        serif:   ["'Instrument Serif'", "Georgia", "'Times New Roman'", "serif"],
      },
      maxWidth: {
        site: "76rem",
      },
      letterSpacing: {
        tightest: "-0.045em",
        "widest-editorial": "0.22em",
      },
    },
  },
  plugins: [],
};
