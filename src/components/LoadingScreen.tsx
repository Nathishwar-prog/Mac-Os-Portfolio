import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const TypewriterText = ({ text, onComplete, delay = 50, className = "" }: { text: string, onComplete?: () => void, delay?: number, className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay, onComplete]);

  return <span className={className}>{displayedText}<span className="animate-pulse">|</span></span>;
};

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [phase, setPhase] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (phase === 1) {
      const timer = setTimeout(() => setPhase(2), 1500);
      return () => clearTimeout(timer);
    }
    if (phase === 4) {
      const timer = setTimeout(() => setPhase(5), 1000); // Wait for text fade out
      return () => clearTimeout(timer);
    }
    if (phase === 5) {
      setIsFadingOut(true);
      const timer = setTimeout(onComplete, 1200); // Wait for background fade out
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className={`fixed inset-0 bg-[#050a14] flex flex-col items-center justify-center p-4 z-[100] font-mono overflow-hidden text-cyan-400 text-2xl md:text-4xl text-center transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none z-[120] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none z-[110] animate-scanline bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[100px] w-full" />
      
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center justify-center min-h-[200px]">
        {phase <= 1 && (
          <div className={`transition-all duration-1000 ease-in-out ${phase === 1 ? 'opacity-0 blur-md scale-110 pointer-events-none' : 'animate-in fade-in zoom-in duration-500 opacity-100'}`}>
            <TypewriterText text="Hey buddy" onComplete={phase === 0 ? () => setTimeout(() => setPhase(1), 500) : undefined} />
          </div>
        )}
        
        {phase === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <TypewriterText text="I'm Nathishwar" onComplete={() => setTimeout(() => setPhase(3), 800)} />
          </div>
        )}
        
        {phase >= 3 && (
          <div className={`flex flex-col items-center gap-6 transition-all duration-1000 ease-in-out ${phase >= 4 ? 'opacity-0 blur-md scale-105 pointer-events-none' : 'opacity-100'}`}>
            <div className="text-2xl md:text-4xl text-emerald-400 font-bold">I'm Nathishwar</div>
            <div className="text-xl md:text-3xl leading-relaxed max-w-3xl text-cyan-100 mt-4">
              {phase === 3 ? (
                <TypewriterText 
                  text="So glad you stopped by! Take a look around, explore my work, and get to know the developer behind the code." 
                  delay={35}
                  onComplete={() => setTimeout(() => setPhase(4), 1500)} 
                />
              ) : (
                <span>So glad you stopped by! Take a look around, explore my work, and get to know the developer behind the code.<span className="animate-pulse">|</span></span>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes sparkle {
          0% { transform: translate(0, 0) scale(1.5); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};