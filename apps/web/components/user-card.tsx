'use client';

import {
  memo,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { cn } from '@/lib/utils';
import type { DatabasePerson } from '@/lib/actions/chat-actions';
import { UserIcon, MailIcon, GithubIcon, MapPinIcon } from 'lucide-react';
import { useUserArtifact } from '@/hooks/use-user-artifact';
import equal from 'fast-deep-equal';

interface UserCardProps {
  person: DatabasePerson;
  isSelected?: boolean;
}

export function UserCard({ person, isSelected = false }: UserCardProps) {
  const { setUserArtifact } = useUserArtifact();
  const hitboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boundingBox = hitboxRef.current?.getBoundingClientRect();

    if (isSelected && boundingBox) {
      setUserArtifact((artifact) => ({
        ...artifact,
        boundingBox: {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      }));
    }
  }, [isSelected, setUserArtifact]);

  const displayName = person.first_name && person.last_name
    ? `${person.first_name} ${person.last_name}`
    : person.first_name || person.last_name || 'Unknown User';

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const boundingBox = event.currentTarget.getBoundingClientRect();

      setUserArtifact((artifact) => ({
        ...artifact,
        userId: person.id,
        title: displayName,
        userData: {
          id: person.id,
          firstName: person.first_name,
          lastName: person.last_name,
          email: person.email,
          bio: person.bio,
          personalDetails: person.personal_details ? {
            university: person.personal_details.university,
            department: person.personal_details.department,
            degreeLevel: person.personal_details.degree_level,
            dateOfBirth: person.personal_details.date_of_birth,
          } : null,
          technicalProfile: person.technical_profile,
        },
        isVisible: true,
        status: 'idle',
        boundingBox: {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      }));
    },
    [setUserArtifact, person, displayName],
  );

  return (
    <div className="relative w-full cursor-pointer">
      {/* Hitbox Layer */}
      <div
        className="size-full absolute top-0 left-0 rounded-xl z-10"
        ref={hitboxRef}
        onClick={handleClick}
        role="presentation"
        aria-hidden="true"
      >
        <div className="w-full p-4 flex justify-end items-center">
          <div className="absolute right-[9px] top-[13px] p-2 hover:dark:bg-zinc-700 rounded-md hover:bg-zinc-100">
            <UserIcon className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div
        className={cn(
          "bg-background border border-border rounded-t-2xl overflow-hidden transition-all duration-200",
          isSelected && "ring-2 ring-primary"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30 flex flex-row gap-2 items-start sm:items-center justify-between">
          <div className="flex flex-row items-start sm:items-center gap-3">
            <div className="text-muted-foreground">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="-translate-y-1 sm:translate-y-0 font-medium truncate">
              {displayName}
            </div>
          </div>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="h-[257px] overflow-y-scroll border-b border-border bg-muted/20 p-4">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="flex items-start gap-3">
              <MailIcon className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">{person.email}</p>
                {person.bio && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {person.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Education */}
            {person.personal_details && (
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium">{person.personal_details.university}</p>
                  <p>{person.personal_details.department}</p>
                  <p>{person.personal_details.degree_level}</p>
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {person.technical_profile && (
              <div className="space-y-2">
                <p className="text-xs font-medium">
                  Experience: {person.technical_profile.experience}
                </p>
                
                {person.technical_profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {person.technical_profile.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {person.technical_profile.skills.length > 4 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                        +{person.technical_profile.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* GitHub Link */}
                {person.technical_profile.github && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <GithubIcon className="h-3 w-3" />
                    <span>GitHub Profile</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const MemoizedUserCard = memo(UserCard, (prevProps, nextProps) => {
  if (!equal(prevProps.person, nextProps.person)) return false;
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  return true;
});
