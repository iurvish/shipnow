"use client";

import { memo, useRef, useCallback } from "react";
import type { DatabasePerson } from "@/lib/actions/chat-actions";
import {
  GraduationCap,
  Briefcase,
  User,
  ChevronsLeftRight,
} from "lucide-react";
import { useSimpleArtifact } from "../../hooks/use-user-detail-panel";

interface PersonCardProps {
  person: DatabasePerson;
  isSelected?: boolean;
}

export function PersonCard({ person, isSelected = false }: PersonCardProps) {
  const { openArtifact } = useSimpleArtifact();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    const boundingBox = cardRef.current?.getBoundingClientRect();

    if (boundingBox) {
      openArtifact({
        type: "user",
        data: person,
        boundingBox: {
          top: boundingBox.top,
          left: boundingBox.left,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      });
    }
  }, [person, openArtifact]);

  const fullName = `${person.first_name} ${person.last_name}`;
  const skills = person.technical_profile?.skills || [];
  const university = person.personal_details?.university;

  // Helper function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="group relative w-80 h-[380px] p-3 bg-card inline-flex justify-start items-start gap-2.5 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]"
      style={{
        clipPath:
          "polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 0% 100%)",
      }}
    >
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Hover indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <ChevronsLeftRight className="w-4 h-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
      </div>

      <div className="flex-1 inline-flex flex-col justify-start items-start h-full">
        {/* Top section - Header, Bio, Skills */}
        <div className="flex flex-col gap-3.5 flex-1">
          <div className="inline-flex justify-start items-center gap-3">
            <div
              className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
              style={{
                clipPath:
                  "polygon(0% 15%, 15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)",
              }}
            >
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="py-2 inline-flex flex-col justify-start items-start gap-2">
              <div className="justify-start leading-none">
                <span className="text-neutral-50 text-2xl font-bold font-mono leading-none">
                  {person.first_name}
                </span>
                <span className="text-neutral-50 text-sm font-bold font-mono leading-none">
                  {" "}
                </span>
                <span className="text-neutral-50 text-2xl font-bold font-mono leading-none">
                  {person.last_name}
                </span>
              </div>
              <div className="justify-start text-zinc-400 text-sm font-normal font-mono leading-none">
                {person.email}
              </div>
            </div>
          </div>

          <div className="self-stretch border-neutral-600 flex flex-col justify-start items-start gap-2 ">
            <div className="justify-start text-white text-base font-medium font-mono uppercase leading-none">
              Bio
            </div>
            <div className="self-stretch justify-start text-zinc-400 text-sm font-normal font-mono leading-snug">
              {person.bio ? truncateText(person.bio, 120) : "No bio available"}
            </div>
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-2 overflow-hidden">
            <div className="w-20 justify-start text-white text-base font-medium font-mono uppercase leading-none">
              SKILLS
            </div>
            <div className="inline-flex justify-start items-start gap-1.5 flex-wrap">
              {skills.length > 0 ? (
                skills.slice(0, 7).map((skill: string, index: number) => (
                  <div
                    key={index}
                    className="px-2 py-1.5 bg-zinc-100 flex justify-start items-center"
                  >
                    <div className="justify-start text-neutral-500 text-sm font-medium font-mono uppercase leading-none">
                      {skill}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-zinc-400 text-sm font-normal font-mono">
                  No skills listed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom section - Essentials */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2 overflow-hidden mt-auto">
          <div className="w-20 justify-start text-white text-base font-medium font-mono uppercase leading-none">
            Essentials
          </div>
          <div className="self-stretch pt-[3px] flex flex-col justify-start items-start">
            <div className="self-stretch inline-flex justify-start items-start overflow-hidden">
              <div className="flex-1 self-stretch p-1.5 border-l border-r-[0.50px] border-t border-b-[0.50px] border-neutral-600 flex justify-start items-start gap-1 ">
                <div className="p-[5px] bg-white/5 rounded-lg shadow-sm outline-[0.80px] outline-offset-[-0.80px] outline-white/20 flex justify-start items-start">
                  <GraduationCap
                    className="w-6 h-6 text-zinc-400"
                    strokeWidth={1.2}
                  />
                </div>
                <div className="self-stretch py-[3px] inline-flex flex-col justify-start items-start gap-0.5">
                  <div className="justify-start text-zinc-400 text-xs font-normal font-mono uppercase leading-none">
                    education
                  </div>
                  <div className="justify-start text-white text-sm font-normal font-mono leading-none">
                    {university ? truncateText(university, 9) : "Not specified"}
                  </div>
                </div>
              </div>
              <div className="flex-1 p-1.5 border-r border-t border-b-[0.50px] border-neutral-600 flex justify-start items-start gap-1 border-l-0">
                <div className="p-[5px] bg-white/5 rounded-lg shadow-sm outline-[0.80px] outline-offset-[-0.80px] outline-white/20 flex justify-start items-start ">
                  <Briefcase
                    className="w-6 h-6 text-zinc-400"
                    strokeWidth={1.2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
