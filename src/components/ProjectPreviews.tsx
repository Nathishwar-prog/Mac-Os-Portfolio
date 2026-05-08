import React from "react";
import { cn } from "@/lib/utils";
import { Code2, Monitor, Database, Layout, Cpu, Globe } from "lucide-react";

interface ProjectPreviewProps {
  projectName: string;
  description: string;
  tech: string[];
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({ 
  projectName, 
  description, 
  tech 
}) => {
  // Map tech stack to icons and colors
  const getTechIcon = (techName: string) => {
    const name = techName.toLowerCase();
    if (name.includes("react") || name.includes("next")) return <Monitor className="w-4 h-4" />;
    if (name.includes("node") || name.includes("fastapi") || name.includes("flask")) return <Cpu className="w-4 h-4" />;
    if (name.includes("postgre") || name.includes("mysql") || name.includes("mongo") || name.includes("firebase")) return <Database className="w-4 h-4" />;
    if (name.includes("tailwind") || name.includes("css")) return <Layout className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const getTechColor = (techName: string) => {
    const name = techName.toLowerCase();
    if (name.includes("react")) return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
    if (name.includes("next")) return "text-white bg-white/10 border-white/20";
    if (name.includes("node")) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (name.includes("python")) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    if (name.includes("tailwind")) return "text-teal-400 bg-teal-400/10 border-teal-400/20";
    if (name.includes("firebase")) return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    return "text-purple-400 bg-purple-400/10 border-purple-400/20";
  };

  return (
    <div className="relative group w-full h-full rounded-2xl overflow-hidden bg-[#0a0f16] border border-white/5 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-white/10 flex flex-col">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`, backgroundSize: '24px 24px' }} 
      />
      
      {/* Animated Glow */}
      <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shimmer" />

      <div className="relative z-10 p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner shrink-0">
              <Code2 className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">{projectName}</h3>
          </div>
          
          <p className="text-xs text-white/40 leading-relaxed line-clamp-2 font-medium italic">
            "{description}"
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tech.slice(0, 3).map((techItem, index) => (
            <span 
              key={index}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md transition-colors",
                getTechColor(techItem)
              )}
            >
              {getTechIcon(techItem)}
              {techItem}
            </span>
          ))}
          {tech.length > 3 && (
            <span className="flex items-center px-2 py-1 rounded-lg text-[9px] font-bold text-white/40 border border-white/5 bg-white/5">
              +{tech.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 flex gap-1">
        <div className="w-1 h-1 rounded-full bg-white/20" />
        <div className="w-1 h-1 rounded-full bg-white/20" />
        <div className="w-1 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
};