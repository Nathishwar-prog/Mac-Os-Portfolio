import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { ProjectModal } from "./ProjectModal";
import { SectionModal } from "./SectionModal";
import { portfolioData } from "@/lib/portfolioData";
import { config } from "@/lib/config";
import { useTheme } from "@/context/ThemeContext";

interface TerminalLine {
  type: "input" | "output" | "error" | "loading";
  content: string;
}

interface TerminalProps {
  currentSection: string;
  isReady?: boolean;
}

export interface TerminalHandle {
  handleCommand: (cmd: string) => void;
}

const welcomeMessages = config.terminal.welcomeMessages;

const ALL_COMMANDS = [
  "about", "projects", "skills", "experience",
  "achievements", "certificates", "contact", "clear", "help", "theme", "toggle"
];

export const Terminal = forwardRef<TerminalHandle, TerminalProps>(({ currentSection, isReady = true }, ref) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof portfolioData.projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalSection, setCurrentModalSection] = useState<string | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingCharIndex, setTypingCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [responseLines, setResponseLines] = useState<TerminalLine[]>([]);
  const [responseLineIndex, setResponseLineIndex] = useState(0);
  const [responseCharIndex, setResponseCharIndex] = useState(0);
  const [isResponseTyping, setIsResponseTyping] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);
  const { setTheme, availableThemes } = useTheme();

  // Expose handleCommand method to parent components
  useImperativeHandle(ref, () => ({
    handleCommand,
  }));

  // Handle Ctrl+C and skip intro
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Ctrl+C handling
      if (e.ctrlKey && e.key === 'c') {
        if (isLoading || isTyping || isResponseTyping) {
          e.preventDefault();
          abortRef.current = true;

          // Immediately stop all activities
          setIsLoading(false);
          setIsTyping(false);
          setIsResponseTyping(false);

          setLines(prev => [...prev, { type: "output", content: "^C" }]);

          // Ensure input is focused and ready
          setTimeout(() => inputRef.current?.focus(), 10);
          return;
        }
      }

      // Skip introduction on any key
      if (isTyping && !e.ctrlKey && !e.altKey && !e.metaKey && e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt') {
        // This logic was partly in the previous useEffect, merging it here for clarity or keeping it separate is fine.
        // But the previous implementation logic was specific to skipping. 
        // Let's keep the skip logic as it was but strictly for "skip" action if not Ctrl+C
      }
    };

    // Previous skip logic:
    const handleSkip = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'c') return; // Handled above

      if (isTyping) {
        // Skip all typing
        setIsTyping(false);
        setLines(welcomeMessages.map(msg => ({ type: "output", content: msg })));
        setLines(prev => [...prev, { type: "output", content: "" }]);
      }
    };

    window.addEventListener("keydown", handleGlobalKeydown);
    if (isTyping) {
      window.addEventListener("keydown", handleSkip);
    }

    return () => {
      window.removeEventListener("keydown", handleGlobalKeydown);
      window.removeEventListener("keydown", handleSkip);
    };
  }, [isTyping, isLoading, isResponseTyping]);

  useEffect(() => {
    if (isTyping || isLoading || isResponseTyping) {
      abortRef.current = false;
    }
  }, [isTyping, isLoading, isResponseTyping]);


  // Typing animation effect for welcome messages
  useEffect(() => {
    if (abortRef.current) return;
    if (!isReady) return;

    if (isTyping && typingIndex < welcomeMessages.length) {
      const currentMessage = welcomeMessages[typingIndex];

      if (typingCharIndex < currentMessage.length) {
        // Variable typing speed for more natural effect
        const randomSpeed = Math.random() * 30 + 15; // Between 15-45ms
        const timer = setTimeout(() => {
          if (abortRef.current) return;
          setLines(prev => {
            const newLines = [...prev];
            if (newLines[typingIndex]) {
              newLines[typingIndex] = {
                ...newLines[typingIndex],
                content: currentMessage.substring(0, typingCharIndex + 1)
              };
            } else {
              newLines.push({
                type: "output",
                content: currentMessage.substring(0, typingCharIndex + 1)
              });
            }
            return newLines;
          });
          setTypingCharIndex(prev => prev + 1);
        }, randomSpeed);

        return () => clearTimeout(timer);
      } else {
        // Move to next message after a delay with random pause
        const randomPause = Math.random() * 300 + 200; // Between 200-500ms
        const timer = setTimeout(() => {
          if (abortRef.current) return;
          setTypingIndex(prev => prev + 1);
          setTypingCharIndex(0);
        }, randomPause);

        return () => clearTimeout(timer);
      }
    } else if (isTyping && typingIndex >= welcomeMessages.length) {
      // Finished typing all messages
      setIsTyping(false);
      // Add a blank line at the end
      setLines(prev => [...prev, { type: "output", content: "" }]);
    }
  }, [typingIndex, typingCharIndex, isTyping, isReady]);

  // Typing animation effect for command responses
  useEffect(() => {
    if (abortRef.current) return;

    if (isResponseTyping && responseLineIndex < responseLines.length) {
      const currentLine = responseLines[responseLineIndex];

      if (responseCharIndex < currentLine.content.length) {
        const timer = setTimeout(() => {
          if (abortRef.current) return;
          setLines(prev => {
            const newLines = [...prev];
            // Add the typed character to the last line
            const lastIndex = newLines.length - 1;
            if (lastIndex >= 0) {
              newLines[lastIndex] = {
                ...newLines[lastIndex],
                content: currentLine.content.substring(0, responseCharIndex + 1)
              };
            }
            return newLines;
          });
          setResponseCharIndex(prev => prev + 1);
        }, 20); // Typing speed for responses

        return () => clearTimeout(timer);
      } else {
        // Move to next line after a delay
        const timer = setTimeout(() => {
          if (abortRef.current) return;
          // Add a new line for the next response
          if (responseLineIndex < responseLines.length - 1) {
            setLines(prev => [...prev, { type: currentLine.type, content: "" }]);
          }
          setResponseLineIndex(prev => prev + 1);
          setResponseCharIndex(0);
        }, 300);

        return () => clearTimeout(timer);
      }
    } else if (isResponseTyping && responseLineIndex >= responseLines.length) {
      // Finished typing all response lines
      setIsResponseTyping(false);
      // Add a blank line at the end for the next input
      setLines(prev => [...prev, { type: "output", content: "" }]);
    }
  }, [responseLineIndex, responseCharIndex, isResponseTyping, responseLines]);

  // Initialize with empty lines for typing
  useEffect(() => {
    if (lines.length === 0) {
      setLines(welcomeMessages.map(() => ({ type: "output", content: "" })));
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (currentSection !== "home") {
      // Don't auto-trigger commands when section changes via dock
      // The parent component will handle this
    }
  }, [currentSection]);

  const showLoadingAnimation = async (cmd: string) => {
    const loadingMessages = config.terminal.loadingMessages;

    setIsLoading(true);
    abortRef.current = false; // Reset abort status

    for (const message of loadingMessages) {
      if (abortRef.current) {
        setIsLoading(false);
        return;
      }

      // Variable delay for more natural feel
      const randomDelay = Math.random() * 400 + 100; // Between 100-500ms
      await new Promise((resolve) => setTimeout(resolve, randomDelay));

      if (abortRef.current) {
        setIsLoading(false);
        return;
      }

      setLines((prev) => [...prev, { type: "loading", content: `[${new Date().toLocaleTimeString()}] ${message}` }]);
    }

    if (abortRef.current) {
      setIsLoading(false);
      return;
    }

    // Add a completion message with a checkmark
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (abortRef.current) {
      setIsLoading(false);
      return;
    }

    setLines((prev) => [...prev, { type: "output", content: `[${new Date().toLocaleTimeString()}] ✅ Loading complete` }]);

    setIsLoading(false);

    // Execute the actual command after loading
    const output = executeCommand(cmd);
    // Start typing animation for the response
    startResponseTyping(output);
  };

  const startResponseTyping = (lines: TerminalLine[]) => {
    if (abortRef.current) return;

    if (lines.length > 0) {
      setResponseLines(lines);
      setResponseLineIndex(0);
      setResponseCharIndex(0);
      setIsResponseTyping(true);
      // Add the first empty line for typing
      setLines(prev => [...prev, { type: lines[0].type, content: "" }]);
    }
  };

  const executeCommand = (cmd: string): TerminalLine[] => {
    const command = cmd.toLowerCase().trim();

    // Check if command is a project number
    const projectMatch = command.match(/^project\s+(\d+)$/);
    if (projectMatch) {
      const projectIndex = parseInt(projectMatch[1]) - 1;
      if (projectIndex >= 0 && projectIndex < portfolioData.projects.length) {
        setSelectedProject(portfolioData.projects[projectIndex]);
        setCurrentModalSection("project");
        setIsModalOpen(true);
        return [
          { type: "output", content: `Opening ${portfolioData.projects[projectIndex].name}...` },
        ];
      } else {
        return [
          { type: "error", content: `Project ${projectMatch[1]} not found. Use 'projects' to see available projects.` },
        ];
      }
    }

    switch (command) {
      case "help":
        return [
          { type: "output", content: "Available commands:" },
          { type: "output", content: "  about         - Learn about me" },
          { type: "output", content: "  resume        - View my resume" },
          { type: "output", content: "  projects      - View my projects" },
          { type: "output", content: "  project N     - Open project details (e.g., 'project 1')" },
          { type: "output", content: "  skills        - See my technical skills" },
          { type: "output", content: "  experience    - View my work experience" },
          { type: "output", content: "  achievements  - See my achievements and awards" },
          { type: "output", content: "  certificates  - View my certifications" },
          { type: "output", content: "  contact       - Get my contact information" },
          { type: "output", content: "  theme         - Change color theme" },
          { type: "output", content: "  toggle        - Show/Hide current window" },
          { type: "output", content: "  clear         - Clear the terminal" },
          { type: "output", content: "  help          - Show this help message" },
        ];

      case "about":
        setCurrentModalSection("about");
        setIsModalOpen(true);
        return [
          { type: "output", content: `Opening About section...` },
        ];

      case "resume":
        setCurrentModalSection("resume");
        setIsModalOpen(true);
        return [
          { type: "output", content: `Opening Resume section...` },
        ];

      case "projects":
        const projectLines: TerminalLine[] = [
          { type: "output", content: "My Projects (click to view details):" },
          { type: "output", content: "" },
        ];
        portfolioData.projects.forEach((project, index) => {
          projectLines.push(
            { type: "output", content: `${index + 1}. ${project.name}` },
            { type: "output", content: `   ${project.description}` },
            { type: "output", content: `   Tech: ${project.tech.join(", ")}` },
            { type: "output", content: `   Type 'project ${index + 1}' to open details` },
            { type: "output", content: "" }
          );
        });
        return projectLines;

      case "skills":
        setCurrentModalSection("skills");
        setIsModalOpen(true);
        return [
          { type: "output", content: `Opening Skills section...` },
        ];

      case "experience":
        setCurrentModalSection("experience");
        setIsModalOpen(true);
        return [
          { type: "output", content: `Opening Experience section...` },
        ];

      case "achievements":
        setCurrentModalSection("achievements");
        setIsModalOpen(true);
        return [
          { type: "output", content: `Opening Achievements section...` },
        ];

      case "certificates":
        setCurrentModalSection("certificates");
        setIsModalOpen(true);
        return [
          { type: "output", content: `Opening Certificates section...` },
        ];

      case "contact":
        setCurrentModalSection("contact");
        setIsModalOpen(true);
        return [
          { type: "output", content: `Opening Contact section...` },
        ];

      case "clear":
        return [];

      case "theme":
        return [
          {
            type: "output",
            content: `Available themes: ${availableThemes.join(", ")}\nUsage: theme <name>`,
          },
        ];

      case "toggle":
        if (isModalOpen) {
          setIsModalOpen(false);
          return [{ type: "output", content: "Window minimized. Type 'toggle' to restore." }];
        } else if (currentModalSection) {
          setIsModalOpen(true);
          return [{ type: "output", content: "Restoring window..." }];
        } else {
          return [{ type: "error", content: "No window to toggle. Open a section first." }];
        }

      case "":
        return [];

      default:
        if (command.startsWith("theme ")) {
          const themeName = command.split(" ")[1];
          if (availableThemes.includes(themeName as any)) {
            setTheme(themeName as any);
            return [
              { type: "output", content: `Theme switched to ${themeName}` },
            ];
          } else {
            return [
              { type: "error", content: `Theme '${themeName}' not found. Available themes: ${availableThemes.join(", ")}` },
            ];
          }
        }
        return [
          {
            type: "error",
            content: `Command not found: ${command}. Type 'help' for available commands.`,
          },
        ];
    }
  };

  const handleCommand = async (cmd: string) => {
    if (cmd.trim() === "") return;
    if (isLoading) return;
    if (isResponseTyping) return; // Don't process new commands while typing response

    const newLines: TerminalLine[] = [
      ...lines,
      { type: "input", content: `$ ${cmd}` },
    ];

    setLines(newLines);
    abortRef.current = false; // Reset abort on new command

    if (cmd.toLowerCase().trim() === "clear") {
      setLines(isTyping ?
        welcomeMessages.map(() => ({ type: "output", content: "" })) :
        []);
      // Reset response typing state
      setIsResponseTyping(false);
      setResponseLines([]);
      setResponseLineIndex(0);
      setResponseCharIndex(0);
    } else if (["about", "projects", "skills", "contact", "resume", "experience", "achievements", "certificates"].includes(cmd.toLowerCase().trim()) || cmd.toLowerCase().match(/^project\s+\d+$/)) {
      // Show loading animation for these commands
      await showLoadingAnimation(cmd);
    } else {
      const output = executeCommand(cmd);
      // Start typing animation for the response
      startResponseTyping(output);
    }

    setHistory([...history, cmd]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const lowerInput = input.toLowerCase();
      const match = ALL_COMMANDS.find(cmd => cmd.startsWith(lowerInput));
      if (match) {
        setInput(match);
      }
    } else if (e.ctrlKey && e.key === 'c') {
      // This can also be caught here if the input has focus, 
      // but the global listener handles it better when input might be disabled or focus lost.
      // However, standard terminal behavior is that Ctrl+C in input cancels the current line.
      if (!isLoading && !isTyping && !isResponseTyping) {
        e.preventDefault();
        setLines(prev => [...prev, { type: "input", content: `$ ${input}^C` }]);
        setInput("");
      }
    }
  };

  return (
    <>
      <div className="h-full flex flex-col bg-terminal-background bg-gradient-to-b from-[#0d1a2b] via-[#1f2d3d] to-[#3c4b57] rounded-2xl shadow-3xl overflow-hidden">
        {/* Window controls */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-[#0d1a2b] via-[#1f2d3d] to-[#3c4b57]  border-b border-terminal-foreground/10">
          <div className="w-3 h-3 rounded-full bg-window-close" />
          <div className="w-3 h-3 rounded-full bg-window-minimize" />
          <div className="w-3 h-3 rounded-full bg-window-maximize" />
          <span className="ml-3 text-terminal-foreground/60 text-sm font-terminal">
            AI portfolio-terminal
          </span>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="flex-1 bg-[#0B0C10] text-[#D1D5DB] overflow-y-auto p-2 md:p-4 font-terminal text-xs md:text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className={cn(
                "mb-1",
                line.type === "input" && "text-terminal-prompt font-semibold",
                line.type === "output" && "text-terminal-foreground",
                line.type === "error" && "text-destructive",
                line.type === "loading" && "text-terminal-prompt/80 animate-pulse"
              )}
            >
              {line.content}
              {/* Cursor for welcome message typing */}
              {isTyping && index === typingIndex && typingCharIndex < line.content.length && (
                <span className="ml-1 animate-pulse">|</span>
              )}
              {/* Cursor for response typing */}
              {isResponseTyping && index === lines.length - 1 && responseLineIndex < responseLines.length &&
                responseLineIndex === index - (lines.length - responseLines.length) &&
                responseCharIndex < line.content.length && (
                  <span className="ml-1 animate-pulse">|</span>
                )}
            </div>
          ))}

          {/* Input line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-terminal-prompt">$</span>
            {isTyping && (
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground animate-pulse hidden md:block">
                Press any key to skip...
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Terminal Input"
              className="flex-1 bg-transparent text-terminal-foreground outline-none caret-terminal-cursor font-terminal"
              autoFocus
              spellCheck={false}
              disabled={isLoading || isTyping || isResponseTyping}
            />
            {(!isTyping && !isResponseTyping) && (
              <span className="ml-1 animate-pulse">|</span>
            )}
          </form>
        </div>
      </div>

      {/* Project Modal */}
      {currentModalSection === "project" && (
        <ProjectModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          project={selectedProject}
        />
      )}

      {/* Section Modal for About, Skills, Contact */}
      {currentModalSection !== "project" && currentModalSection && (
        <SectionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          section={currentModalSection}
          data={portfolioData[currentModalSection as keyof typeof portfolioData]}
        />
      )}
    </>
  );
});

Terminal.displayName = "Terminal";