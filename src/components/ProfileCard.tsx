import { useState } from "react";
import { Github, Globe, Linkedin, Twitter, Instagram, Mail } from "lucide-react";
import { GitHubActivityRedesigned } from "./GitHubActivityRedesigned";
import { portfolioData } from "@/lib/portfolioData";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  role: string;
  profileCard: string;
  bio: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  instagram: string;
  email: string;
}

export const ProfileCard = ({
  name,
  role,
  profileCard,
  bio,
  location,
  github,
  linkedin,
  twitter,
  website,
  instagram,
  email
}: ProfileCardProps) => {
  const [showGitHubActivity, setShowGitHubActivity] = useState(false);

  // Extract GitHub username from the URL
  const githubUsername = github.split('/').pop() || "nathishwar";
  const mailto = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <>
      <div className="h-full flex flex-col bg-gradient-to-br from-[#0D1A2B] via-[#1F2D3D] to-[#3C4B57] border border-white/10 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/40 overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 group">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 relative overflow-hidden">
          {/* Decorative sheen */}
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

          <div className="flex flex-col items-center text-center relative z-10">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src="/micProfile.jpeg"
                alt="Nathishwar"
                className="w-full h-full rounded-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/1F2D3D/E7ECF4?text=NC';
                }}
              />
            </div>

            {/* Name and Role */}
            <h2 className="text-2xl font-bold text-foreground text-white">{name}</h2>
            <p className="text-primary font-medium mt-1 text-[#A3B1C4] font-bold">{role}</p>

            {/* Location */}
            <p className="text-muted-foreground text-sm mt-2 text-[#4DA8FF] font-bold flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {location}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="p-6 flex-1">
          <p className="text-foreground/80 text-center text-gray-300">
            Code is my craft, and building great user experience is my passion.
          </p>
        </div>

        {/* Social Links */}
        <div className="px-6 pb-4 flex justify-center space-x-4">
          {github && (
            <a
              href={`https://${github}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded-full bg-[#0D1A2B] border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200"
            >
              <Github className="w-5 h-5 text-white" />
            </a>
          )}
          {linkedin && (
            <a
              href={`https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 rounded-full bg-[#0D1A2B] border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </a>
          )}
          {instagram && (
            <a
              href={`https://${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="p-2 rounded-full bg-[#0D1A2B] border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
          )}
          {website && (
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="p-2 rounded-full bg-[#0D1A2B] border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200"
            >
              <Globe className="w-5 h-5 text-white" />
            </a>
          )}
        </div>

        {/* See My Recent Works Button */}
        <div className="p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowGitHubActivity(true)}
              className="flex-1 py-2 px-5 rounded-xl bg-gradient-to-br from-[#0D1A2B] via-[#1F2D3D] to-[#3C4B57] border border-white/10 backdrop-blur-xl text-[#E7ECF4] hover:from-cyan-600/30 hover:to-blue-600/30 hover:border-cyan-500/50 transition-all duration-300 flex items-center justify-center group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Recent Works
            </button>

            <button
              onClick={() => window.location.href = `mailto:${email}`}
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 backdrop-blur-xl text-[#E7ECF4] hover:from-cyan-600/50 hover:to-blue-600/50 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Hire Me
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Activity Modal */}
      {showGitHubActivity && (
        <GitHubActivityRedesigned
          username={githubUsername}
          onClose={() => setShowGitHubActivity(false)}
        />
      )}
    </>
  );
};