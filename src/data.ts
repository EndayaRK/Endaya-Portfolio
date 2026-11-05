// Edit this file to update the content shown on the site.
// All sections dynamically derive their content, categories, and filters from this file.

export const profile = {
  name: "Rhon Kelly A. Endaya",
  initials: "RE",
  photo: "/formalpic.png",
  role: "BS Information Technology Student · Aspiring Full-Stack Developer",
  headline: "Building full-stack software, from interface to implementation.",
  shortBio:
    "Fourth-year BS Information Technology student at De La Salle Lipa, majoring in System Development. I build full-stack web applications independently and collaborate on mobile and web systems, working primarily with React, TypeScript, Node.js, Express.js, and PHP.",
  summary:
    "Fourth-year BS Information Technology student at De La Salle Lipa, majoring in System Development. I build full-stack web applications independently and collaborate on mobile and web projects, working mainly in React, TypeScript, Node.js, Express.js, and PHP.",
  location: "Malvar, Batangas, Philippines",
  status: "System Development · Full-Stack",
  availability: "Available for immediate start",
  email: "endayarhonkelly@gmail.com",
  phone: "0946 220 1087",
  linkedin: "https://linkedin.com/in/rhon-kelly-endaya-a91782391",
  github: "https://github.com/EndayaRK",
};

export const professionalOverview = [
  {
    index: "01",
    label: "Development Focus",
    title: "Full-Stack Web Applications",
    description:
      "Designing responsive, accessible frontends and connecting them to robust, type-safe backend architectures and APIs.",
    tags: ["React", "TypeScript", "Node.js", "Express.js"],
  },
  {
    index: "02",
    label: "Architecture & Data",
    title: "Reliable APIs & Persistence",
    description:
      "Structuring relational and document data stores with schema validation, JWT authentication, and predictable RESTful workflows.",
    tags: ["MongoDB Atlas", "PostgreSQL", "MySQL", "Supabase"],
  },
  {
    index: "03",
    label: "Practical Experience",
    title: "Shipped Real-World Systems",
    description:
      "From event registration platforms and automotive inventory management to multi-vendor public market capstone applications.",
    tags: ["Event Tracker", "PalengkeHub", "Auto Avenue"],
  },
  {
    index: "04",
    label: "Current Direction",
    title: "BSIT @ De La Salle Lipa",
    description:
      "Fourth-year undergraduate specializing in System Development, actively seeking a high-impact IT internship to contribute to production code.",
    tags: ["System Development", "Dean's Lister", "JPCS Member"],
  },
];

export type SkillCategory =
  | "Frontend Development"
  | "Backend & APIs"
  | "Databases & Cloud"
  | "Mobile & Capstone"
  | "Development Tools";

export type SkillGroup = {
  label: SkillCategory;
  description: string;
  items: string[];
  relatedProjectIds: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend Development",
    description: "Building responsive, component-driven client interfaces with strict typing and modern CSS.",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Vite",
      "TanStack Query",
      "Zustand",
      "HTML5",
      "CSS3",
    ],
    relatedProjectIds: ["event-tracker", "palengkehub"],
  },
  {
    label: "Backend & APIs",
    description: "Architecting server runtimes, RESTful route handlers, authentication flows, and data validation.",
    items: [
      "Node.js",
      "Express.js",
      "PHP",
      "FastAPI",
      "Python",
      "Java",
      "C++",
      "JWT Auth",
      "Zod Validation",
    ],
    relatedProjectIds: ["event-tracker", "auto-avenue"],
  },
  {
    label: "Databases & Cloud",
    description: "Schema modeling, query optimization, and persistent storage across SQL and NoSQL engines.",
    items: [
      "MongoDB Atlas",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Supabase",
      "SQLite",
      "Mongoose ORM",
    ],
    relatedProjectIds: ["event-tracker", "auto-avenue", "palengkehub"],
  },
  {
    label: "Mobile & Capstone",
    description: "Cross-platform mobile interfaces and collaborative capstone application workflows.",
    items: ["React Native", "Expo", "Mobile UI Design", "Cross-Platform State"],
    relatedProjectIds: ["palengkehub"],
  },
  {
    label: "Development Tools",
    description: "Version control, API testing, continuous deployment, and development environments.",
    items: [
      "Git",
      "GitHub",
      "Vercel",
      "Postman",
      "VS Code",
      "Linux",
      "UiPath RPA",
      "RESTful Workflows",
    ],
    relatedProjectIds: ["event-tracker", "auto-avenue", "palengkehub"],
  },
];

export type PreviewVariant = "dashboard" | "table" | "mobile";

export type Project = {
  id: string;
  version: string;
  dateRange: string;
  title: string;
  category: "Full-Stack" | "Mobile & Capstone" | "Database & Web";
  type: string;
  role: string;
  stack: string[];
  summary: string;
  details: string[];
  repoUrl?: string;
  liveUrl?: string;
  previewVariant: PreviewVariant;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "palengkehub",
    version: "v1.2",
    dateRange: "Mar 2026 — Present",
    title: "PalengkeHub — Digital Marketplace & Price Comparator for Lipa City Public Market",
    category: "Mobile & Capstone",
    type: "Public Market Marketplace (Capstone Project)",
    role: "Frontend Developer & UI Designer (Lead Frontend Architecture)",
    previewVariant: "mobile",
    featured: true,
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "REST API",
    ],
    summary:
      "A collaborative digital marketplace modernizing Lipa City Public Market operations with stall-level price benchmarking, real-time Presyo Check comparisons, and scheduled zero-delivery-fee pickup ticketing.",
    details: [
      "Built the 'Presyo Check' engine allowing market-goers to compare real-time vendor unit pricing per kilo across wet and dry stalls with dynamic price benchmarking.",
      "Designed the mobile-first UX with zero-delivery-fee pickup ticketing and scheduled stall collection windows with instant claim codes (e.g., PH-2416).",
      "Engineered responsive client components using React, TypeScript, and Tailwind CSS tailored for fast-paced market vendors and smartphone shoppers with low latency.",
      "Collaborated on backend RESTful endpoints and authentication schemas connecting vendor inventories with consumer order queues.",
    ],
    repoUrl: "https://github.com/EndayaRK",
    liveUrl: "https://www.palengkehub.site/",
  },
  {
    id: "event-tracker",
    version: "v3",
    dateRange: "Jul 2026 — Oct 2026",
    title: "Event Tracker",
    category: "Full-Stack",
    type: "Full-Stack Web Application",
    role: "Full-Stack Architect & Developer",
    previewVariant: "dashboard",
    featured: false,
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "Mongoose",
      "JWT",
      "TanStack Query",
      "Zustand",
      "Zod",
      "Vercel",
    ],
    summary:
      "A comprehensive event management platform enabling users to securely create accounts, browse upcoming events, and manage their own registrations end to end.",
    details: [
      "Built the responsive frontend in React, TypeScript, and Vite with Tailwind CSS for structured typography and styling.",
      "Architected the RESTful backend in Node.js and Express.js, leveraging MongoDB Atlas and Mongoose for persistent data modeling.",
      "Implemented secure JWT-based user authentication, TanStack Query for cache invalidation and data fetching, and Zustand for lightweight global state.",
      "Enforced strict payload validation using Zod schemas at API boundaries to prevent invalid state mutations.",
      "Configured automated continuous deployment to Vercel with environment variable isolation.",
    ],
    repoUrl: "https://github.com/EndayaRK",
    liveUrl: "https://event-tracker-endayark.vercel.app",
  },
  {
    id: "auto-avenue",
    version: "v2",
    dateRange: "May 2025 — Jun 2025",
    title: "Auto Avenue Inventory Management System",
    category: "Database & Web",
    type: "Web Application & Supplier Portal",
    role: "Backend & Database Developer",
    previewVariant: "table",
    stack: ["PHP", "MySQL", "RESTful Workflows", "Role-Based Auth", "Report Generation"],
    summary:
      "An inventory tracking and supplier portal built for Auto Avenue, covering stock movements and department replenishment.",
    details: [
      "Implemented role-based authentication and permissions separating warehouse personnel, department managers, and suppliers.",
      "Engineered automated stock reorder thresholds that trigger notifications before critical parts reach depletion.",
      "Built structured exportable reporting tools, significantly cutting down manual inventory audit hours.",
      "Standardized stock movement logs across departments to eliminate inventory discrepancies.",
    ],
    repoUrl: "https://github.com/EndayaRK",
  },
];

export const education = {
  school: "De La Salle Lipa",
  location: "Lipa City, Batangas, Philippines",
  degree: "Bachelor of Science in Information Technology",
  major: "Major in System Development",
  dateRange: "Jul 2023 — Present",
  standing: "Fourth-Year Undergraduate",
  description:
    "Rigorous curriculum focusing on software engineering principles, system analysis and design, database management, web applications, and collaborative capstone development.",
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: "Academic Honors" | "Programming" | "IT Support & Operations" | string;
  credentialUrl?: string;
  image?: string;
  pdfUrl?: string;
  grade?: string;
  description?: string;
};

// Add one entry per certificate here. The Certificates section automatically handles
// filtering pills and the responsive showcase regardless of how many you add.
export const certificates: Certificate[] = [
  {
    id: "cisco-python-essentials-2",
    title: "Python Essentials 2",
    issuer: "Cisco Networking Academy",
    date: "27 Oct 2026",
    category: "Programming",
    image: "/certificates/python-essentials-2.png",
    pdfUrl: "/certificates/python-essentials-2.pdf",
    description:
      "Awarded for successfully completing Python Essentials 2 offered through the Cisco Networking Academy program. Certificate ID: de2be413-432b-41a7-b2c8-61c105dc9f97.",
  },
  {
    id: "cisco-python-essentials-1",
    title: "Python Essentials 1",
    issuer: "Cisco Networking Academy",
    date: "15 Apr 2026",
    category: "Programming",
    image: "/certificates/Python_Essentials_1_certificate.png",
    pdfUrl: "/certificates/Python_Essentials_1_certificate.pdf",
    description:
      "Awarded for successfully completing Python Essentials 1 offered through the Cisco Networking Academy program. Certificate ID: 529caf5f-0650-4720-ac1f-06ea01da0377.",
  },
  {
    id: "cisco-cyber-threat-management",
    title: "Cyber Threat Management",
    issuer: "Cisco Networking Academy",
    date: "27 Mar 2026",
    category: "IT Support & Operations",
    image: "/certificates/cyber-threat-management.png",
    pdfUrl: "/certificates/cyber-threat-management.pdf",
    description:
      "Awarded for successfully completing Cyber Threat Management offered through the Cisco Networking Academy program. Certificate ID: f3a818bb-7f4a-4a97-bfe4-149e9ef6caf9.",
  },
  {
    id: "ethical-hacking-and-data-analytics",
    title: "Bridging Ethical Hacking and Data Analytics",
    issuer: "De La Salle Lipa & Swinburne University of Technology",
    date: "13 Jan 2026",
    category: "IT Support & Operations",
    image: "/certificates/ethical-hacking-and-data-analytics.png",
    pdfUrl: "/certificates/ethical-hacking-and-data-analytics.pdf",
    description:
      "Certificate of Attendance for participating in 'Bridging Ethical Hacking and Data Analytics: Building Smarter and Safer Systems' at De La Salle Lipa.",
  },
  {
    id: "first-line-support",
    title: "First Line Support",
    issuer: "Service Desk Simulator",
    date: "September 18, 2026",
    category: "IT Support & Operations",
    grade: "20+ Tickets Resolved",
    image: "/certificates/first-line-support-certificate.png",
    description:
      "Credential verifying resolution of 20+ service desk tickets covering front-line IT diagnostics, customer support, and system troubleshooting. Certificate ID: SDS-2026-0918-7891.",
  },
  {
    id: "dlsl-career-launchpad-grit-factor",
    title: "Career Launchpad & The Grit Factor",
    issuer: "De La Salle Lipa Guidance & Counseling Center",
    date: "13 Aug 2026",
    category: "IT Support & Operations",
    image: "/certificates/career-launchpad-grit-factor.png",
    pdfUrl: "/certificates/career-launchpad-grit-factor.pdf",
    description:
      "Certificate of Participation for the Back2Back seminar: Career 104 and SEEDS 104 covering campus-to-career navigation and professional resilience.",
  },
  {
    id: "jpcs-devroutes-2026",
    title: "DevRoutes: Learning How to Learn with Roadmaps",
    issuer: "Junior Philippine Computer Society — DLSL Chapter",
    date: "29 Jan 2026",
    category: "Programming",
    image: "/certificates/devroutes-2026.png",
    pdfUrl: "/certificates/devroutes-2026.pdf",
    description:
      "Certificate of Participation for attendance during DevRoutes: Learning How to Learn with Roadmaps at De La Salle Lipa.",
  },
  {
    id: "usaid-ai-ethics-and-governance",
    title: "AI Ethics and Governance",
    issuer: "USAID & Asia Open RAN Academy",
    date: "19 Oct 2024",
    category: "Programming",
    image: "/certificates/ai-ethics-and-governance.png",
    pdfUrl: "/certificates/ai-ethics-and-governance.pdf",
    description:
      "Certificate of Participation for attending the USAID webinar on Advancing Open RAN in Asia focusing on AI Ethics and Governance.",
  },
  {
    id: "deans-lister-2024-2025",
    title: "Dean's Lister — Third Honor",
    issuer: "De La Salle Lipa",
    date: "First Semester, AY 2024–2025",
    category: "Academic Honors",
    grade: "GPA 3.4615",
    image: "/certificates/DL2024-2025.png",
    pdfUrl: "/certificates/DL2024-2025.pdf",
    description:
      "Awarded for academic excellence and outstanding scholastic achievement in the BS Information Technology program.",
  },
  {
    id: "deans-lister-2023-2024",
    title: "Dean's Lister — Third Honor",
    issuer: "De La Salle Lipa",
    date: "First Semester, AY 2023–2024",
    category: "Academic Honors",
    grade: "GPA 3.3478",
    image: "/certificates/DL2023-2024.png",
    pdfUrl: "/certificates/DL2023-2024.pdf",
    description:
      "Recognized on the college honors list for consistent academic performance across technical and general coursework.",
  },
];

export const leadership = [
  {
    role: "Member",
    organization: "Junior Philippine Computer Society (JPCS) — De La Salle Lipa Chapter",
    dateRange: "2023 — Present",
    detail:
      "Active participant in technical workshops, hackathons, and seminars. Assisting in event coordination and campus tech activities that promote hands-on programming skills within the student community.",
  },
];

export const engineeringPrinciples = [
  {
    number: "01",
    title: "Interface to Implementation",
    description:
      "Clean interfaces only deliver value when powered by resilient data models. I develop both sides with equal dedication.",
  },
  {
    number: "02",
    title: "Type Safety at Boundaries",
    description:
      "Using TypeScript and Zod to validate data as it enters the system, catching bugs at compile time instead of in production.",
  },
  {
    number: "03",
    title: "Functional Minimalism",
    description:
      "Software should feel effortless to use. I prioritize legible typography, clear affordances, and fast interaction over decorative excess.",
  },
];
