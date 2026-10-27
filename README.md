# Rhon Kelly Endaya — Developer Portfolio

A modern, minimal, high-impact personal developer portfolio built with React, TypeScript, Vite, and Tailwind CSS.

## Design Philosophy: Minimal Surface, Maximum Impact

- **Introduction First**: Hero focuses on identity and core engineering direction, supported by a custom developer workspace visual rather than competing project cards.
- **Dedicated Selected Work**: Features primary candidate **Event Tracker** in a split interactive showcase, with **PalengkeHub** and **Auto Avenue** in a responsive grid.
- **Progressive Skills Highlighting**: Selecting or hovering over any technical competency dynamically highlights the projects that demonstrate those skills.
- **Editorial About Section**: Grounded in authentic 4th-year BSIT experience at De La Salle Lipa, detailing system development, core engineering principles, education, and JPCS leadership.
- **Two-Tone Theming**: Deliberately designed Light and Dark modes with warm editorial paper and deep charcoal aesthetics.
- **Scalable Architecture**: Adding new projects or certificates is completely data-driven through `src/data.ts`.

---

## Run Locally

```bash
npm install
npm run dev
```

Visit the local development server (typically `http://localhost:5173`).

---

## How to Add Projects & Certificates (Scalable)

All content is managed through [`src/data.ts`](file:///c:/Users/RK/Downloads/rhon-kelly-portfolio/portfolio/src/data.ts). You do **not** need to modify components to add new items.

### 1. Adding a New Project
In `src/data.ts`, add a new object to the `projects` array:

```typescript
{
  id: "your-project-id",
  version: "v4",
  dateRange: "Jan 2027 — Present",
  title: "Your Project Title",
  category: "Full-Stack", // Custom categories automatically create new filter pills!
  type: "Full-Stack Web Application",
  role: "Full-Stack Architect",
  previewVariant: "dashboard", // "dashboard" | "table" | "mobile"
  stack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  summary: "Concise summary of what the application does.",
  details: [
    "Key implementation achievement 1.",
    "Key implementation achievement 2."
  ],
  repoUrl: "https://github.com/EndayaRK/your-project",
  liveUrl: "https://your-project.vercel.app",
}
```

### 2. Adding a New Certificate
In `src/data.ts`, add a new object to the `certificates` array:

```typescript
{
  id: "aws-cloud-practitioner",
  title: "AWS Certified Cloud Practitioner",
  issuer: "Amazon Web Services",
  date: "2026",
  category: "Cloud & Infrastructure", // Dynamic filter pill created automatically
  grade: "Score: 860", // Optional
  description: "Foundational cloud computing and architecture certification.",
  credentialUrl: "https://www.credly.com/...", // Optional verification link
  image: "/certificates/aws-cert.png", // Optional image placed in public/certificates/
}
```
*Note: If no image is provided, the card automatically generates an official credential seal with the issuer's name and grade.*

---

## Build for Production

```bash
npm run build
```

The production bundle will be created in `dist/`.
