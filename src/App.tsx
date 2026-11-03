import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import AmbientBackground from "./components/AmbientBackground";
import Hero from "./components/Hero";
import ProfessionalOverview from "./components/ProfessionalOverview";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import About from "./components/About";
import Certificates from "./components/Certificates";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import AiSearchModal from "./components/AiSearchModal";
import { profile } from "./data";

export default function App() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightedProjectIds, setHighlightedProjectIds] = useState<string[] | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Global shortcut: Cmd+K / Ctrl+K opens AI modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsAiModalOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    <div className="min-h-screen bg-band-primary text-ink selection:bg-ink/10 selection:text-ink relative overflow-x-hidden">
      {/* Ambient Background with SVG Grid and Drifting Radial Blur Glows */}
      <AmbientBackground />

      {/* Navigation */}
      <Navigation onOpenAi={() => setIsAiModalOpen(true)} />

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
        <Skills onHoverGroup={(ids) => setHighlightedProjectIds(ids)} />
        <About />
        <Certificates />
      </main>

      {/* Footer / Contact */}
      <div className="relative z-10">
        <Footer onCopyEmail={copyEmail} emailCopied={emailCopied} />
      </div>

      <Toast message={toastMessage} visible={!!toastMessage} />

      {/* Gemini Flash-Lite AI Search Modal */}
      <AiSearchModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
