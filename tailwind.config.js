/** @type {import('tailwindcss').Config} */


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Semantic surface tokens (Warm Studio Cream / OLED Charcoal) ── */
        bg:       "rgb(var(--c-bg) / <alpha-value>)",
        surface:  "rgb(var(--c-surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--c-surface-elevated) / <alpha-value>)",
        "surface-strong":   "rgb(var(--c-surface-strong) / <alpha-value>)",
        "surface-contrast": "rgb(var(--c-surface-contrast) / <alpha-value>)",

        /* ── Border tokens ── */
        border:        "rgb(var(--c-line) / <alpha-value>)",
        "border-subtle": "rgb(var(--c-line-subtle) / <alpha-value>)",

        /* ── Text tokens ── */
        ink:   "rgb(var(--c-text) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",

        /* ── CTA tokens ── */
        "cta-primary":        "rgb(var(--c-primary-cta) / <alpha-value>)",
        "cta-primary-text":   "rgb(var(--c-primary-cta-text) / <alpha-value>)",
        "cta-secondary":      "rgb(var(--c-secondary-cta) / <alpha-value>)",
        "cta-secondary-text": "rgb(var(--c-secondary-cta-text) / <alpha-value>)",

        /* ── Overlay ── */
        overlay: "rgb(var(--c-overlay) / <alpha-value>)",

        /* Keep legacy names so we don't break components we haven't touched yet. */
        ink_legacy:     "rgb(var(--c-bg) / <alpha-value>)",
        paper:          "rgb(var(--c-text) / <alpha-value>)",
        panel:          "rgb(var(--c-surface) / <alpha-value>)",
        line:           "rgb(var(--c-line) / <alpha-value>)",
        surface2:       "rgb(var(--c-surface-strong) / <alpha-value>)",
        "line-subtle":  "rgb(var(--c-line-subtle) / <alpha-value>)",
        overlay_legacy: "rgb(var(--c-overlay) / <alpha-value>)",

        /* Neutral stubs — no more amber/teal glows. All aliases of the warm-cream palette. */
        amber:         "rgb(var(--c-text) / <alpha-value>)",
        "amber-hover": "rgb(var(--c-muted) / <alpha-value>)",
        teal:          "rgb(var(--c-muted) / <alpha-value>)",
        onaccent:      "rgb(var(--c-primary-cta-text) / <alpha-value>)",
        scrim:         "rgb(var(--c-overlay) / <alpha-value>)",
      },
      fontFamily: {
        /* Primary display / body font */
        display: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        body:    ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        /* Monospace — reserved exclusively for actual code blocks */
        mono:    ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      maxWidth: {
        site: "76rem",
      },
    },
  },
  plugins: [],
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Semantic surface tokens */
        bg:       "rgb(var(--c-bg) / <alpha-value>)",
        surface:  "rgb(var(--c-surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--c-surface-elevated) / <alpha-value>)",
        "surface-strong":   "rgb(var(--c-surface-strong) / <alpha-value>)",
        "surface-contrast": "rgb(var(--c-surface-contrast) / <alpha-value>)",

        /* Border tokens */
        border:        "rgb(var(--c-line) / <alpha-value>)",
        "border-subtle": "rgb(var(--c-line-subtle) / <alpha-value>)",

        /* Text tokens */
        ink:   "rgb(var(--c-text) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",

        /* CTA tokens */
        "cta-primary":        "rgb(var(--c-primary-cta) / <alpha-value>)",
        "cta-primary-text":   "rgb(var(--c-primary-cta-text) / <alpha-value>)",
        "cta-secondary":      "rgb(var(--c-secondary-cta) / <alpha-value>)",
        "cta-secondary-text": "rgb(var(--c-secondary-cta-text) / <alpha-value>)",

        /* Overlay */
        overlay: "rgb(var(--c-overlay) / <alpha-value>)",

        /* Keep legacy names so we don't break components we haven't touched yet */
        ink_legacy:   "rgb(var(--c-bg) / <alpha-value>)",
        paper:        "rgb(var(--c-text) / <alpha-value>)",
        panel:        "rgb(var(--c-surface) / <alpha-value>)",
        line:         "rgb(var(--c-line) / <alpha-value>)",
        surface2:     "rgb(var(--c-surface-strong) / <alpha-value>)",
        "line-subtle": "rgb(var(--c-line-subtle) / <alpha-value>)",
        /* Neutral stubs — no more amber/teal glows */
        amber:        "rgb(var(--c-text) / <alpha-value>)",
        "amber-hover": "rgb(var(--c-muted) / <alpha-value>)",
        teal:         "rgb(var(--c-muted) / <alpha-value>)",
        onaccent:     "rgb(var(--c-primary-cta-text) / <alpha-value>)",
        scrim:        "rgb(var(--c-overlay) / <alpha-value>)",
      },
      fontFamily: {
        /* Primary display / body font — no Space Grotesk or IBM Plex Mono for UI */
        display: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        body:    ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        /* Monospace — reserved exclusively for actual code blocks */
        mono:    ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      maxWidth: {
        site: "76rem",
      },
    },
  },
  plugins: [],
};
