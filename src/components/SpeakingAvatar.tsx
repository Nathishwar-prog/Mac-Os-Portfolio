import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { SplineScene } from "./ui/splite";
import {
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bot,
  RefreshCw,
  Info
} from "lucide-react";

interface TourStep {
  section: string;
  title: string;
  subtitle: string;
  speechText: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    section: "home",
    title: "About Me & Summary",
    subtitle: "Nathishwar - AI Powered Full Stack Developer",
    speechText: "Hello and welcome! I am Nathishwar, an AI-powered Full Stack Developer and open-source builder. I create intelligent software ecosystems that combine modern web engineering with advanced AI automation. I am the author of PywhatKit-alt, Quick Invoice, and Ruixen AI. I also founded KnowGrow and created Codex, a real-time collaborative coding editor. Welcome to my macOS-themed portfolio! Let me guide you through it visually. Click Next to begin the tour."
  },
  {
    section: "about",
    title: "About My Journey",
    subtitle: "B.Tech in Artificial Intelligence & Data Science",
    speechText: "We are now opening the About app. Here, you can learn about my background. I am pursuing my B.Tech in Artificial Intelligence and Data Science. I specialize in Next.js, Node.js, Python, and LangChain, and I love building intelligent agents that automate complex workflows."
  },
  {
    section: "projects",
    title: "Featured Projects",
    subtitle: "Exploring creative engineering.",
    speechText: "Next, let's explore my Projects. I have built fully-featured applications like Gen AI-Tutor, Codex, and an AI-driven Spaced Repetition Revision Tool. You can view demo photos, read code snippets, or check the GitHub repositories directly."
  },
  {
    section: "skills",
    title: "My Skills Orb",
    subtitle: "Interactive 3D skills visualization.",
    speechText: "This is my Skills page, visualised as a 3D orbit system. You can spin the rings and hover over icons to see my stack in Frontend, Backend, Databases, AI and Machine Learning, and DevOps tools."
  },
  {
    section: "experience",
    title: "Professional Experience",
    subtitle: "Work experience and internships.",
    speechText: "Here is my Experience timeline, showcasing my journey through internships in AI and Full Stack development, where I've built microservices and optimized model deployments, including a virtual internship with Google."
  },
  {
    section: "achievements",
    title: "Achievements & Credentials",
    subtitle: "Honors and professional credentials.",
    speechText: "Lastly, let's view my Achievements and Certificates. Here you can check my credentials from Google, HackerRank, and ICT Academy, validating my problem-solving skills and academic growth."
  },
  {
    section: "home",
    title: "Visual Tour Completed",
    subtitle: "Explore on your own!",
    speechText: "We are back on the Home desktop. Feel free to run commands in the Terminal, browse other files in the Dock, or ask my chatbot any questions. Thanks for visiting, and enjoy exploring!"
  }
];

interface SpeakingAvatarProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
  isLoading: boolean;
  hideTrigger?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface SpeakingAvatarHandle {
  startTour: () => void;
}

export const SpeakingAvatar = forwardRef<SpeakingAvatarHandle, SpeakingAvatarProps>(({
  onSectionChange,
  activeSection,
  isLoading,
  hideTrigger,
  onOpenChange
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [subtitleWords, setSubtitleWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [showHelperBubble, setShowHelperBubble] = useState(true);

  useImperativeHandle(ref, () => ({
    startTour() {
      startTour();
    }
  }));

  // Monitor viewport size for responsive coordinates
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  // Keep ref of props to make them stable and prevent double-trigger loops
  const onSectionChangeRef = useRef(onSectionChange);
  useEffect(() => {
    onSectionChangeRef.current = onSectionChange;
  }, [onSectionChange]);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Spline refs and rotations mapping
  const splineAppRef = useRef<any>(null);
  const originalRotationsRef = useRef<{
    head: { x: number; y: number; z: number } | null;
    armL: { x: number; y: number; z: number } | null;
    armR: { x: number; y: number; z: number } | null;
    handL: { x: number; y: number; z: number } | null;
    handR: { x: number; y: number; z: number } | null;
  }>({ head: null, armL: null, armR: null, handL: null, handR: null });

  const isSpeakingRef = useRef(isSpeaking);
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  const handleSplineLoad = useCallback((splineApp: any) => {
    splineAppRef.current = splineApp;
  }, []);

  // Animating the Spline robot limbs programmatically
  useEffect(() => {
    if (!isOpen) return;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      const splineApp = splineAppRef.current;
      const original = originalRotationsRef.current;

      if (splineApp) {
        let headObj: any = null;
        let armL: any = null;
        let armR: any = null;
        let handL: any = null;
        let handR: any = null;

        // Traverse children to find object references dynamically
        if (splineApp.scene) {
          splineApp.scene.traverse((child: any) => {
            const name = child.name ? child.name.toLowerCase() : "";
            if (name.includes("head")) headObj = child;
            else if (name.includes("arm_l") || (name.includes("arm") && name.includes("l")) || name.includes("leftarm") || name.includes("left_arm")) armL = child;
            else if (name.includes("arm_r") || (name.includes("arm") && name.includes("r")) || name.includes("rightarm") || name.includes("right_arm")) armR = child;
            else if (name.includes("hand_l") || (name.includes("hand") && name.includes("l")) || name.includes("lefthand") || name.includes("left_hand")) handL = child;
            else if (name.includes("hand_r") || (name.includes("hand") && name.includes("r")) || name.includes("righthand") || name.includes("right_hand")) handR = child;
          });
        }

        // Direct name fallbacks
        if (!headObj) headObj = splineApp.findObjectByName("Head") || splineApp.findObjectByName("head");
        if (!armL) armL = splineApp.findObjectByName("Arm_L") || splineApp.findObjectByName("Arm_Left") || splineApp.findObjectByName("Left_Arm") || splineApp.findObjectByName("LeftArm");
        if (!armR) armR = splineApp.findObjectByName("Arm_R") || splineApp.findObjectByName("Arm_Right") || splineApp.findObjectByName("Right_Arm") || splineApp.findObjectByName("RightArm");
        if (!handL) handL = splineApp.findObjectByName("Hand_L") || splineApp.findObjectByName("Left_Hand") || splineApp.findObjectByName("LeftHand");
        if (!handR) handR = splineApp.findObjectByName("Hand_R") || splineApp.findObjectByName("Right_Hand") || splineApp.findObjectByName("RightHand");

        // Keep track of the original default keyframe rotations to overlay oscillations on
        if (headObj && !original.head) original.head = { x: headObj.rotation.x, y: headObj.rotation.y, z: headObj.rotation.z };
        if (armL && !original.armL) original.armL = { x: armL.rotation.x, y: armL.rotation.y, z: armL.rotation.z };
        if (armR && !original.armR) original.armR = { x: armR.rotation.x, y: armR.rotation.y, z: armR.rotation.z };
        if (handL && !original.handL) original.handL = { x: handL.rotation.x, y: handL.rotation.y, z: handL.rotation.z };
        if (handR && !original.handR) original.handR = { x: handR.rotation.x, y: handR.rotation.y, z: handR.rotation.z };

        const activeSpeaking = isSpeakingRef.current;

        if (activeSpeaking) {
          // Speak state movements
          if (headObj && original.head) {
            headObj.rotation.y = original.head.y + Math.sin(time * 3.5) * 0.08;
            headObj.rotation.x = original.head.x + Math.cos(time * 2.5) * 0.04;
          }
          if (armL && original.armL) {
            armL.rotation.z = original.armL.z + Math.sin(time * 2.0) * 0.15 - 0.2;
            armL.rotation.x = original.armL.x + Math.cos(time * 1.5) * 0.1;
          }
          if (armR && original.armR) {
            armR.rotation.z = original.armR.z - Math.cos(time * 1.8) * 0.15 + 0.2;
            armR.rotation.x = original.armR.x + Math.sin(time * 1.6) * 0.1;
          }
          if (handL && original.handL) {
            handL.rotation.y = original.handL.y + Math.sin(time * 4.0) * 0.2;
          }
          if (handR && original.handR) {
            handR.rotation.y = original.handR.y + Math.cos(time * 3.8) * 0.2;
          }
        } else {
          // Idle state soft breathing
          if (headObj && original.head) {
            headObj.rotation.y = original.head.y + Math.sin(time * 1.2) * 0.03;
            headObj.rotation.x = original.head.x + Math.cos(time * 0.8) * 0.015;
          }
          if (armL && original.armL) {
            armL.rotation.z = original.armL.z + Math.sin(time * 0.8) * 0.03;
            armL.rotation.x = original.armL.x;
          }
          if (armR && original.armR) {
            armR.rotation.z = original.armR.z - Math.sin(time * 0.8) * 0.03;
            armR.rotation.x = original.armR.x;
          }
          if (handL && original.handL) {
            handL.rotation.y = original.handL.y;
          }
          if (handR && original.handR) {
            handR.rotation.y = original.handR.y;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  // Pre-load and cancel any speech synthesis queues immediately on mount for low latency
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Window resize tracker
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide the helper bubble
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelperBubble(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Speech Synthesis Controller
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
  }, []);

  const speak = useCallback(
    (text: string) => {
      stopSpeaking();

      const words = text.split(" ");
      setSubtitleWords(words);
      setCurrentWordIndex(-1);
      setIsSpeaking(true);

      // Recursive timeout loop for dynamic pacing based on word length
      let fallbackIndex = 0;
      const scheduleNextWord = () => {
        if (fallbackIndex < words.length) {
          setCurrentWordIndex(fallbackIndex);
          const currentWord = words[fallbackIndex] || "";
          // Dynamic timing: longer words get more time, short words are faster
          const delay = Math.max(160, currentWord.length * 60 + 110);
          fallbackIndex++;
          fallbackTimerRef.current = window.setTimeout(scheduleNextWord, delay);
        } else {
          stopSpeaking();
        }
      };

      if (isMutedRef.current) {
        fallbackTimerRef.current = window.setTimeout(scheduleNextWord, 50);
        return;
      }

      if ("speechSynthesis" in window) {
        // Function to perform speaking once voices are loaded
        const speakWithVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length === 0) return false;

          const utterance = new SpeechSynthesisUtterance(text);
          utteranceRef.current = utterance;

          const getNaturalMaleVoice = () => {
            const engVoices = voices.filter((v) => v.lang.startsWith("en"));
            
            // Extensive list of male voice keywords ranked by natural quality
            const maleKeywords = [
              "guy", "ryan", "thomas", "andrew", "brian", "oliver", "mitch", 
              "david", "george", "daniel", "aaron", "gordon", "arthur", "mark", 
              "james", "richard", "paul", "steven", "john", "male"
            ];
            const naturalKeywords = ["online", "natural", "google"];

            // 1. Natural Online Male voice
            let voice = engVoices.find((v) => {
              const name = v.name.toLowerCase();
              return maleKeywords.some((k) => name.includes(k)) && naturalKeywords.some((k) => name.includes(k));
            });
            if (voice) return voice;

            // 2. Standard Male voice
            voice = engVoices.find((v) => {
              const name = v.name.toLowerCase();
              return maleKeywords.some((k) => name.includes(k));
            });
            if (voice) return voice;

            // 3. Natural/Online Voice (any gender fallback)
            voice = engVoices.find((v) => {
              const name = v.name.toLowerCase();
              return naturalKeywords.some((k) => name.includes(k));
            });
            if (voice) return voice;

            // 4. Standard English Voice
            return engVoices[0] || voices[0];
          };

          const selectedVoice = getNaturalMaleVoice();
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log("Selected voice for SpeakingAvatar:", selectedVoice.name);
          }

          utterance.rate = 1.0; // Dynamic, clear natural speaking pace
          utterance.pitch = 0.95; // Slightly deeper, male tone

          utterance.onboundary = (event) => {
            if (event.name === "word") {
              const charIndex = event.charIndex;
              let currentLength = 0;
              let wordIdx = 0;

              for (let i = 0; i < words.length; i++) {
                currentLength += words[i].length + 1;
                if (currentLength > charIndex) {
                  wordIdx = i;
                  break;
                }
              }
              setCurrentWordIndex(wordIdx);
              
              if (fallbackTimerRef.current) {
                clearTimeout(fallbackTimerRef.current);
                fallbackTimerRef.current = null;
              }
            }
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            setCurrentWordIndex(-1);
          };

          utterance.onerror = () => {
            setIsSpeaking(false);
            setCurrentWordIndex(-1);
          };

          window.speechSynthesis.speak(utterance);
          
          // Start the dynamic visualizer typewriter fallback
          fallbackTimerRef.current = window.setTimeout(scheduleNextWord, 50);
          return true;
        };

        const success = speakWithVoice();
        
        // If voices aren't loaded yet, register listener
        if (!success) {
          window.speechSynthesis.onvoiceschanged = () => {
            speakWithVoice();
            // Clear listener to avoid multiple triggers on future voice list changes
            window.speechSynthesis.onvoiceschanged = null;
          };
        }
      } else {
        fallbackTimerRef.current = window.setTimeout(scheduleNextWord, 50);
      }
    },
    []
  );

  // Trigger speech on step changes
  useEffect(() => {
    if (isTourActive) {
      const step = TOUR_STEPS[currentStep];
      onSectionChangeRef.current(step.section);

      // Low latency call - trigger speak immediately with very small delay (80ms)
      // so it aligns perfectly with the visual transition swap
      const timer = setTimeout(() => {
        speak(step.speechText);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isTourActive, speak]);

  // Auto start tour once index finishes loading
  useEffect(() => {
    if (!isLoading && !isTourActive) {
      const startTimer = setTimeout(() => {
        startTour();
      }, 1500); // 1.5s after load completes to let initial fade screens pass
      return () => clearTimeout(startTimer);
    }
  }, [isLoading]);

  // Tour management functions
  const startTour = () => {
    setIsTourActive(true);
    setCurrentStep(0);
    setIsOpen(true);
    onOpenChange?.(true);
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const endTour = () => {
    stopSpeaking();
    setIsTourActive(false);
    onSectionChange("home");
    setIsOpen(false);
    onOpenChange?.(false);
  };



  // Compute smooth transitions style
  const isCentered = isTourActive && currentStep === 0;

  const getContainerStyle = (): React.CSSProperties => {
    if (!isOpen) return { display: "none" };

    const isMobile = windowSize.width < 768;

    if (isCentered) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "460px",
        height: isMobile ? "440px" : "510px",
        zIndex: 100,
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      };
    } else {
      if (isMobile) {
        return {
          position: "fixed",
          top: "calc(100vh - 490px)",
          left: "calc(50vw - 160px)",
          transform: "translate(0, 0)",
          width: "320px",
          height: "410px",
          zIndex: 100,
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
        };
      } else {
        return {
          position: "fixed",
          top: "calc(100vh - 435px)",
          left: "calc(100vw - 340px)",
          transform: "translate(0, 0)",
          width: "320px",
          height: "410px",
          zIndex: 100,
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
        };
      }
    }
  };

  return (
    <>
      {/* Neural Core styles for rotating orbits */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customOrbSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .orb-spinning-ring {
          animation: customOrbSpin 10s linear infinite;
        }
      `}} />

      {/* Centered screen background blur overlay & Dark space backdrop */}
      {isOpen && isCentered && (
        <div
          onClick={endTour}
          className="fixed inset-0 bg-[#020617]/95 z-[90] transition-opacity duration-700 opacity-100 overflow-hidden pointer-events-auto flex items-center justify-center"
        >
          {/* Subtle background space glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.08)_0%,transparent_70%)] pointer-events-none"></div>
        </div>
      )}

      {/* Floating Orb Activator (Bottom Right Holographic Core style trigger) */}
      {!hideTrigger && (
        <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end">
          {/* Helper text - Cyber style notification card */}
          {showHelperBubble && !isOpen && (
            <div className="bg-[#020617] text-white/80 text-[11px] px-3.5 py-2.5 rounded-2xl mb-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#0066ff]/20 backdrop-blur-md max-w-[200px] animate-bounce duration-1000 flex items-start gap-2.5">
              <Info size={14} className="shrink-0 mt-0.5 text-[#0066ff]" />
              <div>
                <p className="font-semibold text-white">AI Robot Guide</p>
                <p className="text-[10px] text-white/60 mt-0.5">Click to activate the interactive 3D robot tour.</p>
              </div>
            </div>
          )}

          {/* Floating Bubble button - Atom-like spinning trigger */}
          {!isOpen && (
            <button
              onClick={startTour}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 relative group overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            >
              {/* Spinning gradient border */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0066ff] via-[#7c3aed] to-[#ec4899] orb-spinning-ring opacity-80 group-hover:opacity-100 transition-opacity"></div>
              {/* Dark core */}
              <div className="absolute inset-[2.5px] bg-[#020617] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#0066ff] relative z-10 animate-pulse" />
              </div>
              {/* Outer soft glow ring */}
              <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
              {/* Animated ping glow overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0066ff]/20 to-[#7c3aed]/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          )}
        </div>
      )}

      {/* Dynamic Floating widget container */}
      {isOpen && (
        <div
          ref={containerRef}
          style={{
            ...getContainerStyle(),
            background: "radial-gradient(circle at center, #0f172a 0%, #020617 70%, #000000 100%)"
          }}
          className="rounded-3xl border border-[#0066ff]/25 shadow-[0_30px_90px_rgba(0,0,0,0.8)] flex flex-col p-4 overflow-hidden relative z-[95] animate-fade-in"
        >
          {/* Top floating Close button */}
          <button
            onClick={endTour}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 z-30"
            title="Close Assistant"
          >
            <X size={16} />
          </button>

          {/* Energy Core Stage */}
          <div 
            className="relative flex justify-center items-center overflow-hidden shrink-0 mt-6"
            style={{ height: isCentered ? (windowSize.width < 768 ? "200px" : "260px") : "160px" }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full relative z-10"
              onLoad={handleSplineLoad}
            />
          </div>

          {/* Subtitles Area - ChatGPT style progressive text highlighting */}
          <div className="px-6 py-4 flex flex-col justify-center flex-1 overflow-y-auto custom-scrollbar text-center">
            {isTourActive ? (
              <div className="animate-fade-in">
                <h4 className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest mb-2">
                  {TOUR_STEPS[currentStep].title}
                </h4>
                <p className="text-[13px] md:text-[14px] font-medium leading-relaxed text-white/95">
                  {subtitleWords.map((word, index) => {
                    const isSpoken = index < currentWordIndex;
                    const isCurrent = index === currentWordIndex;
                    
                    let wordClass = "transition-all duration-200 mr-1.5 inline-block ";
                    if (isSpoken) {
                      wordClass += "text-white font-medium";
                    } else if (isCurrent) {
                      wordClass += "text-transparent bg-clip-text bg-gradient-to-r from-[#0066ff] to-[#7c3aed] font-bold scale-105 drop-shadow-[0_0_8px_rgba(0,102,255,0.5)]";
                    } else {
                      wordClass += "text-white/20";
                    }

                    return (
                      <span key={index} className={wordClass}>
                        {word}
                      </span>
                    );
                  })}
                </p>
              </div>
            ) : (
              <div className="text-center text-white/30 text-xs py-4 flex flex-col items-center justify-center animate-fade-in">
                <Sparkles size={24} className="mb-2 text-[#0066ff]/50 animate-pulse" />
                <p className="font-medium text-white/50">Core Initialized</p>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="px-5 py-4 bg-transparent flex justify-between items-center shrink-0 mt-auto">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (nextMute) {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                } else if (isTourActive) {
                  speak(TOUR_STEPS[currentStep].speechText);
                }
              }}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isMuted
                  ? "bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/30"
                  : "bg-white/5 hover:bg-white/10 text-white border border-[#0066ff]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              }`}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Steps Pill */}
            {isTourActive && (
              <div className="bg-white/5 px-3.5 py-1.5 rounded-full border border-[#0066ff]/20 shadow-sm shrink-0">
                <span className="text-[10px] font-semibold text-white/50 tracking-wider whitespace-nowrap">
                  Step {currentStep + 1} of {TOUR_STEPS.length}
                </span>
              </div>
            )}

            {/* Tour Controls */}
            {isTourActive ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="w-9 h-9 rounded-full bg-white/5 border border-[#0066ff]/20 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={endTour}
                  className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 text-[11px] font-medium transition-all cursor-pointer"
                >
                  End
                </button>

                {currentStep < TOUR_STEPS.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="h-9 px-4 rounded-full bg-gradient-to-r from-[#0066ff] to-[#7c3aed] text-white font-semibold hover:brightness-110 shadow-[0_2px_10px_rgba(0,102,255,0.3)] transition-all flex items-center gap-1 cursor-pointer text-xs active:scale-95"
                    title="Next Step"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={endTour}
                    className="h-9 px-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:brightness-110 shadow-[0_2px_10px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center cursor-pointer text-xs active:scale-95 animate-pulse"
                    title="Finish"
                  >
                    Finish
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={startTour}
                className="h-9 px-4 rounded-full bg-gradient-to-r from-[#0066ff] to-[#7c3aed] text-white font-semibold hover:brightness-110 shadow-[0_2px_10px_rgba(0,102,255,0.3)] transition-all flex items-center gap-1.5 cursor-pointer text-xs uppercase tracking-wide active:scale-95"
              >
                <RefreshCw size={12} className="animate-spin" />
                <span>Start Tour</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
});
