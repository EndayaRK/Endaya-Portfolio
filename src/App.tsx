import { useEffect, useState } from "react";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import InitialPreloader from "./components/InitialPreloader";
import Navigation from "./components/Navigation";
import AmbientBackground from "./components/AmbientBackground";
import Hero from "./components/Hero";
import ProfessionalOverview from "./components/ProfessionalOverview";
import Projects from "./components/Projects";
import TechnicalCompetencies from "./components/TechnicalCompetencies";
import Certificates from "./components/Certificates";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import AiChatWidget from "./components/AiChatWidget";
import { profile } from "./data";

export default function App() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightedProjectIds, setHighlightedProjectIds] = useState<string[] | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Global shortcut: Cmd+K / Ctrl+K opens AI chatbot
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsAiChatOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for custom project select events from navbar search, skills, and Developer Journey milestones
  useEffect(() => {
    function handleSelectPortfolioProject(e: Event) {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setHighlightedProjectIds([customEvent.detail]);
      }
    }

    function handleSelectProjectIndex(e: Event) {
      const customEvent = e as CustomEvent<number | string>;
      if (typeof customEvent.detail === "number") {
        const idMap = ["palengkehub", "event-tracker", "auto-avenue"];
        if (idMap[customEvent.detail]) {
          setHighlightedProjectIds([idMap[customEvent.detail]]);
        }
      } else if (typeof customEvent.detail === "string") {
        setHighlightedProjectIds([customEvent.detail]);
      }
    }

    window.addEventListener("select-portfolio-project", handleSelectPortfolioProject);
    window.addEventListener("select-project", handleSelectProjectIndex);
    return () => {
      window.removeEventListener("select-portfolio-project", handleSelectPortfolioProject);
      window.removeEventListener("select-project", handleSelectProjectIndex);
    };
  }, []);

  function copyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(profile.email).then(
        () => {
          setEmailCopied(true);
          setToastMessage(`Copied: ${profile.email}`);
          setTimeout(() => {
            setEmailCopied(false);
            setToastMessage(null);
          }, 3000);
        },
        () => {
          window.location.href = `mailto:${profile.email}`;
        }
      );
    } else {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-band-primary text-ink selection:bg-ink/10 selection:text-ink relative overflow-x-hidden">
        {/* Premium Initial Loading Screen */}
        <InitialPreloader />

        {/* Ambient Background with SVG Grid and Drifting Radial Blur Glows */}
        <AmbientBackground />

        {/* Navigation with Integrated Compact Search */}
        <Navigation onOpenAi={() => setIsAiChatOpen((prev) => !prev)} />

        {/* Main Content with Alternating Section Bands */}
        <main className="relative z-10">
          <Hero />
          <ProfessionalOverview />
          <Projects
            highlightedProjectId={
              highlightedProjectIds && highlightedProjectIds.length > 0
                ? highlightedProjectIds[0]
                : null
            }
          />
          <TechnicalCompetencies onHoverGroup={(ids) => setHighlightedProjectIds(ids)} />
          <Certificates />
        </main>

        {/* Footer / Contact */}
        <div className="relative z-10">
          <Footer onCopyEmail={copyEmail} emailCopied={emailCopied} />
        </div>

        <Toast message={toastMessage} visible={!!toastMessage} />

        {/* ── Messenger-Style Floating AI Chat Widget ── */}
        <AiChatWidget
          isOpen={isAiChatOpen}
          onOpenChange={setIsAiChatOpen}
        />
      </div>
    </SmoothScrollProvider>
  );
}
