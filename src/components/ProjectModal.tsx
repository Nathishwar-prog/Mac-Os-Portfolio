import { useState, useEffect } from "react";
import { X, Minus, Maximize2, Minimize2, ExternalLink, Github, Code2, Rocket, Lightbulb, CheckCircle2, Camera, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import { cn } from "@/lib/utils";
import { ProjectPreview } from "@/components/ProjectPreviews";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("css", css);

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    name: string;
    description: string;
    tech: string[];
    keyFeatures?: string[];
    innovation?: string[];
    demoPhotos?: string[];
    demoVideos?: string[];
    code?: {
      language: string;
      content: string;
    };
    live?: string;
    codeLink?: string;
    preview?: React.ReactNode;
  } | null;
}

export const ProjectModal = ({ open, onOpenChange, project }: ProjectModalProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset states when project changes or modal opens
  useEffect(() => {
    if (open) {
      setIsMinimized(false);
      setIsFullscreen(false);
    }
  }, [open, project]);

  if (!project) return null;

  const handleMinimize = () => setIsMinimized(!isMinimized);
  const handleFullscreen = () => setIsFullscreen(!isFullscreen);
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "transition-all duration-500 ease-in-out p-0 gap-0 overflow-hidden border-none shadow-2xl",
          "bg-black/40 backdrop-blur-3xl saturate-150", 
          isMinimized ? "h-12 w-96 overflow-hidden translate-y-[40vh]" : 
          isFullscreen ? "max-w-[98vw] max-h-[98vh] w-full h-full" : "max-w-5xl h-[85vh] w-[90vw]",
          "[&>button]:hidden animate-scale-in"
        )}
      >
        {/* macOS Style Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="group relative w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 flex items-center justify-center transition-all"
            >
              <X className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={handleMinimize}
              className="group relative w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 flex items-center justify-center transition-all"
            >
              <Minus className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={handleFullscreen}
              className="group relative w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 flex items-center justify-center transition-all"
            >
              {isFullscreen ? (
                <Minimize2 className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Maximize2 className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
          
          <DialogTitle className="text-white/60 text-xs font-medium tracking-wide">
            {project.name} {isMinimized ? "(Minimized)" : ""}
          </DialogTitle>
          
          <div className="w-16" /> {/* Spacer for balance */}
        </div>

        {!isMinimized && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Project Header Info */}
            <div className="p-8 pb-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                    {project.name}
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-[10px] uppercase tracking-widest rounded-full font-medium backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pb-1">
                  {project.live && (
                    <button
                      onClick={() => window.open(project.live, '_blank')}
                      className="group flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                    >
                      <Rocket className="w-4 h-4" />
                      Live Demo
                    </button>
                  )}
                  {project.codeLink && (
                    <button
                      onClick={() => window.open(project.codeLink, '_blank')}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-full font-semibold text-sm hover:bg-white/20 transition-all backdrop-blur-md"
                    >
                      <Github className="w-4 h-4" />
                      Source
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0 px-8 pb-8">
              <TabsList className="bg-white/5 border border-white/10 p-1 self-start rounded-xl mb-6">
                <TabsTrigger value="overview" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all text-xs">
                  <Lightbulb className="w-3.5 h-3.5" /> Overview
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all text-xs">
                  <Code2 className="w-3.5 h-3.5" /> Logic
                </TabsTrigger>
                <TabsTrigger value="features" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Features
                </TabsTrigger>
                <TabsTrigger value="Demo Photos" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all text-xs">
                  <Camera className="w-3.5 h-3.5" /> Demo Photos
                </TabsTrigger>
                <TabsTrigger value="Demo Videos" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all text-xs">
                  <Play className="w-3.5 h-3.5" /> Demo Videos
                </TabsTrigger>
              </TabsList>

              <div className="h-full flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <TabsContent value="overview" className="h-full m-0 p-0 outline-none overflow-y-auto overflow-x-hidden custom-scrollbar">
                   <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                      <div className="p-8 space-y-8 border-r border-white/5">
                        <section>
                          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                             <Rocket className="w-4 h-4 text-blue-400" /> Innovation & Core Concept
                          </h4>
                          <ul className="space-y-4">
                            {project.innovation?.map((item, i) => (
                              <li key={i} className="flex gap-3 text-sm text-white/50 leading-relaxed">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </section>
                      </div>
                      <div className="w-full h-full min-h-[300px] bg-black/40 flex items-center justify-center p-6">
                         <div className="w-full max-w-sm lg:max-w-md aspect-video">
                           <ProjectPreview 
                             projectName={project.name} 
                             description={project.description} 
                             tech={project.tech} 
                           />
                         </div>
                      </div>
                   </div>
                </TabsContent>

                <TabsContent value="code" className="flex-1 m-0 p-0 outline-none overflow-hidden flex flex-col">
                  {project.code ? (
                    <div className="flex-1 relative overflow-hidden flex flex-col h-full bg-[#0d1a2b]/30">
                      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
                        <span className="text-[10px] text-white/40 font-terminal tracking-widest uppercase">
                          Source: {project.code.language}.ts
                        </span>
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto custom-scrollbar p-6">
                        <SyntaxHighlighter
                          language={project.code.language}
                          style={atomOneDark}
                          customStyle={{
                            background: "transparent",
                            padding: 0,
                            margin: 0,
                            fontSize: "13px",
                            lineHeight: "1.6",
                            fontFamily: "var(--font-terminal)",
                          }}
                        >
                          {project.code.content}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/40 text-sm">
                      No code snippet available for this project.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="features" className=" m-1 p-10 outline-none overflow-y-auto custom-scrollbar">
                  {project.keyFeatures && project.keyFeatures.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      {project.keyFeatures.map((feature, i) => (
                        <div key={i} className="group p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all hover:bg-white/[0.08]">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                            <span className="text-white/90 text-sm font-medium leading-relaxed">{feature}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/40 text-sm">
                      No features listed for this project.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="Demo Photos" className=" m-1 p-6 outline-none overflow-y-auto custom-scrollbar">
                  {project.demoPhotos && project.demoPhotos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                      {project.demoPhotos.map((photo, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/50 aspect-video flex items-center justify-center shadow-lg">
                           <img 
                             src={photo} 
                             alt={`${project.name} demo ${i + 1}`} 
                             className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                             loading="lazy"
                           />
                           {/* Hover overlay for better aesthetics */}
                           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm gap-3">
                      <Camera className="w-8 h-8 opacity-20" />
                      <p>Demo photos coming soon for this project.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="Demo Videos" className="m-1 p-6 outline-none overflow-y-auto custom-scrollbar">
                  {project.demoVideos && project.demoVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                      {project.demoVideos.map((video, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/50 aspect-video flex items-center justify-center shadow-lg">
                           <video 
                             src={video} 
                             className="object-cover w-full h-full"
                             controls
                             preload="metadata"
                           >
                             Your browser does not support the video tag.
                           </video>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm gap-3">
                      <Play className="w-8 h-8 opacity-20" />
                      <p>Demo videos coming soon for this project.</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};