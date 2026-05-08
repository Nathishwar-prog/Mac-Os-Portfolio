import React, { useEffect, useMemo, useRef, useState } from "react";
import { portfolioData } from "@/lib/portfolioData";

type ColorKey = "cyan" | "blue" | "violet" | "emerald" | "amber" | "rose";
type Status = "current" | "resigned" | "completed";

interface Milestone {
  role: string;
  company: string;
  date: string;
  description: string;
  achievements: string[];
  color: ColorKey;
  status: Status;
  t: number;
  rightSide?: boolean;
}

// Use data from portfolioData
const MILESTONES = portfolioData.workExperience as unknown as Milestone[];

const TW = {
  cyan: {
    text: "text-cyan-400",
    border: "border-cyan-400/40",
    pin: "bg-cyan-400",
  },
  blue: {
    text: "text-blue-400",
    border: "border-blue-400/40",
    pin: "bg-blue-400",
  },
  violet: {
    text: "text-purple-400",
    border: "border-purple-400/40",
    pin: "bg-purple-400",
  },
  emerald: {
    text: "text-emerald-400",
    border: "border-emerald-400/40",
    pin: "bg-emerald-400",
  },
  amber: {
    text: "text-amber-400",
    border: "border-amber-400/40",
    pin: "bg-amber-400",
  },
  rose: {
    text: "text-rose-400",
    border: "border-rose-400/40",
    pin: "bg-rose-400",
  },
} as const;

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" />
  </svg>
);

const Badge = ({ status }: { status: Status }) => {
  if (status === "current")
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500 text-white">
        CURRENT
      </span>
    );
  if (status === "resigned")
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-600 text-white">
        RESIGNED
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-sky-600 text-white">
      COMPLETED
    </span>
  );
};

const Pin = ({ color }: { color: ColorKey }) => (
  <div className="relative w-11 h-11">
    <div className={`absolute inset-0 rounded-full ${TW[color].pin} opacity-60 animate-ping`} />
    <div
      className={`relative w-full h-full rounded-full ${TW[color].pin} border-4 border-white dark:border-slate-900 p-2 shadow-xl`}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full text-white">
        <path d="M12 2.25a6.75 6.75 0 016.75 6.75c0 4.253-3.02 7.64-6.27 10.278a1.75 1.75 0 01-2.46 0C8.27 16.64 5.25 13.253 5.25 9A6.75 6.75 0 0112 2.25zm0 9a2.25 2.25 0 100-4.5A2.25 2.25 0 0012 11.25z" />
      </svg>
    </div>
  </div>
);

const Car = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="currentColor">
    <path d="M12 36l4-10c1-3 4-6 7-6h18c3 0 6 3 7 6l4 10h2a4 4 0 014 4v6a4 4 0 01-4 4h-2a5 5 0 01-10 0H24a5 5 0 01-10 0h-2a4 4 0 01-4-4v-6a4 4 0 014-4h2zM22 28h20l-2-4H24l-2 4z" />
  </svg>
);

export default function ExperienceTimelinePro() {
  const [hovered, setHovered] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLen, setPathLen] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const threeCleanupRef = useRef<(() => void) | null>(null);

  const [carT, setCarT] = useState(0);
  const [car2T, setCar2T] = useState(0.05);

  const viewWidth = 1200;
  const viewHeight = 780;

  const d =
    "M 110 200 C 250 90 330 310 450 240 S 700 150 760 260 S 590 470 460 420 S 540 320 720 360 S 1010 500 890 565 S 720 640 780 700 S 960 760 1080 710";

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, []);

  const points = useMemo(() => {
    if (!pathRef.current || !pathLen) return [];
    return MILESTONES.map(m => {
      const p = pathRef.current!.getPointAtLength(Math.max(0, Math.min(1, m.t)) * pathLen);
      return { x: p.x, y: p.y };
    });
  }, [pathLen]);

  const getPosAndAngle = (t: number) => {
    if (!pathRef.current || !pathLen) return { x: 0, y: 0, angle: 0 };
    const len = t * pathLen;
    const p = pathRef.current.getPointAtLength(len);
    const ahead = pathRef.current.getPointAtLength(Math.min(pathLen, len + 1));
    const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x);
    return { x: p.x, y: p.y, angle };
  };

  const carPos = getPosAndAngle(carT);
  const car2Pos = getPosAndAngle(car2T);

  // enhanced car motion
  useEffect(() => {
    let raf = 0;
    const stops = MILESTONES.map(m => m.t);
    let index = 0;
    let progress = 0;
    const duration = 2.5;

    // Define the loop function with proper typing
    const loop: FrameRequestCallback & { last?: number } = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!loop.last) loop.last = now;

      const dt = (now - loop.last) / 1000;
      loop.last = now;

      progress += dt / duration;

      if (progress >= 1) {
        progress = 0;
        index = (index + 1) % (stops.length - 1);
      }

      const start = stops[index];
      const end = stops[index + 1];
      const t = start + (end - start) * progress;

      setCarT(t);
      setCar2T((t + 0.05) % 1);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const clampCard = (x: number, y: number, opts: { rightSide?: boolean; cardW?: number; cardH?: number } = {}) => {
    const cardW = opts.cardW ?? 360;
    const cardH = opts.cardH ?? 230;
    const margin = 16;

    let left = x + (opts.rightSide ? 24 : -24 - cardW);
    let top = y - cardH / 2;

    left = Math.max(margin, Math.min(viewWidth - margin - cardW, left));
    top = Math.max(margin, Math.min(viewHeight - margin - cardH, top));

    return { left, top, width: cardW, height: cardH };
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0b0c10] text-white p-3 md:p-10 font-inter">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center">My Carrier Journey</h1>
        <p className="text-slate-400 text-center mb-8">My journey in the world of technology and my career milestones.</p>

        <div className="relative mx-auto hidden md:block rounded-2xl overflow-hidden" style={{ height: viewHeight }}>
          <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="absolute inset-0 w-full h-full">
            <rect width={viewWidth} height={viewHeight} fill="#0a0b0f" />
            <path ref={pathRef} d={d} fill="none" stroke="none" />
          </svg>

          <div
            className="absolute z-40"
            style={{
              left: carPos.x,
              top: carPos.y,
              transform: `translate(-50%, -50%) rotate(${(carPos.angle * 180) / Math.PI}deg)`,
            }}>
            <Car className="w-7 h-7 text-cyan-300" />
          </div>

          <div
            className="absolute z-30 opacity-80"
            style={{
              left: car2Pos.x,
              top: car2Pos.y,
              transform: `translate(-50%, -50%) rotate(${(car2Pos.angle * 180) / Math.PI}deg)`,
            }}>
            <Car className="w-6 h-6 text-fuchsia-300" />
          </div>

          {MILESTONES.map((m, i) => {
            const p = points[i] ?? { x: 0, y: 0 };
            const tw = TW[m.color];
            const { left, top, width, height } = clampCard(p.x, p.y, { rightSide: m.rightSide });

            return (
              <div key={i}>
                <div
                  className={`absolute ${hovered === i ? "z-50" : "z-30"}`}
                  style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}>
                  <Pin color={m.color} />
                </div>

                <div
                  className={`absolute px-3 py-2 rounded-lg bg-black/55 backdrop-blur-sm border ${tw.border} ${hovered === i ? "z-50" : "z-20"}`}
                  style={{
                    left: m.rightSide ? p.x + 26 : p.x - 26,
                    top: p.y - 36,
                    transform: m.rightSide ? "translateX(0)" : "translateX(-100%)",
                    maxWidth: 260,
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${tw.text}`}>{m.role}</span>
                    <Badge status={m.status} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.date}</p>
                </div>

                <div
                  className={`absolute rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl p-6 transition-all duration-500 ${hovered === i ? "opacity-100 scale-100 z-50 translate-y-0" : "opacity-0 scale-95 z-10 pointer-events-none translate-y-4"}`}
                  style={{ left, top, width, height }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{m.role}</h3>
                      <p className="text-blue-400/80 text-sm font-semibold tracking-wide uppercase">{m.company}</p>
                    </div>
                    <Badge status={m.status} />
                  </div>

                  <p className="text-white/40 text-sm mt-4 leading-relaxed line-clamp-2 italic italic font-medium">"{m.description}"</p>

                  <div className="mt-6 space-y-3">
                    <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Key Contributions</h4>
                    <ul className="space-y-2.5">
                      {m.achievements.map((a, idx) => (
                        <li key={idx} className="flex items-start text-xs text-white/60 group/item">
                          <CheckIcon className="w-3.5 h-3.5 mr-3 mt-0.5 text-blue-500/50 group-hover/item:text-blue-400 transition-colors" />
                          <span className="leading-relaxed">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="md:hidden space-y-5 mt-6">
          {MILESTONES.map((m, i) => {
            const tw = TW[m.color];
            return (
              <div key={i} className={`p-5 rounded-xl bg-slate-900/60 border ${tw.border}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-xs font-semibold ${tw.text}`}>{m.date}</p>
                    <h3 className="text-lg font-bold mt-1">{m.role}</h3>
                    <p className="text-slate-300 text-sm">{m.company}</p>
                  </div>
                  <Badge status={m.status} />
                </div>
                <p className="text-slate-400 text-sm mt-3">{m.description}</p>
                <ul className="mt-3 space-y-2">
                  {m.achievements.map((a, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-200">
                      <CheckIcon className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}