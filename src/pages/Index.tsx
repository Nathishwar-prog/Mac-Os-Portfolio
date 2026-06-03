import { useState, useRef, useEffect } from "react";
import { Dock } from "@/components/Dock";
import { Terminal, TerminalHandle } from "@/components/Terminal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProfileCard } from "@/components/ProfileCard";
import { GitHubActivityCard } from "@/components/GitHubActivityCard";
import { About } from "./About";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Contact } from "./Contact";
import { Resume } from "./Resume";
import Experience from "./Experience";
import Achievements from "./Achievements";
import { Certificates } from "./Certificates";
import { portfolioData } from "@/lib/portfolioData";
import { SpeakingAvatar, SpeakingAvatarHandle } from "@/components/SpeakingAvatar";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const terminalRef = useRef<TerminalHandle>(null);
  const avatarRef = useRef<SpeakingAvatarHandle>(null);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  // Load the Easy Peasy chatbot script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://bots.easy-peasy.ai/chat.min.js";
    script.defer = true;
    script.setAttribute("data-chat-url", "https://bots.easy-peasy.ai/bot/6fc51d13-714c-4afd-bf29-1ef67377b663");
    script.setAttribute("data-btn-position", "bottom-left");
    script.setAttribute("data-widget-btn-color", "#1F2D3D");
    script.id = "easy-peasy-bot-script";

    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      const existingScript = document.getElementById("easy-peasy-bot-script");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // No early return, render both if loading so it overlays


  const handleSectionChange = (section: string) => {
    setActiveSection(section);

    // Trigger command for non-home sections
    if (section !== "home") {
      // We'll use a timeout to ensure the terminal is ready
      setTimeout(() => {
        const commandMap: Record<string, string> = {
          about: "about",
          projects: "projects",
          skills: "skills",
          contact: "contact",
          resume: "resume",
          experience: "experience",
          achievements: "achievements",
          certificates: "certificates"
        };

        const command = commandMap[section];
        if (command && terminalRef.current) {
          terminalRef.current.handleCommand(command);
        }
      }, 100);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "about":
        return <About />;
      case "projects":
        return <Projects />;
      case "skills":
        return <Skills />;
      case "contact":
        return <Contact />;
      case "resume":
        return <Resume />;
      case "experience":
        return <Experience />;
      case "achievements":
        return <Achievements />;
      case "certificates":
        return <Certificates />;
      default:
        return (
          <div className="flex flex-col lg:flex-row bg-gradient-to-br from-[#0d1a2b] via-[#1f2d3d] to-[#c3d4e0] bg-background bg-black h-full overflow-y-auto lg:overflow-hidden">
            {/* Terminal Area - 75% width on desktop, 100% on mobile */}
            <div className="w-full lg:w-[75%] p-4 lg:p-8 h-auto lg:h-full min-h-[500px]">
              <Terminal
                ref={terminalRef}
                currentSection={activeSection}
                isReady={!isLoading}
              />
            </div>

            {/* Profile Cards Area - 25% width on desktop, 100% on mobile */}
            <div className="w-full lg:w-[25%] p-4 lg:p-8 lg:pl-0 flex flex-col gap-4 h-auto lg:h-full">
              <div className="flex-[2] min-h-0">
                <ProfileCard
                  name={portfolioData.about.name}
                  role={portfolioData.about.role}
                  profileCard={portfolioData.about.bio}
                  bio={portfolioData.about.bio}
                  location={portfolioData.about.location}
                  github={portfolioData.contact.github}
                  linkedin={portfolioData.contact.linkedin}
                  twitter={portfolioData.contact.twitter}
                  website={portfolioData.contact.website}
                  instagram={portfolioData.contact.instagram}
                  email={portfolioData.contact.email}
                  avatarTrigger={
                    !isAvatarOpen && (
                      <button
                        onClick={() => avatarRef.current?.startTour()}
                        className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 relative group overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.5)] border border-[#0066ff]/20"
                        title="Start interactive 3D robot tour"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0066ff] via-[#7c3aed] to-[#ec4899] orb-spinning-ring opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute inset-[2px] bg-[#020617] rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[#0066ff] relative z-10 animate-pulse" />
                        </div>
                      </button>
                    )
                  }
                />
              </div>
              <div className="flex-1 min-h-0">
                <GitHubActivityCard />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="flex flex-col md:flex-row h-screen w-full bg-background bg-black overflow-hidden">
        {/* Dock Sidebar - Hidden on mobile, or bottom? For now, sidebar on tablet+ */}
        <div className="hidden md:block w-20 lg:w-24 bg-gradient-to-b from-[#0d1a2b] via-[#1f2d3d] to-[#3c4b57] border-r border-border/50 shrink-0 relative z-50">
          <Dock activeSection={activeSection} onSectionChange={handleSectionChange} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {renderActiveSection()}

          {/* Speaking Avatar / Interactive Visual Guide */}
          <SpeakingAvatar
            ref={avatarRef}
            onSectionChange={handleSectionChange}
            activeSection={activeSection}
            isLoading={isLoading}
            hideTrigger={true}
            onOpenChange={setIsAvatarOpen}
          />

          {/* Mobile Dock (Bottom Bar) */}
          <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl pointer-events-auto">
              <Dock activeSection={activeSection} onSectionChange={handleSectionChange} isMobile={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;