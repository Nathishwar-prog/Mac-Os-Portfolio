import { portfolioData } from "@/lib/portfolioData";
import { ProjectModal } from "@/components/ProjectModal";
import { ProjectPreview } from "@/components/ProjectPreviews";
import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpRight, Github, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    portfolioData.projects.forEach(project => {
      project.tech.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, []);

  // Filter projects based on search term and selected technology
  const filteredProjects = useMemo(() => {
    return portfolioData.projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTech = selectedTech ? project.tech.includes(selectedTech) : true;
      
      return matchesSearch && matchesTech;
    });
  }, [searchTerm, selectedTech]);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-12 md:px-12 bg-black text-[#E7ECF4]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <header className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Selected Works
          </h1>
          <p className="text-white/40 text-lg font-medium leading-relaxed">
            A collection of intelligent systems, developer tools, and creative AI experiments.
          </p>
        </header>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-2 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Search by name or tech..."
              className="w-full pl-12 pr-4 py-3 bg-transparent text-sm border-none focus:ring-0 placeholder-white/20 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          {/* Filter */}
          <div className="flex items-center gap-4 w-full md:w-auto px-2">
            <Filter className="w-4 h-4 text-white/20 shrink-0" />
            <select
              className="bg-transparent border-none text-sm font-semibold text-white/60 focus:ring-0 cursor-pointer appearance-none pr-8"
              value={selectedTech || ""}
              onChange={(e) => setSelectedTech(e.target.value || null)}
            >
              <option value="">All Stack</option>
              {allTechnologies.map(tech => (
                <option key={tech} value={tech} className="bg-[#121212]">{tech}</option>
              ))}
            </select>

            <div className="h-8 w-px bg-white/10" />

            {/* View Toggle */}
            <div className="flex bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "grid" ? "bg-white/10 text-white shadow-lg" : "text-white/20 hover:text-white/40")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "list" ? "bg-white/10 text-white shadow-lg" : "text-white/20 hover:text-white/40")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        <div className={cn(
          "grid gap-8 transition-all duration-500",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        )}>
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              onClick={() => handleProjectClick(project)}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04] p-2",
                viewMode === "list" && "flex flex-col md:flex-row md:items-center gap-8 px-8 py-6"
              )}
            >
              {/* Preview Container */}
              <div className={cn(
                "overflow-hidden rounded-[2rem] transition-all duration-700 aspect-video",
                viewMode === "grid" ? "w-full" : "w-full md:w-80 shrink-0"
              )}>
                <ProjectPreview 
                  projectName={project.name} 
                  description={project.description} 
                  tech={project.tech} 
                />
              </div>

              {/* Info Container */}
              <div className={cn(
                "flex flex-col justify-between p-6",
                viewMode === "list" && "flex-1 p-0"
              )}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h2>
                    <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  <p className="text-white/40 text-[15px] font-medium leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2 py-1 bg-white/5 rounded-md">
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-[10px] font-bold text-white/20 px-2 py-1">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors">
                        <Github className="w-3.5 h-3.5" /> Source
                      </button>
                      <button className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Live
                      </button>
                   </div>
                   <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">
                      Explore Detail
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <footer className="pt-24 pb-12 border-t border-white/5 flex flex-col items-center gap-8">
           <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Have a project in mind?</h3>
              <p className="text-white/40">Open for collaborations and interesting AI projects.</p>
           </div>
           <button 
             onClick={() => window.open("https://nathishwar-projects.netlify.app/", "_blank")}
             className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-white/5"
           >
             View Extended Archive <ArrowUpRight className="w-4 h-4" />
           </button>
        </footer>

      </div>

      <ProjectModal 
        open={isModalOpen} 
        onOpenChange={closeModal} 
        project={selectedProject} 
      />
    </div>
  );
};