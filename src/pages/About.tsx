import { portfolioData } from "@/lib/portfolioData";
import { Terminal, Cpu, Code2, Globe, Sparkles, GraduationCap, Mail, Github, Linkedin, Instagram } from "lucide-react";
import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset
    const timeout = setTimeout(() => {
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex <= text.length) {
          setDisplayedText(text.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className="font-mono min-h-[1.5em] block sm:inline">{displayedText}<span className="animate-pulse text-cyan-400">_</span></span>;
};

export const About = () => {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#050507] text-slate-300 font-inter">

      {/* Background Matrix Effect (Subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]" />

      <div className="max-w-6xl mx-auto p-6 md:p-12 relative z-10">

        {/* ---------------------------------------------------------------------------
           HEADER SECTION: Identity & Bio
           --------------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 items-center">

          {/* Profile Picture with Scanner Effect */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative group">
              {/* Spinning Rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-t-transparent animate-spin duration-[3s]" />
              <div className="absolute -inset-2 rounded-full border border-purple-500/20 border-b-transparent animate-spin duration-[5s] reverse" />

              {/* Image Container */}
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-black/50 relative z-10">
                <img
                  src="/micProfile.jpeg"
                  alt={portfolioData.about.name}
                  className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/1F2D3D/E7ECF4?text=NC';
                  }}
                />
                {/* Scanner Line Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-1/4 w-full animate-scan pointer-events-none" />
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur border border-green-500/50 text-green-400 text-xs px-3 py-1 rounded-full flex items-center gap-2 shadow-lg z-20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                ONLINE
              </div>
            </div>
          </div>

          {/* Bio Text */}
          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center gap-3 text-cyan-500 font-mono text-sm tracking-widest bg-cyan-950/30 w-fit px-3 py-1 rounded border border-cyan-800">
              <Terminal className="w-4 h-4" />
              SYSTEM_BIO_INIT
            </div>

            <h1 className="text-5xl font-black text-white tracking-tight">
              {portfolioData.about.name}
            </h1>

            <div className="h-32 md:h-24"> {/* Min height to prevent layout shift */}
              <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
                <TypewriterText text={portfolioData.about.bio.split(".")[0] + "."} delay={500} />
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {/* Quick Stats/Tags */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-colors cursor-default">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">AI Engineer</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-colors cursor-default">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="text-sm">Full Stack</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-green-500/50 transition-colors cursor-default">
                <Globe className="w-4 h-4 text-green-400" />
                <span className="text-sm">Open Source Contributor</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------------
           TECH TICKER: Infinite Scroll
           --------------------------------------------------------------------------- */}
        <div className="w-full overflow-hidden bg-white/5 border-y border-white/5 py-4 mb-20 relative">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050507] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050507] to-transparent z-10" />

          <div className="flex w-[200%] animate-ticker hover:pause-animation">
            {[...Object.values(portfolioData.skills).flat(), ...Object.values(portfolioData.skills).flat()].map((skill, i) => (
              <span key={i} className="mx-8 text-slate-500 font-mono text-sm whitespace-nowrap hover:text-cyan-400 transition-colors cursor-crosshair">
                {skill}
              </span>
            ))}
          </div>
        </div>


        {/* ---------------------------------------------------------------------------
           TIMELINE: Education
           --------------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

          {/* Timeline Column */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-purple-400" />
              Academic Timeline
            </h2>

            <div className="relative pl-8 border-l border-white/10 space-y-12">
              {/* Current degree */}
              <div className="relative group">
                <div className="absolute -left-[37px] w-4 h-4 rounded-full bg-purple-500 border-4 border-[#050507] group-hover:scale-125 transition-transform" />
                <div className="bg-[#0D1A2B] p-6 rounded-xl border border-white/10 relative hover:-translate-y-1 transition-transform hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                  <div className="absolute -left-2 top-6 w-2 h-2 bg-[#0D1A2B] rotate-45 border-l border-b border-white/10" />
                  <div className="text-xs text-purple-400 font-mono mb-1">2023 - Present</div>
                  <h3 className="text-lg font-bold text-white mb-1">B.Tech AI & Data Science</h3>
                  <p className="text-slate-400 text-sm">Dhanalakshmi Srinivasan Engineering College</p>
                  <div className="mt-3 px-3 py-1 bg-purple-500/10 text-purple-300 rounded text-xs w-fit">
                    CGPA: 9.0 (Current)
                  </div>
                </div>
              </div>

              {/* Previous */}
              <div className="relative group opacity-70 hover:opacity-100 transition-opacity">
                <div className="absolute -left-[37px] w-4 h-4 rounded-full bg-slate-600 border-4 border-[#050507]" />
                <div className="bg-[#121214] p-6 rounded-xl border border-white/5 relative">
                  <div className="text-xs text-slate-500 font-mono mb-1">2021 - 2023</div>
                  <h3 className="text-lg font-bold text-slate-200 mb-1">Bio Mathematics</h3>
                  <p className="text-slate-500 text-sm">Marutham Matric Hr. Sec. School</p>
                  <div className="mt-3 px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs w-fit">
                    Grade: 89.8%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interests / "Download" Grid */}
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Core Interests
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "AI & ML", desc: "Building intelligent agents", color: "bg-cyan-500" },
                { label: "Web Development", desc: "Building websites", color: "bg-blue-500" },
                { label: "Vibe Coding", desc: "Flow state programming", color: "bg-purple-500" },
                { label: "Open Source", desc: "Community contributions", color: "bg-green-500" },
                { label: "Futurism", desc: "Next-gen tech research", color: "bg-pink-500" }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors group">
                  <div className={`w-8 h-1 mb-3 rounded-full ${item.color} group-hover:w-16 transition-[width] duration-300`} />
                  <h3 className="font-bold text-slate-200">{item.label}</h3>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Contact Mini-Card */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-white/10">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Connect Protocol
              </h3>
              <div className="flex gap-4">
                <a href={`https://${portfolioData.contact.github}`} className="p-2 rounded-lg bg-black/40 hover:text-white text-slate-400 hover:bg-black/60 transition-all"><Github className="w-5 h-5" /></a>
                <a href={`https://${portfolioData.contact.linkedin}`} className="p-2 rounded-lg bg-black/40 hover:text-blue-400 text-slate-400 hover:bg-black/60 transition-all"><Linkedin className="w-5 h-5" /></a>
                <a href={`https://${portfolioData.contact.instagram}`} className="p-2 rounded-lg bg-black/40 hover:text-pink-400 text-slate-400 hover:bg-black/60 transition-all"><Instagram className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

        </div>

        {/* Global Keyframes within component (styled-jsx equivalent) */}
        <style>{`
           @keyframes scan {
              0% { top: 0%; opacity: 0; }
              50% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
           }
           .animate-scan {
              animation: scan 3s linear infinite;
           }
           @keyframes ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
           }
           .animate-ticker {
              animation: ticker 40s linear infinite;
           }
           /* Pause animation on hover */
           .hover\:pause-animation:hover {
              animation-play-state: paused;
           }
        `}</style>
      </div>
    </div>
  );
};