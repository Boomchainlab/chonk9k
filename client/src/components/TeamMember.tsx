import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    medium?: string;
    telegram?: string;
  };
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio, socials = {} }) => {
  return (
    <Card className="card-gradient rounded-xl border border-gray-800">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <div className="w-24 h-24 rounded-full bg-primary mb-6 overflow-hidden"></div>
        
        <h3 className="font-['Montserrat'] font-semibold text-white text-xl mb-1">{name}</h3>
        <div className="text-primary font-medium mb-4">{role}</div>
        
        <p className="text-gray-400 text-sm mb-6">{bio}</p>
        
        <div className="flex space-x-4 mt-auto">
          {socials.twitter && (
            <a href={socials.twitter} className="text-gray-400 hover:text-white transition">
              <i className="fab fa-twitter"></i>
            </a>
          )}
          {socials.github && (
            <a href={socials.github} className="text-gray-400 hover:text-white transition">
              <i className="fab fa-github"></i>
            </a>
          )}
          {socials.linkedin && (
            <a href={socials.linkedin} className="text-gray-400 hover:text-white transition">
              <i className="fab fa-linkedin"></i>
            </a>
          )}
          {socials.instagram && (
            <a href={socials.instagram} className="text-gray-400 hover:text-white transition">
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {socials.medium && (
            <a href={socials.medium} className="text-gray-400 hover:text-white transition">
              <i className="fab fa-medium"></i>
            </a>
          )}
          {socials.telegram && (
            <a href={socials.telegram} className="text-gray-400 hover:text-white transition">
              <i className="fab fa-telegram"></i>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
