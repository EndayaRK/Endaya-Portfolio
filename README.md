<div align="center">

# Rhon Kelly A. Endaya — Developer Portfolio

**Full-Stack Developer & System Development Student · De La Salle Lipa**

An engineered portfolio, not a template — featuring a live, interactive mobile simulation of a flagship product, a native Gemini-powered copilot, and a console-inspired credential viewer, all served from a single static deployment.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=0A0A0C)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Gemini-3.5_Flash--Lite-8E75FF?style=flat-square&logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Continuous Integration](https://img.shields.io/github/actions/workflow/status/EndayaRK/Endaya-Portfolio/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/EndayaRK/Endaya-Portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](#license--contact)

[Live Demo](https://endaya-portfolio.vercel.app/) · [Report an Issue](https://github.com/EndayaRK/Endaya-Portfolio/issues) · [LinkedIn](https://linkedin.com/in/rhon-kelly-endaya-a91782391) · [Email](mailto:endayarhonkelly@gmail.com)

</div>

---

## Overview

This repository is the source for my personal developer portfolio — a single-page React application engineered to demonstrate production-level frontend architecture rather than simply describe it. Instead of static screenshots and bullet-point summaries, the portfolio embeds a fully interactive product simulator, a serverless AI copilot, and a custom-built navigation experience directly into the browsing surface.

The site is statically served and API-backed by a single Vercel Serverless Function, keeping the deployment footprint minimal while still demonstrating full-stack competency end to end.

---

## Architectural & Engineering Highlights

### Interactive PalengkeHub Mini-Simulator
An embedded, pixel-faithful mobile device frame (`src/components/PalengkeHubSimulator.tsx`) that reproduces the flagship **PalengkeHub** product — a Lipa City Public Market digital marketplace and price comparator — as a *working* micro-application inside the portfolio itself. Visitors can operate the real "Presyo Check" comparator, browse the interactive stall/category rail, and walk through zero-delivery-fee GCash pickup ticket generation without navigating away from the page. This was a deliberate choice to prove UI fidelity and state-management discipline rather than merely illustrate them.

### Native Gemini Copilot ("Ask AI")
A command-palette-triggered assistant (`⌘K` / `Ctrl+K`, see `src/components/AiSearchModal.tsx`) that answers visitor questions about the author's stack, projects, and availability in real time. It is backed entirely by a single Vercel Serverless Function (`api/chat.ts`) calling `gemini-3.5-flash-lite` via the official `@google/genai` SDK — no standalone backend service, container, or database required. The handler is written with automatic model fallback (cascading to `gemini-flash-lite-latest`) so a single model outage or quota limit never results in a dead endpoint.

### Console-Inspired Credential Viewer
A PSP XMB–inspired horizontal Cover Flow carousel (`src/components/Certificates.tsx`) for browsing certifications and honors, featuring scroll-snapped horizontal navigation, full `← →` keyboard (D-pad style) control, an animated background wave rendered in pure CSS, and dynamic focus/scale states on the active credential — turning a conventional "certificates grid" into a distinct, memorable interaction.

### Design System — Monochrome Luxe × Warm Studio Cream
A custom dual-theme system built on CSS custom properties (`src/index.css`), balancing a **Warm Studio Cream** light mode (`#FBF9F5`) against an **OLED Charcoal** dark mode (`#0A0A0C`). Both themes share a single token layer for background bands, text, and CTA surfaces, layered with subtle, low-opacity SVG noise/grid watermarks (`src/components/AmbientBackground.tsx`) for architectural depth without sacrificing typographic contrast or inducing eye fatigue during extended reading.

---

## Tech Stack Matrix

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend / Serverless** | Vercel Serverless Functions, Node.js |
| **AI & APIs** | Google Gemini 3.5 Flash-Lite via the `@google/genai` SDK |
| **Build & Tooling** | Vite, TypeScript Compiler (`tsc -b`), PostCSS, Autoprefixer |
| **Deployment & CI** | Vercel, Git, GitHub Actions (type-check + build verification) |

---

## Project Structure

```text
Endaya-Portfolio/
├── api/
│   └── chat.ts                  # Vercel Serverless Function — Gemini copilot endpoint
├── public/
│   ├── certificates/            # Credential source images/PDFs for the Cover Flow viewer
│   ├── favicon.svg
│   ├── profilepic.jpg
│   └── resume.pdf
├── scripts/
│   └── try-ai.js                # Standalone CLI smoke-test for the Gemini integration
├── src/
│   ├── components/
│   │   ├── AiSearchModal.tsx           # "Ask AI" command-palette copilot UI
│   │   ├── AmbientBackground.tsx       # Dual-theme SVG watermark + ambient glow system
│   │   ├── Certificates.tsx            # PSP XMB-style Cover Flow credential viewer
│   │   ├── CommandPalette.tsx          # ⌘K indexed site/content search
│   │   ├── Hero.tsx / HeroPhoto.tsx    # Landing identity section
│   │   ├── Navigation.tsx              # Sticky header, theme toggle entry point
│   │   ├── PalengkeHubSimulator.tsx    # Embedded live mobile product simulator
│   │   ├── Projects.tsx / ProjectPreview.tsx
│   │   ├── Skills.tsx                  # Progressive, hover-linked competency highlighting
│   │   └── ...                         # About, Footer, Toast, ThemeToggle, etc.
│   ├── App.tsx                  # Root composition, global ⌘K shortcut, theme bootstrap
│   ├── data.ts                  # Single source of truth — profile, projects, certs, skills
│   ├── index.css                # Design-token layer (Warm Studio Cream / OLED Charcoal)
│   ├── main.tsx                 # React DOM entry point
│   └── theme.tsx                # Theme context/provider
├── .github/workflows/ci.yml     # Type-check + production build verification on push/PR
├── .env.example                 # Required environment variable template
├── tailwind.config.js
├── vite.config.ts                # Vite config + local /api/chat dev middleware
└── package.json
```

---

## Local Development Setup

### Prerequisites
- **Node.js 18+**
- A **Google Gemini API key** ([Google AI Studio](https://aistudio.google.com/apikey)) for the "Ask AI" copilot to function locally

### 1. Clone and install

```bash
git clone https://github.com/EndayaRK/Endaya-Portfolio.git
cd Endaya-Portfolio
npm install
```

### 2. Configure environment variables

Copy the example file and supply your own key:

```bash
cp .env.example .env.local
```

```bash
# .env.local
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> `vite.config.ts` loads `GEMINI_API_KEY` into `process.env` automatically in development and proxies `/api/chat` to the serverless handler locally, so the AI copilot works identically to production without any additional backend setup.

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Other scripts

```bash
npm run build        # Type-check (tsc -b) and produce the production build in dist/
npm run preview       # Serve the production build locally
npm run try-ai        # CLI smoke test for the Gemini integration (scripts/try-ai.js)
```

---

## Key Architecture Decisions

**Why `gemini-3.5-flash-lite`?**
The copilot is a secondary, assistive surface, not the core product — it needs to answer short, factual questions about a single, well-defined context (one developer's stack, projects, and availability) with minimal latency. Flash-Lite was chosen over larger Gemini variants for its high throughput, generous rate limits on a free-tier key, and sub-second response times, which keep the modal feeling instantaneous rather than like a bolted-on chatbot. The serverless handler additionally cascades to `gemini-flash-lite-latest` as a fallback, trading a small amount of complexity for meaningfully higher uptime on a hobby-tier API key.

**Why a live client-side device simulation instead of static project screenshots?**
Screenshots communicate what an interface *looked like*; they say nothing about how it behaves under real interaction — state transitions, responsive layout fidelity, loading and empty states, or how a user actually moves through a flow. Rebuilding PalengkeHub's core "Presyo Check" and pickup-ticket flows as a live, self-contained React component inside the portfolio was a deliberate decision to demonstrate exactly those things: component-level state management, interaction design, and empathy for the end user — in a form a recruiter or engineer can personally operate in under thirty seconds, rather than take on faith from a static image.

---

## License & Contact

This project is distributed under the **MIT License**. You are free to fork the structural and tooling patterns demonstrated here; please do not reuse the personal content, copy, or imagery as-is.

**Rhon Kelly A. Endaya**
Full-Stack Developer & System Development Student, De La Salle Lipa
Lipa, Batangas, Philippines

- Email: [endayarhonkelly@gmail.com](mailto:endayarhonkelly@gmail.com)
- LinkedIn: [linkedin.com/in/rhon-kelly-endaya-a91782391](https://linkedin.com/in/rhon-kelly-endaya-a91782391)
- GitHub: [github.com/EndayaRK](https://github.com/EndayaRK)

<div align="center">

*Actively seeking IT internship opportunities in Lipa City, Batangas, or remote.*

</div>
