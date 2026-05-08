import Achive from "@/components/Sphere";
import React from "react";
import { portfolioData } from "@/lib/portfolioData";
import {
  Star,
  Trophy,
  GitPullRequest,
  Mic,
  Users,
  Lightbulb,
  FileText,
  Award,
  Zap,
  ArrowUpRight
} from "lucide-react";

// Helper to map string icon names to Lucide components
const getIcon = (name: string) => {
  switch (name) {
    case "Star": return <Star className="w-5 h-5 text-cyan-400" />;
    case "Trophy": return <Trophy className="w-5 h-5 text-yellow-400" />;
    case "GitPullRequest": return <GitPullRequest className="w-5 h-5 text-green-400" />;
    case "Mic": return <Mic className="w-5 h-5 text-pink-400" />;
    case "Users": return <Users className="w-5 h-5 text-blue-400" />;
    case "Lightbulb": return <Lightbulb className="w-5 h-5 text-purple-400" />;
    default: return <Award className="w-5 h-5 text-cyan-400" />;
  }
};

export default function Achievements() {
  return (
    <div className="relative h-full overflow-y-auto px-4 py-20 md:px-12 bg-black text-white font-inter">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10 space-y-24">

        {/* Hero Header */}
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] font-mono text-cyan-400 uppercase">
             System.Achievements_Archive
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Recognition & Impact
          </h1>
          <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed">
            A chronicle of technical breakthroughs, community contributions, and platform milestones.
          </p>
        </header>

        {/* Central Visualization */}
        <div className="flex justify-center py-12 relative">
          <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full scale-50" />
          <div className="relative hover:scale-105 transition-transform duration-700 cursor-grab active:cursor-grabbing">
            <Achive />
          </div>
        </div>

        {/* Main Achievements Grid */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-white/10" />
             <h2 className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase">Primary Milestones</h2>
             <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.achievements.map((item, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.04]"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      {getIcon(item.icon)}
                    </div>
                    <span className="text-[10px] font-bold font-mono text-white/20">{item.date}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Verified</span>
                     <Zap className="w-3.5 h-3.5 text-yellow-500/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Research & Publications */}
        <section className="space-y-12 pt-12">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-white/10" />
             <h2 className="text-xs font-bold tracking-[0.3em] text-purple-400/40 uppercase">Research & Publications</h2>
             <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioData.publications.map((pub, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500"
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                       <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-purple-400 transition-colors" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors leading-snug">
                      {pub.title}
                    </h3>
                    <div className="text-xs font-bold text-cyan-400/60 uppercase tracking-wider">
                      {pub.publication}
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {pub.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* End Footer */}
        <footer className="py-24 text-center border-t border-white/5">
          <p className="text-[10px] font-bold font-mono text-white/10 tracking-[1em] uppercase">
            End of Recognition Log
          </p>
        </footer>

      </div>
    </div>
  );
}